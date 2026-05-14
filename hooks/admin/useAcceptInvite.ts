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
      if (!user) { setStatus("invalid"); return; }

      const { data: onboarding } = await supabase
        .from("onboarding_status")
        .select("password_set_at, totp_enabled_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!onboarding) { setStatus("invalid"); return; }

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

    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from("onboarding_status")
      .update({ password_set_at: new Date().toISOString() })
      .eq("user_id", user!.id);

    router.push("/setup-totp");
  }

  return { status, email, password, setPassword, confirm, setConfirm, error, loading, submit };
}
