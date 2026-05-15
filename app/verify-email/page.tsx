"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useVerifyEmail } from "@/hooks/admin/useVerifyEmail";

function VerifyEmailCard() {
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const { cooldown, sending, sent, error, resend } = useVerifyEmail(email);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div
        className="w-[400px] rounded-[16px] p-10 flex flex-col"
        style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p className="text-teal text-[22px] font-medium tracking-[1.76px] text-center mb-4">KW</p>

        <h1 className="text-warm-white text-[24px] font-medium text-center mb-1">Check your inbox</h1>
        <p className="text-muted text-[13px] text-center mb-6">
          {email ? (
            <>We sent a confirmation link to <span className="text-warm-white">{email}</span>. Click it to verify your account before logging in.</>
          ) : (
            "A confirmation link has been sent to your email. Click it to verify your account before logging in."
          )}
        </p>

        <div className="w-full h-px mb-6" style={{ background: "rgba(255,255,255,0.08)" }} />

        {sent && (
          <p className="text-[12px] text-center mb-3" style={{ color: "#61c1d8" }}>
            Confirmation email resent.
          </p>
        )}
        {error && (
          <p className="text-[12px] text-center mb-3" style={{ color: "#e54d4d" }}>
            {error}
          </p>
        )}

        <button
          onClick={resend}
          disabled={sending || cooldown > 0 || !email}
          className="h-[44px] rounded-[6px] text-[14px] font-medium transition-opacity disabled:opacity-50 cursor-pointer mb-4"
          style={{ background: "#61c1d8", color: "#0d0d0f" }}
        >
          {sending ? "Sending…" : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend confirmation email"}
        </button>

        <Link
          href="/admin/login"
          className="text-[13px] text-center transition-colors hover:text-warm-white"
          style={{ color: "#888" }}
        >
          ← Back to login
        </Link>
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

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailCard />
    </Suspense>
  );
}
