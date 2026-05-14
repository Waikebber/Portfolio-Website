"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface OnboardingStatus {
  inviteClickedAt: string | null;
  passwordSetAt: string | null;
  totpEnabledAt: string | null;
}

export function useOnboardingStatus() {
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from("onboarding_status")
        .select("invite_clicked_at, password_set_at, totp_enabled_at")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setStatus({
          inviteClickedAt: data.invite_clicked_at,
          passwordSetAt: data.password_set_at,
          totpEnabledAt: data.totp_enabled_at,
        });
      }
      setLoading(false);
    });
  }, []);

  return { status, loading };
}
