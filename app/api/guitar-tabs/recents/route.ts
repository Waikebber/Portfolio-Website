import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tab_id } = await request.json();
  if (!tab_id) return NextResponse.json({ error: "tab_id required" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin
    .from("tab_recents")
    .upsert({ user_id: user.id, tab_id, accessed_at: new Date().toISOString() }, { onConflict: "user_id,tab_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
