export function SmallChip({ label, teal = false }: { label: string; teal?: boolean }) {
  if (teal) {
    return (
      <span
        className="inline-flex items-center rounded-[0.3125rem] py-[0.35em] px-[0.9em] text-[clamp(0.6875rem,0.9vw,0.875rem)] font-medium"
        style={{
          background: "rgba(97,193,216,0.08)",
          border: "0.5px solid rgba(97,193,216,0.2)",
          color: "#61c1d8",
        }}
      >
        {label}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center rounded-[4px] text-muted py-[0.35em] px-[0.9em] text-[clamp(0.6875rem,0.9vw,0.875rem)]"
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
      className="flex items-center justify-center w-full rounded-[6px] h-[clamp(2.8125rem,3.5vw,3.5rem)] max-md:w-auto max-md:h-auto max-md:py-[0.35em] max-md:px-[0.9em] max-md:rounded-[0.3125rem]"
      style={{
        background: "rgba(97,193,216,0.08)",
        border: "0.5px solid rgba(97,193,216,0.2)",
      }}
    >
      <span className="text-teal font-medium text-[clamp(0.8125rem,1.1vw,1rem)]">{label}</span>
    </div>
  );
}
