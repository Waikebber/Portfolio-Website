import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const code = searchParams.get("code");

  const supabase = await createClient();
  let authed = false;

  if (tokenHash && type) {
    // token_hash flow — triggered when email template links directly to /auth/callback
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "invite",
    });
    authed = !error;
  } else if (code) {
    // PKCE code exchange flow — triggered when Supabase redirects with ?code=
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    authed = !error;
  }

  if (!authed) return NextResponse.redirect(`${origin}/admin?error=invite`);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/admin?error=invite`);

  const { data: roleData } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  const dest = roleData?.role === "full-admin" ? "/admin/dashboard" : "/admin/guitar-tabs";
  return NextResponse.redirect(`${origin}${dest}`);
}
