import type { TickerDetail } from "@/types/markets";
import { fmt } from "@/lib/marketsFormat";
import StatBlock from "./StatBlock";

function sentimentTrend(detail: TickerDetail): string {
  const score = detail.today.sentiment_score;
  const history = detail.sentiment_history.filter((h) => h.sentiment_score != null).slice(0, 5);
  if (!history.length || score == null) return "—";
  const avg = history.reduce((s, h) => s + (h.sentiment_score ?? 0), 0) / history.length;
  return score > avg ? "↑ Improving" : score < avg ? "↓ Declining" : "→ Flat";
}

export default function OverviewTab({ detail }: { detail: TickerDetail }) {
  const t = detail.today;
  return (
    <div className="flex flex-col gap-6">
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <StatBlock label="Today's Score" value={fmt(t.sentiment_score)} />
        <StatBlock label="5-Day Trend" value={sentimentTrend(detail)} />
        <StatBlock label="Articles Today" value={t.article_count != null ? `${t.article_count} articles` : "—"} />
        <StatBlock
          label="vs. Sector"
          value={detail.sector_avg_score != null ? `Sector: ${fmt(detail.sector_avg_score)}` : "—"}
        />
      </div>
      <div className="px-5 grid grid-cols-2 sm:grid-cols-4 gap-4 pb-5">
        <StatBlock label="Close Price" value={t.price_close != null ? `$${t.price_close.toFixed(2)}` : "—"} />
        <StatBlock label="1-Day Return" value={fmt(t.return_1d, true)} />
        <StatBlock label="5-Day Return" value={fmt(t.return_5d, true)} />
        <StatBlock label="Volume Ratio" value={t.volume_ratio != null ? `${t.volume_ratio.toFixed(1)}×` : "—"} sub="vs 20d avg" />
      </div>
    </div>
  );
}
