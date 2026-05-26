export type SignalStrength = "strong_bull" | "bull" | "neutral" | "bear" | "strong_bear";

export interface WatchlistTicker {
  ticker: string;
  company_name: string;
  sector: string | null;
  sentiment_score: number | null;
  signal_strength: SignalStrength | null;
  return_1d: number | null;
  return_5d: number | null;
}

export interface SectorRow {
  sector: string;
  sentiment_score: number | null;
  return_5d_avg: number | null;
  ticker_count: number;
  article_count: number;
}

export interface MoverTicker {
  ticker: string;
  company_name: string;
  return_1d: number | null;
  return_5d: number | null;
  sentiment_score: number | null;
  signal_strength: SignalStrength | null;
  top_headline: string | null;
  top_headline_url: string | null;
}

export interface TopMovers {
  bull: MoverTicker[];
  bear: MoverTicker[];
}

export interface VolumeFlag {
  ticker: string;
  company_name: string;
  volume_ratio: number;
  top_headline: string | null;
  top_headline_url: string | null;
}

export interface EarningsRow {
  ticker: string;
  company_name: string;
  earnings_date: string;
  eps_estimate: number | null;
  eps_prior: number | null;
  days_out: number;
}

export interface SectorEtf {
  ticker: string;
  sector: string | null;
  return_1d: number | null;
  return_5d: number | null;
  price_close: number | null;
}

export interface DashboardData {
  as_of: string;
  watchlist: WatchlistTicker[];
  sector_etfs: SectorEtf[];
  sector_heatmap: SectorRow[];
  top_movers: TopMovers;
  unusual_volume: VolumeFlag[];
  earnings_radar: EarningsRow[];
}

// Sector detail modal
export interface SectorTicker {
  ticker: string;
  company_name: string;
  sentiment_score: number | null;
  signal_strength: SignalStrength | null;
  return_1d: number | null;
  return_5d: number | null;
  price_close: number | null;
  in_watchlist: boolean;
}

export interface SectorArticle {
  ticker: string;
  headline: string | null;
  url: string;
  source: string | null;
  av_sentiment_label: string | null;
  published_at: string | null;
}

export interface SectorDetail {
  sector: string;
  tickers: SectorTicker[];
  recent_articles: SectorArticle[];
}

// Ticker lookup (add-ticker flow)
export interface TickerLookup {
  ticker: string;
  company_name: string;
  sector: string | null;
  industry: string | null;
  market_cap_b: number | null;
  price_close: number | null;
  in_universe: boolean;
}

// Universe manager
export interface TickerRow {
  ticker: string;
  company_name: string;
  sector: string | null;
  industry: string | null;
  market_cap_b: number | null;
  active: boolean;
  in_watchlist: boolean;
}

// Ticker detail modal
export interface TickerDetail {
  metadata: TickerRow;
  today: {
    sentiment_score: number | null;
    signal_strength: SignalStrength | null;
    article_count: number | null;
    return_1d: number | null;
    return_5d: number | null;
    return_20d: number | null;
    volume_ratio: number | null;
    price_close: number | null;
  } | null;
  sentiment_history: Array<{
    date: string;
    sentiment_score: number | null;
    signal_strength: SignalStrength | null;
    article_count: number | null;
  }>;
  price_history: Array<{
    date: string;
    price_close: number | null;
    volume: number | null;
    return_1d: number | null;
  }>;
  recent_articles: Array<{
    headline: string | null;
    url: string;
    source: string | null;
    av_sentiment_label: string | null;
    av_relevance_score: number | null;
    published_at: string | null;
  }>;
  sector_avg_score: number | null;
  earnings_next: {
    earnings_date: string;
    eps_estimate: number | null;
    eps_prior: number | null;
    days_out: number;
  } | null;
  earnings_recent: Array<{
    earnings_date: string;
    eps_estimate: number | null;
    eps_actual: number | null;
  }>;
}
