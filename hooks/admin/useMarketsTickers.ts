"use client";

import { useEffect, useMemo, useState } from "react";
import type { TickerRow } from "@/types/markets";
import { createClient } from "@/lib/supabase/client";

const ORDERED_SECTORS = [
  "All",
  "Technology",
  "Healthcare",
  "Industrials",
  "Financials",
  "Energy",
  "Consumer Disc.",
  "Materials",
  "Real Estate",
  "Utilities",
  "Comm. Services",
];

export function useMarketsTickers() {
  const [tickers, setTickers] = useState<TickerRow[]>([]);
  const [watchlistSet, setWatchlistSet] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [sector, setSector] = useState("All");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function reloadWatchlist() {
    const supabase = createClient();
    const { data } = await supabase.from("user_watchlist").select("ticker");
    setWatchlistSet(new Set(data?.map((r) => r.ticker) ?? []));
  }

  async function reload() {
    setLoading(true);
    try {
      const res = await fetch("/api/markets/tickers");
      if (res.ok) setTickers(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
    reloadWatchlist();
  }, []);

  const sectors = useMemo(() => {
    const present = new Set(tickers.map((t) => t.sector).filter(Boolean) as string[]);
    return ORDERED_SECTORS.filter((s) => s === "All" || present.has(s));
  }, [tickers]);

  // Overlay per-user watchlist onto backend ticker data
  const tickersWithWatchlist = useMemo(
    () => tickers.map((t) => ({ ...t, in_watchlist: watchlistSet.has(t.ticker) })),
    [tickers, watchlistSet]
  );

  const filtered = useMemo(() => {
    return tickersWithWatchlist.filter((t) => {
      if (sector !== "All" && t.sector !== sector) return false;
      if (search) {
        const q = search.toLowerCase();
        return t.ticker.toLowerCase().includes(q) || t.company_name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [tickersWithWatchlist, sector, search]);

  async function deactivate(ticker: string) {
    setDeleting(ticker);
    try {
      await fetch(`/api/markets/tickers/${ticker}`, { method: "DELETE" });
      await reload();
    } finally {
      setDeleting(null);
    }
  }

  async function toggleWatchlist(ticker: string, currentlyIn: boolean) {
    setWatchlistSet((prev) => {
      const next = new Set(prev);
      currentlyIn ? next.delete(ticker) : next.add(ticker);
      return next;
    });
    const res = await fetch(`/api/markets/tickers/${ticker}/watchlist`, {
      method: currentlyIn ? "DELETE" : "POST",
    });
    if (!res.ok) {
      setWatchlistSet((prev) => {
        const next = new Set(prev);
        currentlyIn ? next.add(ticker) : next.delete(ticker);
        return next;
      });
      console.error("Watchlist toggle failed", res.status, await res.text());
    }
  }

  return {
    tickers: tickersWithWatchlist,
    filtered,
    loading,
    sectors,
    sector,
    setSector,
    search,
    setSearch,
    deleting,
    deactivate,
    toggleWatchlist,
    reload,
  };
}
