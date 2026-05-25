export function fmt(v: number | null, isPercent = false, decimals = 2): string {
  if (v == null) return "—";
  const val = isPercent ? v * 100 : v;
  const sign = v >= 0 ? "+" : "";
  return `${sign}${val.toFixed(decimals)}${isPercent ? "%" : ""}`;
}

export function pct(v: number | null): string {
  return fmt(v, true, 1);
}

export function fmtEps(v: number | null): string {
  if (v == null) return "—";
  return `${v >= 0 ? "" : "-"}$${Math.abs(v).toFixed(2)}`;
}

export function fmtDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleDateString("en-US", opts ?? { month: "short", day: "numeric" });
}

export function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}
