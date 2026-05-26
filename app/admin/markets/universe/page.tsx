"use client";

import { useState } from "react";
import Link from "next/link";
import { useMarketsTickers } from "@/hooks/admin/useMarketsTickers";
import SectorChips from "@/components/admin/markets/universe/SectorChips";
import UniverseTable from "@/components/admin/markets/universe/UniverseTable";
import AddTickerPanel from "@/components/admin/markets/AddTickerPanel";
import TickerModal from "@/components/admin/markets/ticker-modal/TickerModal";

export default function UniversePage() {
  const { filtered, loading, sectors, sector, setSector, search, setSearch, deleting, deactivate, toggleWatchlist, reload } =
    useMarketsTickers();

  const [panelOpen, setPanelOpen] = useState(false);
  const [activeTicker, setActiveTicker] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: "52rem" }}>
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <Link
            href="/admin/markets"
            className="inline-flex items-center gap-1 text-muted hover:text-warm-white transition-colors mb-2"
            style={{ fontSize: "0.8125rem" }}
          >
            ← Markets
          </Link>
          <h1 className="text-warm-white font-medium" style={{ fontSize: "2rem" }}>Markets — Universe</h1>
          <p className="text-muted" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Manage the tracked ticker universe. Add, deactivate, or toggle watchlist.
          </p>
        </div>
        <button
          onClick={() => setPanelOpen(true)}
          className="shrink-0 h-9 px-4 flex items-center rounded-[8px] text-[13px] mt-1 cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)", color: "#61c1d8" }}
        >
          + Add ticker
        </button>
      </div>

      <div className="mt-5 mb-4">
        <SectorChips
          sectors={sectors}
          active={sector}
          onSelect={setSector}
          search={search}
          onSearch={setSearch}
        />
      </div>

      <p className="text-muted mb-3" style={{ fontSize: "0.75rem" }}>
        {loading ? "Loading…" : `${filtered.length} ticker${filtered.length === 1 ? "" : "s"}`}
      </p>

      <UniverseTable
        rows={filtered}
        empty={filtered.length === 0 && !loading}
        deleting={deleting}
        onTickerClick={setActiveTicker}
        onDeactivate={deactivate}
        onWatchlistToggle={toggleWatchlist}
      />

      <AddTickerPanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} onSaved={reload} />
      <TickerModal ticker={activeTicker} onClose={() => setActiveTicker(null)} />
    </div>
  );
}
