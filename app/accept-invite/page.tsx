"use client";

import Link from "next/link";
import { useAcceptInvite } from "@/hooks/admin/useAcceptInvite";

const inputStyle = { background: "#19191d", border: "1px solid rgba(255,255,255,0.08)" };

export default function AcceptInvitePage() {
  const { status, email, password, setPassword, confirm, setConfirm, error, loading, submit } =
    useAcceptInvite();

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
            <h1 className="text-warm-white text-[24px] font-medium text-center mb-2">Invalid invite</h1>
            <p className="text-muted text-[13px] text-center">
              This invite link has expired or has already been used.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-warm-white text-[24px] font-medium text-center mb-1">Set your password</h1>
            <p className="text-muted text-[13px] text-center mb-6">
              Choose a password to activate your account
            </p>

            <div className="w-full h-px mb-6" style={{ background: "rgba(255,255,255,0.08)" }} />

            <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-muted text-[10px] tracking-[1.2px] uppercase">Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="h-[42px] rounded-[6px] px-3 text-[13px] outline-none opacity-40 cursor-not-allowed"
                  style={inputStyle}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-muted text-[10px] tracking-[1.2px] uppercase">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  className="h-[42px] rounded-[6px] px-3 text-warm-white text-[13px] outline-none"
                  style={inputStyle}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-muted text-[10px] tracking-[1.2px] uppercase">Confirm password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="h-[42px] rounded-[6px] px-3 text-warm-white text-[13px] outline-none"
                  style={inputStyle}
                />
              </div>

              {error && <p className="text-[11px] text-center" style={{ color: "#e54d4d" }}>{error}</p>}

              <button
                type="submit"
                disabled={loading || !password || !confirm}
                className="h-[44px] rounded-[6px] text-[14px] font-medium transition-opacity disabled:opacity-50 cursor-pointer mt-2"
                style={{ background: "#61c1d8", color: "#0d0d0f" }}
              >
                {loading ? "Saving…" : "Set password"}
              </button>
            </form>
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
