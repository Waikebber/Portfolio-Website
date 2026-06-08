import { notFound } from "next/navigation";

export default function MarketsLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_MARKETS_ENABLED !== "true") notFound();
  return <>{children}</>;
}
