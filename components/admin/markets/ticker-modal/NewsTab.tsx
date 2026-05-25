import type { TickerDetail } from "@/types/markets";
import { fmt, timeAgo } from "@/lib/marketsFormat";
import StatBlock from "./StatBlock";
import SentimentLabel from "./SentimentLabel";

function sentimentTrend(detail: TickerDetail): string {
  const score = detail.today.sentiment_score;
  const history = detail.sentiment_history.filter((h) => h.sentiment_score != null).slice(0, 5);
  if (!history.length || score == null) return "—";
  const avg = history.reduce((s, h) => s + (h.sentiment_score ?? 0), 0) / history.length;
  return score > avg ? "↑ Improving" : score < avg ? "↓ Declining" : "→ Flat";
}

export default function NewsTab({ detail }: { detail: TickerDetail }) {
  const t = detail.today;
  return (
    <div className="flex flex-col">
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

      <p className="text-muted px-5 pt-5 pb-1" style={{ fontSize: "0.6rem", letterSpacing: "0.1em" }}>
        RECENT HEADLINES
      </p>
      <p className="text-muted px-5 pb-3" style={{ fontSize: "0.6875rem" }}>
        Headlines scored by Alpha Vantage — click to read source
      </p>

      <div className="flex flex-col">
        {detail.recent_articles.length === 0 ? (
          <p className="text-muted text-[13px] px-5 pb-5">No recent articles.</p>
        ) : (
          detail.recent_articles.map((a, i) => (
            <a
              key={i}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:bg-white/[0.03] transition-colors"
              style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <SentimentLabel label={a.av_sentiment_label} />
              <div className="flex-1 min-w-0">
                <p className="text-warm-white truncate" style={{ fontSize: "0.8125rem" }}>{a.headline}</p>
                <p className="text-muted" style={{ fontSize: "0.6875rem", marginTop: "0.1rem" }}>
                  {a.source} · {timeAgo(a.published_at)}
                </p>
              </div>
              <span className="text-muted shrink-0" style={{ fontSize: "0.875rem" }}>→</span>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
