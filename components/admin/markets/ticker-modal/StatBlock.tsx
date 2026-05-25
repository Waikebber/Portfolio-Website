export default function StatBlock({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div>
      <p className="text-muted" style={{ fontSize: "0.6875rem", marginBottom: "0.25rem" }}>{label}</p>
      <p className="text-warm-white font-semibold" style={{ fontSize: "1rem" }}>{value}</p>
      {sub && <p className="text-muted" style={{ fontSize: "0.6875rem", marginTop: "0.1rem" }}>{sub}</p>}
    </div>
  );
}
