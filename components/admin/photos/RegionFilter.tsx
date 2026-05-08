const REGIONS = ["All", "Japan", "Italy", "California"];

interface Props {
  value: string;
  onChange: (region: string) => void;
}

export default function RegionFilter({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 px-3 rounded-[6px] text-warm-white text-[13px] outline-none cursor-pointer"
      style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {REGIONS.map((r) => (
        <option key={r} value={r}>{r === "All" ? "All regions" : r}</option>
      ))}
    </select>
  );
}
