import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function requireFullAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("admin_roles").select("role").eq("user_id", user.id).maybeSingle();
  return data?.role === "full-admin" ? user : null;
}

export async function GET(request: NextRequest) {
  const songId = request.nextUrl.searchParams.get("songId");
  const supabase = await createClient();
  const query = supabase.from("tabs").select("*, tunings(*)").order("created_at");
  const { data, error } = songId ? await query.eq("song_id", songId) : await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const user = await requireFullAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { description, song_id, tuning_id, capo, source_type, source_value } = await request.json();
  if (!source_type || !source_value?.trim()) return NextResponse.json({ error: "Source is required" }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("tabs")
    .insert({ description: description?.trim() || null, song_id, tuning_id: tuning_id || null, capo: capo ?? null, source_type, source_value: source_value.trim(), created_by: user.id })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
