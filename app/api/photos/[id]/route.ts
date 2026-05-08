import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const REGION_TO_COUNTRY: Record<string, string> = {
  Italy: "ita",
  Japan: "jpn",
  California: "usa",
};

async function requireFullAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  return data?.role === "full-admin" ? user : null;
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const user = await requireFullAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const { region, location } = await request.json();

  const admin = createAdminClient();
  const { error } = await admin
    .from("photos")
    .update({ region, location, country: REGION_TO_COUNTRY[region] ?? "unknown" })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const user = await requireFullAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const admin = createAdminClient();

  const { data: photo } = await admin
    .from("photos")
    .select("filename")
    .eq("id", id)
    .single();

  if (photo) {
    await admin.storage.from("photos").remove([photo.filename]);
  }

  const { error } = await admin.from("photos").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
