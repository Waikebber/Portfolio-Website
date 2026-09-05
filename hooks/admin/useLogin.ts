"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type LoginStep = "credentials" | "mfa" | "forgot";;

export function useLogin() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [mfaChallengeId, setMfaChallengeId] = useState<string | null>(null);
  const [forgotEmail, setForgotEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submitCredentials(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) { setError("Invalid credentials. Please try again."); setLoading(false); return; }

    const { data: factorsData } = await supabase.auth.mfa.listFactors();
    const totpFactor = factorsData?.totp?.[0];

    if (totpFactor?.status === "verified") {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: totpFactor.id });
      if (challengeError || !challenge) { setError("Failed to start MFA challenge. Try again."); setLoading(false); return; }
      setMfaFactorId(totpFactor.id);
      setMfaChallengeId(challenge.id);
      setStep("mfa");
    } else {
      router.push("/admin");
      router.refresh();
    }
    setLoading(false);
  }

  async function submitMfa(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!mfaFactorId || !mfaChallengeId) return;
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: mfaFactorId,
      challengeId: mfaChallengeId,
      code,
    });

    if (verifyError) { setError("Invalid code. Please try again."); setLoading(false); return; }
    router.push("/admin");
    router.refresh();
  }

  function goToForgotPassword() {
    setError(null);
    setMessage(null);
    setForgotEmail(email);
    setStep("forgot");
    setSent(false);
  }

  async function submitForgotPassword(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setMessage("If that email exists, a reset link is on its way.");
    setSent(true);
  }


  function backToCredentials() {
    setStep("credentials");
    setError(null);
    setCode("");
    setSent(false);
  }

  return {
    step,
    email, setEmail,
    password, setPassword,
    code, setCode,
    forgotEmail, setForgotEmail,
    error, message, loading, sent,
    submitCredentials, submitMfa, submitForgotPassword,
    goToForgotPassword, backToCredentials,
  };
}
