"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Saves password_set_at server-side using the request cookies — more reliable
 * than doing it on the browser client after updateUser() rotates the session.
 * Returns whether the user's email is confirmed so the caller can decide
 * whether to show the verify-email page.
 */
export async function savePasswordSet(): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Session expired. Please use the invite link again." };

  const { error } = await supabase
    .from("onboarding_status")
    .upsert({ user_id: user.id, password_set_at: new Date().toISOString() }, { onConflict: "user_id" });

  return { error: error?.message ?? null };
}

/**
 * Resends a signup confirmation email. Only works when the email is
 * genuinely unconfirmed — Supabase silently no-ops for confirmed addresses.
 */
export async function resendEmailConfirmation(email: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${siteUrl}/auth/callback` },
  });
  return { error: error?.message ?? null };
}
