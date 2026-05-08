"use client";

import { useRouter } from "next/navigation";
import { useTotp } from "@/hooks/admin/useTotp";
import QRCodeCard from "@/components/admin/mfa/QRCodeCard";
import CodeInput from "@/components/admin/mfa/CodeInput";

export default function MFASetupPage() {
  const router = useRouter();
  const { qrCode, secret, code, setCode, verify, loading, error } = useTotp(
    () => router.push("/admin")
  );

  return (
    <div className="max-w-[480px]">
      <h1 className="text-warm-white text-[32px] font-medium mb-2">Two-Factor Authentication</h1>
      <p className="text-muted text-[14px] mb-8">
        Scan the QR code with your authenticator app, then enter the 6-digit code to confirm.
      </p>

      {qrCode && <QRCodeCard qrCode={qrCode} secret={secret} />}

      <CodeInput value={code} onChange={setCode} />

      {error && <p className="text-[12px] mb-3" style={{ color: "#e64d4d" }}>{error}</p>}

      <button
        onClick={verify}
        disabled={loading || code.length !== 6}
        className="w-full h-11 rounded-[8px] text-[14px] font-medium transition-opacity disabled:opacity-50 cursor-pointer"
        style={{ background: "#61c1d8", color: "#0d0d0f" }}
      >
        {loading ? "Verifying…" : "Enable 2FA"}
      </button>

      <button
        onClick={() => router.back()}
        className="mt-4 block text-[12px] hover:text-warm-white transition-colors"
        style={{ color: "#444" }}
      >
        ← Cancel
      </button>
    </div>
  );
}
