import { tuneState, TUNE_COLORS } from "@/lib/tunerUtils";

interface Props {
  label: string;
  yPct: number;
  stringIndex: number;
  activeIndex: number | null;
  activeCents: number | null;
  isPinned: boolean;
  onClick: () => void;
}

export default function PegBadge({ label, yPct, stringIndex, activeIndex, activeCents, isPinned, onClick }: Props) {
  const isActive = activeIndex === stringIndex;

  let bg     = "rgba(10,8,6,0.6)";
  let border = "rgba(255,255,255,0.12)";
  let color  = "#666";

  if (isPinned && isActive && activeCents !== null) {
    const c = TUNE_COLORS[tuneState(activeCents)];
    bg = `${c}33`; border = c; color = c;
  } else if (isPinned) {
    bg = "rgba(97,193,216,0.15)"; border = "#61c1d8"; color = "#61c1d8";
  } else if (isActive && activeCents !== null) {
    const c = TUNE_COLORS[tuneState(activeCents)];
    border = c; color = c;
  } else if (isActive) {
    border = "#61c1d8"; color = "#61c1d8";
  }

  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        top: `${yPct}%`,
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "3rem",
        height: "3rem",
        borderRadius: "50%",
        background: bg,
        border: `1.5px solid ${border}`,
        color,
        fontSize: label.length > 1 ? "0.65rem" : "0.8125rem",
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "background 0.15s, border-color 0.15s, color 0.15s",
        backdropFilter: "blur(2px)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
