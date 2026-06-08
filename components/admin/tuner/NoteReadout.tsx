import { tuneState, TUNE_COLORS } from "@/lib/tunerUtils";

interface Props {
  note: string | null;
  hz: number | null;
  cents: number | null;
  listening: boolean;
}

export default function NoteReadout({ note, hz, cents, listening }: Props) {
  const state = cents !== null ? tuneState(cents) : "default";
  const color = listening && cents !== null ? TUNE_COLORS[state] : "#333";

  return (
    <div className="flex flex-col items-center">
      <p
        style={{
          fontSize: "2.75rem",
          fontWeight: 700,
          lineHeight: 1,
          color,
          transition: "color 0.15s",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {listening && note ? note : "—"}
      </p>
      <p style={{ fontSize: "0.6875rem", color: "#444", marginTop: "0.2rem", minHeight: "1rem" }}>
        {listening && hz ? `${hz.toFixed(1)} Hz` : ""}
      </p>
    </div>
  );
}
