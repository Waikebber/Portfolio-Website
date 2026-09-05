"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ResetPasswordForm from "@/components/admin/login/ResetPasswordForm";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div
        className="w-[400px] rounded-[16px] p-10 flex flex-col"
        style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p className="text-teal text-[22px] font-medium tracking-[1.76px] text-center mb-4">KW</p>
        <h1 className="text-warm-white text-[24px] font-medium text-center mb-1">Reset Password</h1>
        <p className="text-muted text-[13px] text-center mb-6">Enter your new password</p>
        <div className="w-full h-px mb-6" style={{ background: "rgba(255,255,255,0.08)" }} />

        <ResetPasswordForm
          password={password} setPassword={setPassword}
          confirm={confirm} setConfirm={setConfirm}
          error={error} loading={loading}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}