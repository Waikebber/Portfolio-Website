"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Status = "loading" | "ready" | "invalid";

export function useAcceptInvite() {
  const router = useRouter();

  const [status, setStatus] = useState<Status>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      // No session at all → link is genuinely expired or already used
      if (!user) { setStatus("invalid"); return; }

      // Only invited users go through this flow
      if (!user.invited_at) { setStatus("invalid"); return; }

      let { data: onboarding } = await supabase
        .from("onboarding_status")
        .select("password_set_at, totp_enabled_at")
        .eq("user_id", user.id)
        .maybeSingle();

      // Row missing means the server-side insert in auth/callback failed.
      // Recover client-side rather than dead-ending the user.
      if (!onboarding) {
        await supabase.from("onboarding_status").insert({
          user_id: user.id,
          invite_clicked_at: new Date().toISOString(),
        });
        onboarding = { password_set_at: null, totp_enabled_at: null };
      }

      if (onboarding.password_set_at) {
        if (!user.email_confirmed_at) {
          router.replace(`/verify-email?email=${encodeURIComponent(user.email ?? "")}`);
          return;
        }
        router.replace(onboarding.totp_enabled_at ? "/admin" : "/setup-totp");
        return;
      }

      setEmail(user.email ?? "");
      setStatus("ready");
    });
  }, []);

  async function submit() {
    setError(null);

    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }

    setLoading(true);
    const supabase = createClient();

    // Capture user before updateUser — session token rotates after the call
    // and a subsequent getUser() may return null, silently skipping the DB write.
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) { setError("Session expired. Please use the invite link again."); setLoading(false); return; }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) { setError(updateError.message); setLoading(false); return; }

    // upsert so the row is created even if the server-side insert in auth/callback
    // was skipped (e.g. PKCE flow race) — only touches password_set_at column.
    await supabase
      .from("onboarding_status")
      .upsert({ user_id: currentUser.id, password_set_at: new Date().toISOString() }, { onConflict: "user_id" });

    router.push(`/verify-email?email=${encodeURIComponent(currentUser.email ?? "")}`);
  }

  return { status, email, password, setPassword, confirm, setConfirm, error, loading, submit };
}
