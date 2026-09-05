interface Props {
  code: string;
  setCode: (v: string) => void;
  error: string | null;
  loading: boolean;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onBack: () => void;
}

export default function MfaForm({ code, setCode, error, loading, onSubmit, onBack }: Props) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-muted text-[10px] tracking-[1.2px] uppercase">Auth Code</label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="000000"
          required
          autoFocus
          className="h-[42px] rounded-[6px] px-3 text-warm-white text-[13px] tracking-[4px] outline-none text-center"
          style={{ background: "#19191d", border: "1px solid rgba(255,255,255,0.08)" }}
        />
      </div>

      {error && <p className="text-[11px] text-center" style={{ color: "#e54d4d" }}>{error}</p>}

      <button
        type="submit"
        disabled={loading || code.length !== 6}
        className="h-[44px] rounded-[6px] text-[14px] font-medium transition-opacity disabled:opacity-50 cursor-pointer mt-2"
        style={{ background: "#61c1d8", color: "#0d0d0f" }}
      >
        {loading ? "Verifying…" : "Verify"}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="text-muted text-[12px] hover:text-warm-white transition-colors cursor-pointer"
      >
        ← Back
      </button>
    </form>
  );
}
