"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface TotpState {
  qrCode: string;
  secret: string;
  code: string;
  setCode: (code: string) => void;
  verify: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useTotp(onSuccess: () => void): TotpState {
  const [factorId, setFactorId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    async function enroll() {
      // Try direct enrollment first — Supabase auto-replaces any existing
      // unverified factor and returns fresh QR code + secret.
      let { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });

      if (error) {
        // Enrollment failed (stale factor state). Clean up unverified factors
        // and retry once.
        const { data: existing } = await supabase.auth.mfa.listFactors();
        for (const f of existing?.totp ?? []) {
          if (f.status !== "verified") {
            await supabase.auth.mfa.unenroll({ factorId: f.id });
          }
        }
        ({ data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" }));
      }

      if (error || !data) return;
      setFactorId(data.id);
      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
    }
    enroll();
  }, []);

  async function verify() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
    if (challengeError) { setError(challengeError.message); setLoading(false); return; }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    });

    if (verifyError) { setError(verifyError.message); setLoading(false); return; }
    onSuccess();
  }

  return { qrCode, secret, code, setCode, verify, loading, error };
}
