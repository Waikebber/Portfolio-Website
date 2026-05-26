// Server-side only — never import this from a client component.
import type { DashboardData, TickerDetail, TickerRow } from "@/types/markets";

const BASE = process.env.MARKETS_API_URL;
const KEY = process.env.MARKETS_API_KEY;

async function mfetch<T>(path: string, options?: RequestInit, revalidate = 1800): Promise<T> {
  if (!BASE || !KEY) throw new Error("MARKETS_API_URL or MARKETS_API_KEY is not set");
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "X-API-Key": KEY,
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    next: { revalidate },
  });
  if (!res.ok) {
    const isJson = res.headers.get("content-type")?.includes("application/json");
    const detail = isJson
      ? await res.json().then((d) => d?.detail ?? d?.error ?? "").catch(() => "")
      : "";
    throw new Error(`Markets API ${res.status}${detail ? `: ${detail}` : ""}`);
  }
  return res.json();
}

export const getDashboard = () =>
  mfetch<DashboardData>("/api/dashboard", undefined, 1800);

export const getTickers = () =>
  mfetch<TickerRow[]>("/api/tickers", undefined, 300);

export const getTickerDetail = (ticker: string) =>
  mfetch<TickerDetail>(`/api/tickers/${ticker}/detail`, undefined, 300);
