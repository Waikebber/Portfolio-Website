const inputStyle = { background: "#19191d", border: "1px solid rgba(255,255,255,0.08)" };

interface Props {
  password: string;
  setPassword: (v: string) => void;
  confirm: string;
  setConfirm: (v: string) => void;
  error: string | null;
  loading: boolean;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
}

export default function ResetPasswordForm({ password, setPassword, confirm, setConfirm, error, loading, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-muted text-[10px] tracking-[1.2px] uppercase">New password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
        disabled={loading}
        className="h-[44px] rounded-[6px] text-[14px] font-medium transition-opacity disabled:opacity-50 cursor-pointer mt-2"
        style={{ background: "#61c1d8", color: "#0d0d0f" }}
      >
        {loading ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}