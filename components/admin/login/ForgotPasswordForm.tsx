const inputStyle = { background: "#19191d", border: "1px solid rgba(255,255,255,0.08)" };

interface Props {
  email: string;
  setEmail: (v: string) => void;
  error: string | null;
  message: string | null;
  loading: boolean;
  sent: boolean;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onBack: () => void;
}

export default function ForgotPasswordForm({ email, setEmail, error, message, loading, sent, onSubmit, onBack }: Props) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-muted text-[10px] tracking-[1.2px] uppercase">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={sent}
          className="h-[42px] rounded-[6px] px-3 text-warm-white text-[13px] outline-none disabled:opacity-50"
          style={{ background: "#19191d", border: "1px solid rgba(255,255,255,0.08)" }}
        />
      </div>

      {error && <p className="text-[11px] text-center" style={{ color: "#e54d4d" }}>{error}</p>}
      {message && <p className="text-[11px] text-center" style={{ color: "#61c1d8" }}>{message}</p>}

      <button
        type="submit"
        disabled={loading || sent}
        className="h-[44px] rounded-[6px] text-[14px] font-medium transition-opacity disabled:opacity-50 cursor-pointer mt-2"
        style={{ background: "#61c1d8", color: "#0d0d0f" }}
      >
        {sent ? "Submitted" : loading ? "Sending…" : "Send reset link"}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="text-muted text-[12px] hover:text-warm-white transition-colors cursor-pointer"
      >
        ← Back to sign in
      </button>
    </form>
  );
}