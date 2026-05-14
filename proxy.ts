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

  if (user && isLoginPage) {
    // Fetch role to redirect to the right landing page
    const { data: roleData } = await supabase
      .from("admin_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();
    const role = roleData?.role ?? "guest-admin";
    const dest = role === "guest-admin" ? "/admin/guitar-tabs" : "/admin";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  if (user) {
    // Fetch role to enforce access
    const { data: roleData } = await supabase
      .from("admin_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();
    const role = roleData?.role ?? "guest-admin";

    const isGuestAllowed = pathname.startsWith("/admin/guitar-tabs") || pathname.startsWith("/admin/settings") || pathname === "/admin/accept-invite";
    if (role === "guest-admin" && !isGuestAllowed) {
      return NextResponse.redirect(new URL("/admin/guitar-tabs", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
