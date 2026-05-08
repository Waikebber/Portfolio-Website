interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CodeInput({ value, onChange }: Props) {
  return (
    <div className="mb-4">
      <p className="text-muted text-[11px] tracking-[1.1px] uppercase mb-2">Verification code</p>
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        placeholder="000000"
        className="w-full h-11 px-4 rounded-[6px] text-warm-white text-[14px] tracking-widest placeholder:text-[#444] outline-none"
        style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
      />
    </div>
  );
}
