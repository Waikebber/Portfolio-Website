const STYLES: Record<string, { bg: string; text: string }> = {
  Bullish:           { bg: "rgba(22,163,74,0.15)",    text: "#4ade80" },
  "Somewhat Bullish":{ bg: "rgba(22,163,74,0.1)",     text: "#86efac" },
  Neutral:           { bg: "rgba(136,136,136,0.12)",  text: "#888"    },
  "Somewhat Bearish":{ bg: "rgba(239,68,68,0.1)",     text: "#f87171" },
  Bearish:           { bg: "rgba(239,68,68,0.15)",    text: "#f87171" },
};

export default function SentimentLabel({ label }: { label: string | null }) {
  if (!label) return null;
  const { bg, text } = STYLES[label] ?? STYLES["Neutral"];
  return (
    <span
      style={{
        background: bg,
        color: text,
        borderRadius: "0.25rem",
        padding: "0.15rem 0.45rem",
        fontSize: "0.6875rem",
        fontWeight: 500,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {label}
    </span>
  );
}
