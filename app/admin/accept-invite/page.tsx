"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const inputStyle = { background: "#19191d", border: "1px solid rgba(255,255,255,0.08)" };

export default function AcceptInvitePage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    const { data: roleData } = await supabase
      .from("admin_roles")
      .select("role")
      .eq("user_id", user!.id)
      .maybeSingle();

    router.push(roleData?.role === "full-admin" ? "/admin" : "/admin/guitar-tabs");
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div
        className="w-[400px] rounded-[16px] p-10 flex flex-col"
        style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p className="text-teal text-[22px] font-medium tracking-[1.76px] text-center mb-4">KW</p>

        <h1 className="text-warm-white text-[24px] font-medium text-center mb-1">Set your password</h1>
        <p className="text-muted text-[13px] text-center mb-6">Choose a password to activate your account</p>

        <div className="w-full h-px mb-6" style={{ background: "rgba(255,255,255,0.08)" }} />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
