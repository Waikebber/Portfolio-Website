export function SmallChip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center py-1 px-2.5 rounded-[4px] text-muted text-[11px]"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "0.5px solid rgba(255,255,255,0.1)",
      }}
    >
      {label}
    </span>
  );
}

export function LargeChip({ label }: { label: string }) {
  return (
    <div
      className="flex items-center justify-center h-[45px] w-full rounded-[6px]"
      style={{
        background: "rgba(97,193,216,0.08)",
        border: "0.5px solid rgba(97,193,216,0.2)",
      }}
    >
      <span className="text-teal text-[13px] font-medium">{label}</span>
    </div>
  );
}
