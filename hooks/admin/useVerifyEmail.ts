"use client";

import { useState, useEffect } from "react";
import { resendEmailConfirmation } from "@/app/actions/onboarding";

export function useVerifyEmail(initialEmail: string) {
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function resend() {
    if (!initialEmail || cooldown > 0 || sending) return;
    setError(null);
    setSending(true);
    const { error: resendError } = await resendEmailConfirmation(initialEmail);
    setSending(false);
    if (resendError) { setError(resendError); return; }
    setSent(true);
    setCooldown(60);
  }

  return { cooldown, sending, sent, error, resend };
}
