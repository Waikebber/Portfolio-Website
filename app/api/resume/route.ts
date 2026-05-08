import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: roleData } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (roleData?.role !== "full-admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const oldId = formData.get("old_id") as string | null;
  const oldStoragePath = formData.get("old_storage_path") as string | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const admin = createAdminClient();
  const storagePath = `resume/${Date.now()}-${file.name}`;

  const { error: uploadError } = await admin.storage
    .from("docs")
    .upload(storagePath, file, { upsert: true });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { error: insertError } = await admin
    .from("resume")
    .insert({ filename: file.name, storage_path: storagePath });

  if (insertError) {
    await admin.storage.from("docs").remove([storagePath]);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  if (oldId && oldStoragePath) {
    await admin.storage.from("docs").remove([oldStoragePath]);
    await admin.from("resume").delete().eq("id", oldId);
  }

  return NextResponse.json({ ok: true });
}
