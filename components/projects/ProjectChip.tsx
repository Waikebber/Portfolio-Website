export default function ProjectChip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center h-[24px] px-2.5 rounded-[4px] text-[#888] text-[11px]"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "0.5px solid rgba(255,255,255,0.1)",
      }}
    >
      {label}
    </span>
  );
}
