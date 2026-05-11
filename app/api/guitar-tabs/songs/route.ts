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
  const artistId = request.nextUrl.searchParams.get("artistId");
  const supabase = await createClient();
  const query = supabase.from("songs").select("*").order("title");
  const { data, error } = artistId ? await query.eq("artist_id", artistId) : await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const user = await requireFullAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, title_translated, artist_id } = await request.json();
  if (!title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("songs")
    .insert({ title: title.trim(), title_translated: title_translated?.trim() || null, artist_id, created_by: user.id })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
