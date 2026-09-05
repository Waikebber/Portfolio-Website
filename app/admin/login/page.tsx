"use client";

import Link from "next/link";
import { useLogin } from "@/hooks/admin/useLogin";
import CredentialsForm from "@/components/admin/login/CredentialsForm";
import MfaForm from "@/components/admin/login/MfaForm";
import ForgotPasswordForm from "@/components/admin/login/ForgotPasswordForm";

export default function AdminLoginPage() {
  const {
    step,
    email, setEmail, password, setPassword,
    code, setCode,
    forgotEmail, setForgotEmail,
    error, message, loading, sent,
    submitCredentials, submitMfa, submitForgotPassword,
    goToForgotPassword, backToCredentials,
  } = useLogin();

  const titles: Record<typeof step, string> = {
    credentials: "Admin Login",
    mfa: "Two-Factor Auth",
    forgot: "Reset Password",
  };

  const subtitles: Record<typeof step, string> = {
    credentials: "Enter your credentials to continue",
    mfa: "Enter the 6-digit code from your authenticator app",
    forgot: "Enter your email and we'll send you a reset link",
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div
        className="w-[400px] rounded-[16px] p-10 flex flex-col"
        style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p className="text-teal text-[22px] font-medium tracking-[1.76px] text-center mb-4">KW</p>

        <h1 className="text-warm-white text-[24px] font-medium text-center mb-1">
          {titles[step]}
        </h1>
        <p className="text-muted text-[13px] text-center mb-6">
          {subtitles[step]}
        </p>

        <div className="w-full h-px mb-6" style={{ background: "rgba(255,255,255,0.08)" }} />

        {step === "credentials" && (
          <>
            <CredentialsForm
              email={email} setEmail={setEmail}
              password={password} setPassword={setPassword}
              error={error} loading={loading}
              onSubmit={submitCredentials}
            />
            <button
              type="button"
              onClick={goToForgotPassword}
              className="text-muted text-[12px] hover:text-warm-white transition-colors cursor-pointer mt-4 text-center"
            >
              Forgot password?
            </button>
          </>
        )}

        {step === "mfa" && (
          <MfaForm
            code={code} setCode={setCode}
            error={error} loading={loading}
            onSubmit={submitMfa}
            onBack={backToCredentials}
          />
        )}

        {step === "forgot" && (
          <ForgotPasswordForm
            email={forgotEmail} setEmail={setForgotEmail}
            error={error} message={message} loading={loading} sent={sent}
            onSubmit={submitForgotPassword}
            onBack={backToCredentials}
          />
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
