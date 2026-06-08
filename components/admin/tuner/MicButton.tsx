import type { MicState } from "@/hooks/admin/usePitchDetector";

interface Props {
  micState: MicState;
  listening: boolean;
  onToggle: () => void;
}

export default function MicButton({ micState, listening, onToggle }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onToggle}
        className="cursor-pointer transition-all hover:opacity-90 active:scale-95"
        title={
          micState === "denied"
            ? "Mic access denied — check browser settings"
            : listening
            ? "Stop"
            : "Start tuner"
        }
        style={{
          width: "3.25rem",
          height: "3.25rem",
          borderRadius: "50%",
          border: `2px solid ${listening ? "#61c1d8" : "rgba(255,255,255,0.12)"}`,
          background: listening ? "rgba(97,193,216,0.12)" : "#141417",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: listening ? "#61c1d8" : "#555",
        }}
      >
        {micState === "denied" ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="2" y1="2" x2="22" y2="22" />
            <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2M5 10v2a7 7 0 0 0 12 5" />
            <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33M12 19v3M8 23h8" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <rect x="9" y="2" width="6" height="11" rx="3" />
            <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="8" y1="22" x2="16" y2="22" />
          </svg>
        )}
      </button>

      {micState === "denied" && (
        <p style={{ fontSize: "0.75rem", color: "#f87171", textAlign: "center" }}>
          Microphone access denied. Enable it in your browser settings and reload.
        </p>
      )}
      {micState === "requesting" && (
        <p style={{ fontSize: "0.75rem", color: "#888" }}>Requesting microphone…</p>
      )}
    </div>
  );
}
