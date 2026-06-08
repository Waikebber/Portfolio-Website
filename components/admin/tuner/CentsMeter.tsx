import { tuneState, TUNE_COLORS } from "@/lib/tunerUtils";

interface Props {
  cents: number | null;
}

export default function CentsMeter({ cents }: Props) {
  const clampedCents = cents == null ? 0 : Math.max(-50, Math.min(50, cents));
  const pct = ((clampedCents + 50) / 100) * 100; // 0–100%

  const state  = cents == null ? "default" : tuneState(cents);
  const color  = TUNE_COLORS[state];
  const active = cents !== null;

  return (
    <div style={{ width: "100%" }}>
      {/* Needle track */}
      <div
        style={{
          position: "relative",
          height: "6px",
          background: "#1e1e22",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        {/* Fill bar */}
        {active && (
          <div
            style={{
              position: "absolute",
              height: "100%",
              background: color,
              borderRadius: "3px",
              transition: "left 0.08s ease, width 0.08s ease, background 0.2s",
              ...(clampedCents >= 0
                ? { left: "50%", width: `${pct - 50}%` }
                : { left: `${pct}%`, width: `${50 - pct}%` }),
            }}
          />
        )}
        {/* Needle dot */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${active ? pct : 50}%`,
            width: "10px",
            height: "10px",
            background: active ? color : "#444",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            transition: "left 0.08s ease, background 0.2s",
            boxShadow: active ? `0 0 6px ${color}88` : "none",
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-1" style={{ fontSize: "0.55rem", color: "#444" }}>
        <span>-50¢</span>
        <span style={{ color: active ? color : "#555", fontWeight: 600, fontSize: "0.7rem" }}>
          {cents == null ? "—" : `${cents > 0 ? "+" : ""}${cents}¢`}
        </span>
        <span>+50¢</span>
      </div>
    </div>
  );
}
