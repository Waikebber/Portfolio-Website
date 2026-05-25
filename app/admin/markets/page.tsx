import { getDashboard } from "@/lib/markets";
import MarketsClient from "@/components/admin/markets/MarketsClient";

export const revalidate = 1800;

export default async function MarketsPage() {
  let data;
  try {
    data = await getDashboard();
  } catch (e) {
    return (
      <div>
        <h1 className="text-warm-white font-medium mb-2" style={{ fontSize: "2rem" }}>Markets</h1>
        <div
          style={{
            background: "#141417",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            marginTop: "1.5rem",
          }}
        >
          <p className="text-warm-white text-[14px] font-medium mb-1">Markets API unavailable</p>
          <p className="text-muted text-[13px]">
            Make sure the FastAPI service is running at{" "}
            <code className="text-teal">{process.env.MARKETS_API_URL ?? "MARKETS_API_URL not set"}</code>.
          </p>
          <p className="text-muted text-[11px] mt-2">{String(e)}</p>
        </div>
      </div>
    );
  }

  return <MarketsClient data={data} />;
}
