import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "projects";

function publicUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("project_images")
      .select("project_id, image_type, storage_path, display_bottom_offset");

    if (error) {
      console.error("[/api/projects/images]", error.message);
      return NextResponse.json({});
    }

    const map: Record<string, { bento: string | null; display: string | null; displayBottomOffset: number }> = {};
    for (const row of data ?? []) {
      if (!map[row.project_id]) map[row.project_id] = { bento: null, display: null, displayBottomOffset: 0 };
      if (row.image_type === "display") {
        map[row.project_id].display = publicUrl(row.storage_path);
        map[row.project_id].displayBottomOffset = row.display_bottom_offset ?? 0;
      } else {
        map[row.project_id].bento = publicUrl(row.storage_path);
      }
    }

    return NextResponse.json(map);
  } catch (err) {
    console.error("[/api/projects/images]", err);
    return NextResponse.json({});
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const projectId = formData.get("project_id") as string;
  const imageType = formData.get("image_type") as "bento" | "display";
  const file = formData.get("file") as File;

  if (!projectId || !imageType || !file) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "webp";
  const path = `${projectId}/${imageType}.${ext}`;

  const admin = createAdminClient();
  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { error: dbError } = await admin.from("project_images").upsert(
    { project_id: projectId, image_type: imageType, storage_path: path, uploaded_by: user.id },
    { onConflict: "project_id,image_type" }
  );

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ url: publicUrl(path) });
}

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { project_id, display_bottom_offset } = await request.json();
  if (!project_id || display_bottom_offset === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("project_images")
    .update({ display_bottom_offset })
    .eq("project_id", project_id)
    .eq("image_type", "display");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
