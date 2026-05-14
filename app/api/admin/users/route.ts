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

export async function GET() {
  const currentUser = await requireFullAdmin();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: { users }, error } = await admin.auth.admin.listUsers();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: roles } = await admin.from("admin_roles").select("user_id, role");
  const roleMap = (roles ?? []).reduce<Record<string, string>>((acc, r) => {
    acc[r.user_id] = r.role;
    return acc;
  }, {});

  const { data: onboardingRows } = await admin
    .from("onboarding_status")
    .select("user_id, invite_clicked_at, password_set_at, totp_enabled_at");
  const onboardingMap = (onboardingRows ?? []).reduce<Record<string, {
    user_id: string;
    invite_clicked_at: string | null;
    password_set_at: string | null;
    totp_enabled_at: string | null;
  }>>((acc, r) => {
    acc[r.user_id] = r;
    return acc;
  }, {});

  const result = users
    .filter((u) => u.id !== currentUser.id)
    .map((u) => ({
      id: u.id,
      email: u.email ?? "",
      role: roleMap[u.id] ?? "guest-admin",
      created_at: u.created_at,
      onboarding: onboardingMap[u.id] ?? null,
    }))
    .sort((a, b) => a.email.localeCompare(b.email));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const currentUser = await requireFullAdmin();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email } = await request.json();
  if (!email?.trim()) return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.headers.get("origin") ?? "";
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.inviteUserByEmail(email.trim(), {
    redirectTo: `${siteUrl}/auth/callback`,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: NextRequest) {
  const currentUser = await requireFullAdmin();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { user_id, role } = await request.json();
  if (!["full-admin", "guest-admin"].includes(role))
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin
    .from("admin_roles")
    .upsert({ user_id, role }, { onConflict: "user_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
