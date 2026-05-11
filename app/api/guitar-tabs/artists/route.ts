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
  const genreId = request.nextUrl.searchParams.get("genreId");
  const supabase = await createClient();
  const query = supabase.from("artists").select("*").order("name");
  const { data, error } = genreId ? await query.eq("genre_id", genreId) : await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const user = await requireFullAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, genre_id, name_translated } = await request.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("artists")
    .insert({ name: name.trim(), genre_id, name_translated: name_translated?.trim() || null, created_by: user.id })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
