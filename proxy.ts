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

  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (user) {
    // Invited users (user.invited_at set by Supabase for all inviteUserByEmail accounts)
    // must finish onboarding before touching any admin page — including the login page.
    if (user.invited_at) {
      const { data: onboarding } = await supabase
        .from("onboarding_status")
        .select("password_set_at, totp_enabled_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!onboarding?.password_set_at) {
        return NextResponse.redirect(new URL("/accept-invite", request.url));
      }
      if (!onboarding?.totp_enabled_at) {
        return NextResponse.redirect(new URL("/setup-totp", request.url));
      }
    }

    const { data: roleData } = await supabase
      .from("admin_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();
    const role = roleData?.role ?? "guest-admin";

    // Already logged in — redirect away from login to the right landing page
    if (isLoginPage) {
      const dest = role === "guest-admin" ? "/admin/guitar-tabs" : "/admin";
      return NextResponse.redirect(new URL(dest, request.url));
    }

    // Role-based access: guests can only reach guitar-tabs and settings
    const isGuestAllowed =
      pathname.startsWith("/admin/guitar-tabs") || pathname.startsWith("/admin/settings");
    if (role === "guest-admin" && !isGuestAllowed) {
      return NextResponse.redirect(new URL("/admin/guitar-tabs", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
