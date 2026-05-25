"use client";

import { useEffect, useMemo, useState } from "react";
import type { TickerRow } from "@/types/markets";

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
  const [loading, setLoading] = useState(true);
  const [sector, setSector] = useState("All");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function reload() {
    setLoading(true);
    try {
      const res = await fetch("/api/markets/tickers");
      if (res.ok) setTickers(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload(); }, []);

  // Keep sector chips in a consistent order, only showing sectors that exist in data
  const sectors = useMemo(() => {
    const present = new Set(tickers.map((t) => t.sector).filter(Boolean) as string[]);
    return ORDERED_SECTORS.filter((s) => s === "All" || present.has(s));
  }, [tickers]);

  const filtered = useMemo(() => {
    return tickers.filter((t) => {
      if (sector !== "All" && t.sector !== sector) return false;
      if (search) {
        const q = search.toLowerCase();
        return t.ticker.toLowerCase().includes(q) || t.company_name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [tickers, sector, search]);

  async function deactivate(ticker: string) {
    setDeleting(ticker);
    try {
      await fetch(`/api/markets/tickers/${ticker}`, { method: "DELETE" });
      await reload();
    } finally {
      setDeleting(null);
    }
  }

  return {
    tickers,
    filtered,
    loading,
    sectors,
    sector,
    setSector,
    search,
    setSearch,
    deleting,
    deactivate,
    reload,
  };
}
