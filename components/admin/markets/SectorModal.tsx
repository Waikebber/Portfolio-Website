"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SectorDetail } from "@/types/markets";
import { fmt, pct, timeAgo } from "@/lib/marketsFormat";
import SignalBadge from "./SignalBadge";
import SentimentLabel from "./ticker-modal/SentimentLabel";

type Tab = "stocks" | "news";

interface Props {
  sector: string | null;
  onClose: () => void;
  onTickerClick: (ticker: string) => void;
}

export default function SectorModal({ sector, onClose, onTickerClick }: Props) {
  const [detail, setDetail] = useState<SectorDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("stocks");

  useEffect(() => {
    if (!sector) { setDetail(null); setError(false); return; }
    setLoading(true);
    setError(false);
    setActiveTab("stocks");
    fetch(`/api/markets/sectors/${encodeURIComponent(sector)}`)
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(setDetail)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [sector]);

  useEffect(() => {
    if (!sector) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [sector, onClose]);

  const TABS: { id: Tab; label: string }[] = [
    { id: "stocks", label: `Stocks${detail ? ` (${detail.tickers.length})` : ""}` },
    { id: "news",   label: `News${detail ? ` (${detail.recent_articles.length})` : ""}` },
  ];

  return (
    <AnimatePresence>
      {sector && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.6)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          >
            <div
              className="relative w-full overflow-hidden flex flex-col"
              style={{
                maxWidth: "42rem",
                maxHeight: "85vh",
                background: "#141417",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.875rem",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between gap-3 px-5 py-4 shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="text-warm-white font-semibold" style={{ fontSize: "1rem" }}>{sector}</span>
                <button
                  onClick={onClose}
                  className="text-muted hover:text-warm-white transition-colors cursor-pointer shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div
                className="flex items-center gap-1 px-4 shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="cursor-pointer transition-colors"
                    style={{
                      padding: "0.75rem",
                      fontSize: "0.875rem",
                      color: activeTab === tab.id ? "#61c1d8" : "#888",
                      borderBottom: activeTab === tab.id ? "2px solid #61c1d8" : "2px solid transparent",
                      marginBottom: "-1px",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto pt-1">
                {loading || !detail ? (
                  <div className="flex items-center justify-center p-12">
                    <p className="text-muted text-[13px]">{loading ? "Loading…" : error ? "Sector not found" : "No data"}</p>
                  </div>
                ) : activeTab === "stocks" ? (
                  <StocksTab tickers={detail.tickers} onTickerClick={(t) => { onClose(); onTickerClick(t); }} />
                ) : (
                  <NewsTab articles={detail.recent_articles} />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StocksTab({
  tickers,
  onTickerClick,
}: {
  tickers: SectorDetail["tickers"];
  onTickerClick: (t: string) => void;
}) {
  if (!tickers.length) return <p className="text-muted text-[13px] p-5">No tickers in this sector.</p>;

  return (
    <div className="flex flex-col">
      {/* Column headers */}
      <div
        className="grid px-5 py-2"
        style={{
          gridTemplateColumns: "1fr 5rem 5rem 5rem 5rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {["COMPANY", "SIGNAL", "1D", "5D", "CLOSE"].map((h) => (
          <span key={h} style={{ fontSize: "0.6rem", letterSpacing: "0.1em", color: "#555" }}>{h}</span>
        ))}
      </div>
      {tickers.map((t) => (
        <button
          key={t.ticker}
          onClick={() => onTickerClick(t.ticker)}
          className="grid w-full text-left hover:bg-white/[0.03] transition-colors cursor-pointer px-5"
          style={{
            gridTemplateColumns: "1fr 5rem 5rem 5rem 5rem",
            padding: "0.7rem 1.25rem",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            alignItems: "center",
          }}
        >
          <div className="min-w-0">
            <span className="text-teal font-semibold block" style={{ fontSize: "0.875rem" }}>{t.ticker}</span>
            <span className="text-muted truncate block" style={{ fontSize: "0.6875rem" }}>{t.company_name}</span>
          </div>
          <span><SignalBadge signal={t.signal_strength} size="xs" /></span>
          <span style={{ fontSize: "0.8125rem", color: (t.return_1d ?? 0) >= 0 ? "#4ade80" : "#f87171" }}>
            {pct(t.return_1d)}
          </span>
          <span style={{ fontSize: "0.8125rem", color: (t.return_5d ?? 0) >= 0 ? "#4ade80" : "#f87171" }}>
            {pct(t.return_5d)}
          </span>
          <span className="text-warm-white" style={{ fontSize: "0.8125rem" }}>
            {t.price_close != null ? `$${t.price_close.toFixed(2)}` : "—"}
          </span>
        </button>
      ))}
    </div>
  );
}

function NewsTab({ articles }: { articles: SectorDetail["recent_articles"] }) {
  if (!articles.length) return <p className="text-muted text-[13px] p-5">No recent news for this sector.</p>;

  return (
    <div className="flex flex-col">
      {articles.map((a, i) => (
        <a
          key={i}
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 hover:bg-white/[0.03] transition-colors"
          style={{ padding: "0.875rem 1.25rem", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : undefined }}
        >
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-teal font-semibold shrink-0" style={{ fontSize: "0.75rem" }}>{a.ticker}</span>
              <SentimentLabel label={a.av_sentiment_label} />
            </div>
            <p className="text-warm-white" style={{ fontSize: "0.8125rem", lineHeight: 1.4 }}>{a.headline ?? "—"}</p>
            <p className="text-muted" style={{ fontSize: "0.6875rem" }}>
              {a.source}{a.source && a.published_at ? " · " : ""}{timeAgo(a.published_at)}
            </p>
          </div>
          <span className="text-muted shrink-0 mt-0.5" style={{ fontSize: "0.875rem" }}>→</span>
        </a>
      ))}
    </div>
  );
}
