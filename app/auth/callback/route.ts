import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const code = searchParams.get("code");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const supabase = await createClient();
  let authed = false;

  if (tokenHash && type) {
    // token_hash flow — email template links directly to /auth/callback
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "invite",
    });
    authed = !error;
  } else if (code) {
    // PKCE code exchange flow — Supabase redirects with ?code=
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    authed = !error;
  }

  if (!authed) return NextResponse.redirect(`${siteUrl}/admin/login?error=invite`);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${siteUrl}/admin/login?error=invite`);

  // Detect invite flow whether Supabase used token_hash (type=invite) or PKCE (no type).
  // user.invited_at is set by Supabase for any user created via inviteUserByEmail.
  const isInviteFlow = type === "invite" || !!user.invited_at;

  if (isInviteFlow) {
    const { data: onboarding } = await supabase
      .from("onboarding_status")
      .select("invite_clicked_at, password_set_at, totp_enabled_at")
      .eq("user_id", user.id)
      .maybeSingle();

    // Record invite click — insert on first visit, update if row exists without timestamp
    if (!onboarding) {
      await supabase.from("onboarding_status").insert({
        user_id: user.id,
        invite_clicked_at: new Date().toISOString(),
      });
    } else if (!onboarding.invite_clicked_at) {
      await supabase
        .from("onboarding_status")
        .update({ invite_clicked_at: new Date().toISOString() })
        .eq("user_id", user.id);
    }

    if (onboarding?.totp_enabled_at) {
      const { data: roleData } = await supabase
        .from("admin_roles").select("role").eq("user_id", user.id).maybeSingle();
      const dest = roleData?.role === "full-admin" ? "/admin" : "/admin/guitar-tabs";
      return NextResponse.redirect(`${siteUrl}${dest}`);
    }
    if (onboarding?.password_set_at) {
      return NextResponse.redirect(`${siteUrl}/setup-totp`);
    }
    return NextResponse.redirect(`${siteUrl}/accept-invite`);
  }

  const { data: roleData } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  const dest = roleData?.role === "full-admin" ? "/admin" : "/admin/guitar-tabs";
  return NextResponse.redirect(`${siteUrl}${dest}`);
}
