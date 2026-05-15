"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { savePasswordSet } from "@/app/actions/onboarding";

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

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) { setError(updateError.message); setLoading(false); return; }

    // Save password_set_at server-side — the browser client's session may not
    // reflect the rotated token yet, so a server action reading request cookies
    // is more reliable here. It also returns whether the email is confirmed.
    const { error: saveError, emailConfirmed } = await savePasswordSet();
    if (saveError) { setError(saveError); setLoading(false); return; }

    // Invite links go through verifyOtp(type:'invite') which confirms the email
    // immediately. If confirmed, skip verification and go straight to TOTP setup.
    // If somehow unconfirmed (edge-case project config), show the verify page.
    router.push(emailConfirmed ? "/setup-totp" : `/verify-email?email=${encodeURIComponent(email)}`);
  }

  return { status, email, password, setPassword, confirm, setConfirm, error, loading, submit };
}
