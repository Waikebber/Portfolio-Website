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

export async function POST(request: NextRequest) {
  const user = await requireFullAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const filename = formData.get("filename") as string;
  const region = formData.get("region") as string;
  const location = formData.get("location") as string;
  const displayOrder = parseInt(formData.get("display_order") as string) || 0;

  if (!file || !filename || !region || !location) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { error: uploadError } = await admin.storage
    .from("photos")
    .upload(filename, file, { upsert: true });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { error: insertError } = await admin.from("photos").insert({
    filename,
    location,
    region,
    country: REGION_TO_COUNTRY[region] ?? "unknown",
    display_order: displayOrder,
  });

  if (insertError) {
    await admin.storage.from("photos").remove([filename]);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
