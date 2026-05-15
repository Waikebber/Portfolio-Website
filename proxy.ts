import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isAcceptInvitePage = pathname === "/accept-invite";

  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (user) {
    if (user.invited_at) {
      const { data: onboarding } = await supabase
        .from("onboarding_status")
        .select("password_set_at, totp_enabled_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!onboarding?.password_set_at) {
        // Password not set yet — only /accept-invite is allowed
        if (!isAcceptInvitePage) {
          return NextResponse.redirect(new URL("/accept-invite", request.url));
        }
        return supabaseResponse;
      }

      // Password already set — /accept-invite must not be accessible again
      if (isAcceptInvitePage) {
        return NextResponse.redirect(
          new URL(onboarding.totp_enabled_at ? "/admin" : "/setup-totp", request.url)
        );
      }

      if (!onboarding.totp_enabled_at) {
        return NextResponse.redirect(new URL("/setup-totp", request.url));
      }
    }

    const { data: roleData } = await supabase
      .from("admin_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();
    const role = roleData?.role ?? "guest-admin";

    if (isLoginPage) {
      const dest = role === "guest-admin" ? "/admin/guitar-tabs" : "/admin";
      return NextResponse.redirect(new URL(dest, request.url));
    }

    const isGuestAllowed =
      pathname.startsWith("/admin/guitar-tabs") || pathname.startsWith("/admin/settings");
    if (role === "guest-admin" && !isGuestAllowed) {
      return NextResponse.redirect(new URL("/admin/guitar-tabs", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/accept-invite"],
};
