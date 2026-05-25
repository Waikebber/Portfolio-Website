"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { TickerDetail } from "@/types/markets";
import SignalBadge from "../SignalBadge";
import OverviewTab from "./OverviewTab";
import NewsTab from "./NewsTab";
import PriceTab from "./PriceTab";
import EarningsTab from "./EarningsTab";

type Tab = "overview" | "news" | "price" | "earnings";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "news",     label: "News"     },
  { id: "price",    label: "Price"    },
  { id: "earnings", label: "Earnings" },
];

interface Props {
  ticker: string | null;
  onClose: () => void;
}

export default function TickerModal({ ticker, onClose }: Props) {
  const [detail, setDetail] = useState<TickerDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("news");

  useEffect(() => {
    if (!ticker) { setDetail(null); return; }
    setLoading(true);
    setActiveTab("news");
    fetch(`/api/markets/tickers/${ticker}/detail`)
      .then((r) => r.json())
      .then(setDetail)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ticker]);

  useEffect(() => {
    if (!ticker) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [ticker, onClose]);

  return (
    <AnimatePresence>
      {ticker && (
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
                maxWidth: "52rem",
                maxHeight: "90vh",
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
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-teal font-bold" style={{ fontSize: "1.0625rem" }}>{ticker}</span>
                  {detail && (
                    <>
                      <span className="text-warm-white" style={{ fontSize: "0.9375rem" }}>
                        {detail.metadata.company_name}
                      </span>
                      {detail.today && <SignalBadge signal={detail.today.signal_strength} size="xs" />}
                      <span className="text-muted hidden sm:block" style={{ fontSize: "0.75rem" }}>
                        {[
                          detail.metadata.sector,
                          detail.metadata.industry,
                          detail.metadata.market_cap_b ? `$${detail.metadata.market_cap_b}B market cap` : null,
                        ].filter(Boolean).join(" · ")}
                      </span>
                    </>
                  )}
                </div>
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

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto px-1">
                {loading || !detail ? (
                  <div className="flex items-center justify-center p-12">
                    <p className="text-muted text-[13px]">{loading ? "Loading…" : "No data"}</p>
                  </div>
                ) : (
                  <>
                    {activeTab === "overview"  && <OverviewTab  detail={detail} />}
                    {activeTab === "news"      && <NewsTab      detail={detail} />}
                    {activeTab === "price"     && <PriceTab     detail={detail} />}
                    {activeTab === "earnings"  && <EarningsTab  detail={detail} />}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
