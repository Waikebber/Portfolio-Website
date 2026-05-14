"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useTotp } from "@/hooks/admin/useTotp";
import QRCodeCard from "@/components/admin/mfa/QRCodeCard";
import CodeInput from "@/components/admin/mfa/CodeInput";

type Status = "loading" | "ready" | "invalid";

export default function SetupTotpPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setStatus("invalid"); return; }

      const { data: onboarding } = await supabase
        .from("onboarding_status")
        .select("password_set_at, totp_enabled_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!onboarding?.password_set_at) { setStatus("invalid"); return; }

      if (onboarding.totp_enabled_at) {
        const { data: roleData } = await supabase
          .from("admin_roles").select("role").eq("user_id", user.id).maybeSingle();
        router.replace(roleData?.role === "full-admin" ? "/admin" : "/admin/guitar-tabs");
        return;
      }

      setStatus("ready");
    });
  }, []);

  async function onTotpSuccess() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("onboarding_status")
      .update({ totp_enabled_at: new Date().toISOString() })
      .eq("user_id", user.id);

    const { data: roleData } = await supabase
      .from("admin_roles").select("role").eq("user_id", user.id).maybeSingle();
    router.push(roleData?.role === "full-admin" ? "/admin" : "/admin/guitar-tabs");
  }

  const { qrCode, secret, code, setCode, verify, loading, error } = useTotp(onTotpSuccess);

  if (status === "loading") return null;

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div
        className="w-[400px] rounded-[16px] p-10 flex flex-col"
        style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p className="text-teal text-[22px] font-medium tracking-[1.76px] text-center mb-4">KW</p>

        {status === "invalid" ? (
          <>
            <h1 className="text-warm-white text-[24px] font-medium text-center mb-2">Access denied</h1>
            <p className="text-muted text-[13px] text-center">
              Complete account setup before enabling two-factor authentication.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-warm-white text-[24px] font-medium text-center mb-1">Set up 2FA</h1>
            <p className="text-muted text-[13px] text-center mb-6">
              Scan the QR code with your authenticator app, then enter the 6-digit code.
            </p>

            <div className="w-full h-px mb-6" style={{ background: "rgba(255,255,255,0.08)" }} />

            <div className="flex justify-center">
              {qrCode && <QRCodeCard qrCode={qrCode} secret={secret} />}
            </div>

            <CodeInput value={code} onChange={setCode} />

            {error && <p className="text-[11px] text-center mb-3" style={{ color: "#e54d4d" }}>{error}</p>}

            <button
              onClick={verify}
              disabled={loading || code.length !== 6}
              className="w-full h-[44px] rounded-[6px] text-[14px] font-medium transition-opacity disabled:opacity-50 cursor-pointer"
              style={{ background: "#61c1d8", color: "#0d0d0f" }}
            >
              {loading ? "Verifying…" : "Enable 2FA"}
            </button>
          </>
        )}
      </div>

      <Link
        href="/"
        className="absolute top-8 left-8 text-[12px] transition-colors hover:text-warm-white"
        style={{ color: "#444" }}
      >
        ← Back to site
      </Link>
    </div>
  );
}
