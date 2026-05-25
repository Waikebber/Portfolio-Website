import type { SignalStrength } from "@/types/markets";

const CONFIG: Record<SignalStrength, { label: string; bg: string; text: string; border: string }> = {
  strong_bull: { label: "Strong Bull", bg: "rgba(22,163,74,0.18)", text: "#4ade80", border: "rgba(22,163,74,0.35)" },
  bull:        { label: "Bull",        bg: "rgba(22,163,74,0.12)", text: "#86efac", border: "rgba(22,163,74,0.25)" },
  neutral:     { label: "Neutral",     bg: "rgba(136,136,136,0.12)", text: "#888", border: "rgba(136,136,136,0.25)" },
  bear:        { label: "Bear",        bg: "rgba(239,68,68,0.12)", text: "#f87171", border: "rgba(239,68,68,0.25)" },
  strong_bear: { label: "Strong Bear", bg: "rgba(239,68,68,0.18)", text: "#f87171", border: "rgba(239,68,68,0.35)" },
};

export default function SignalBadge({
  signal,
  size = "sm",
}: {
  signal: SignalStrength | null | undefined;
  size?: "sm" | "xs";
}) {
  if (!signal) return null;
  const { label, bg, text, border } = CONFIG[signal];
  return (
    <span
      style={{
        background: bg,
        color: text,
        border: `1px solid ${border}`,
        borderRadius: "0.25rem",
        padding: size === "xs" ? "0.1rem 0.4rem" : "0.2rem 0.5rem",
        fontSize: size === "xs" ? "0.625rem" : "0.6875rem",
        fontWeight: 500,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
