import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const path = request.nextUrl.searchParams.get("path");
  if (!path) return NextResponse.json({ error: "Missing path" }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from("guitar-tabs")
    .createSignedUrl(path, 300);

  if (error || !data?.signedUrl)
    return NextResponse.json({ error: error?.message ?? "Failed to generate URL" }, { status: 500 });

  return NextResponse.json({ url: data.signedUrl });
}
