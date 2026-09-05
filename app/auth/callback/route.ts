import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    `${request.nextUrl.protocol}//${request.nextUrl.host}`;

  // Collect cookies that Supabase sets during auth so we can apply them
  // directly onto each redirect response. Using createClient() from server.ts
  // writes via cookies().set(), which does NOT propagate into a NextResponse
  // object — the browser would receive the redirect with no session cookies.
  const pendingCookies: { name: string; value: string; options: Parameters<typeof NextResponse.prototype.cookies.set>[2] }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          pendingCookies.push(...cookiesToSet);
        },
      },
    }
  );

  function redirect(url: string) {
    const res = NextResponse.redirect(url);
    pendingCookies.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
    return res;
  }

  let authed = false;

  if (tokenHash && type) {
    // token_hash flow — email template links directly to /auth/callback
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "signup" | "invite" | "magiclink" | "recovery" | "email_change" | "email",
    });
    authed = !error;
  } else if (code) {
    // createServerClient hardcodes flowType:"pkce" and cannot be overridden.
    // Admin invites never store a code verifier, so exchangeCodeForSession always
    // throws AuthPKCECodeVerifierMissingError. Use the plain supabase-js client
    // (defaults to flowType:"implicit") to bypass that check, then hand the
    // session off to the SSR client so its cookie handlers fire.
    const { createClient: createPlainClient } = await import("@supabase/supabase-js");
    const plainClient = createPlainClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );
    const { data, error } = await plainClient.auth.exchangeCodeForSession(code);
    if (!error && data.session) {
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
      authed = true;
    }
  }

  if (!authed) return redirect(`${siteUrl}/admin/login?error=invite`);

  // Recovery bypasses invite/onboarding/role logic entirely.
  // Only allow relative paths so this can't be turned into an open redirect.
  if (next && next.startsWith("/")) {
    return redirect(`${siteUrl}${next}`);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect(`${siteUrl}/admin/login?error=invite`);

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
      return redirect(`${siteUrl}${dest}`);
    }
    if (onboarding?.password_set_at) {
      return redirect(`${siteUrl}/setup-totp`);
    }
    return redirect(`${siteUrl}/accept-invite`);
  }

  const { data: roleData } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  const dest = roleData?.role === "full-admin" ? "/admin" : "/admin/guitar-tabs";
  return redirect(`${siteUrl}${dest}`);
}
