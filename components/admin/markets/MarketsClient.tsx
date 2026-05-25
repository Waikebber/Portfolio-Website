"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { DashboardData } from "@/types/markets";
import WatchlistStrip from "./WatchlistStrip";
import SectorHeatmap from "./SectorHeatmap";
import TopMovers from "./TopMovers";
import UnusualVolume from "./UnusualVolume";
import EarningsRadar from "./EarningsRadar";
import TickerModal from "./ticker-modal/TickerModal";
import SectorModal from "./SectorModal";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "0.6rem",
        letterSpacing: "0.1em",
        color: "#555",
        marginBottom: "0.75rem",
      }}
    >
      {children}
    </p>
  );
}

export default function MarketsClient({ data }: { data: DashboardData }) {
  const router = useRouter();
  const [activeTicker, setActiveTicker] = useState<string | null>(null);
  const [activeSector, setActiveSector] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function refresh() {
    startTransition(() => router.refresh());
  }

  const asOf = data.as_of
    ? new Date(data.as_of).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York", timeZoneName: "short" })
    : null;

  return (
    <>
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-warm-white font-medium" style={{ fontSize: "2rem" }}>Markets — Mid Cap</h1>
          <p className="text-muted" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Daily briefing{asOf ? ` — last updated ${asOf}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/markets/universe"
            className="shrink-0 h-9 px-4 flex items-center rounded-[8px] text-[13px] hover:opacity-90 transition-opacity"
            style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)", color: "#61c1d8" }}
          >
            Universe
          </Link>
          <button
            onClick={refresh}
            disabled={isPending}
            className="shrink-0 h-9 px-4 flex items-center rounded-[8px] text-[13px] cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: "#141417", border: "1px solid rgba(97,193,216,0.3)", color: "#61c1d8" }}
          >
            {isPending ? "Refreshing…" : "Refresh data"}
          </button>
        </div>
      </div>

      {/* Watchlist */}
      {data.watchlist.length > 0 && (
        <section className="mb-8">
          <SectionLabel>WATCHLIST</SectionLabel>
          <WatchlistStrip tickers={data.watchlist} />
        </section>
      )}

      {/* Sector Heatmap */}
      <section className="mb-8">
        <SectionLabel>SECTOR ROTATION</SectionLabel>
        <SectorHeatmap sectors={data.sector_heatmap} onSectorClick={setActiveSector} />
      </section>

      {/* Top Movers + Unusual Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <section>
          <SectionLabel>TOP MOVERS TODAY</SectionLabel>
          <TopMovers bull={data.top_movers.bull} bear={data.top_movers.bear} onTickerClick={setActiveTicker} />
        </section>
        <section>
          <SectionLabel>UNUSUAL VOLUME</SectionLabel>
          <UnusualVolume flags={data.unusual_volume} onTickerClick={setActiveTicker} />
        </section>
      </div>

      {/* Earnings Radar */}
      <section className="mb-8">
        <SectionLabel>EARNINGS RADAR — NEXT 14 DAYS</SectionLabel>
        <EarningsRadar rows={data.earnings_radar} onTickerClick={setActiveTicker} />
      </section>

      <TickerModal ticker={activeTicker} onClose={() => setActiveTicker(null)} />
      <SectorModal
        sector={activeSector}
        onClose={() => setActiveSector(null)}
        onTickerClick={(t) => { setActiveSector(null); setActiveTicker(t); }}
      />
    </>
  );
}
