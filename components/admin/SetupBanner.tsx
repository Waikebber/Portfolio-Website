"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useSetupStatus } from "@/hooks/admin/useSetupStatus";

export default function SetupBanner() {
  const status = useSetupStatus();
  const [resent, setResent] = useState(false);
  const router = useRouter();

  async function resendEmail() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return;
    await supabase.auth.resend({ type: "signup", email: user.email });
    setResent(true);
  }

  if (status === "none") return null;

  if (status === "email") {
    return (
      <div
        className="flex items-center justify-between px-5 py-3 rounded-[8px] mb-6 text-[13px]"
        style={{ background: "rgba(230,160,40,0.08)", border: "1px solid rgba(230,160,40,0.25)" }}
      >
        <div>
          <span style={{ color: "#e6a028" }} className="font-medium">Verify your email&nbsp;</span>
          <span className="text-muted">— check your inbox to confirm your account.</span>
        </div>
        <button
          onClick={resendEmail}
          disabled={resent}
          className="ml-6 shrink-0 text-[12px] px-3 h-7 rounded-[4px] transition-opacity disabled:opacity-50 cursor-pointer"
          style={{ background: "rgba(230,160,40,0.15)", color: "#e6a028", border: "1px solid rgba(230,160,40,0.3)" }}
        >
          {resent ? "Email sent" : "Resend email"}
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between px-5 py-3 rounded-[8px] mb-6 text-[13px]"
      style={{ background: "rgba(97,193,216,0.06)", border: "1px solid rgba(97,193,216,0.25)" }}
    >
      <div>
        <span className="text-teal font-medium">Set up two-factor authentication&nbsp;</span>
        <span className="text-muted">— add an authenticator app to secure your account.</span>
      </div>
      <button
        onClick={() => router.push("/admin/settings/mfa")}
        className="ml-6 shrink-0 text-[12px] px-3 h-7 rounded-[4px] transition-opacity hover:opacity-80 cursor-pointer"
        style={{ background: "rgba(97,193,216,0.12)", color: "#61c1d8", border: "1px solid rgba(97,193,216,0.3)" }}
      >
        Set up 2FA →
      </button>
    </div>
  );
}
