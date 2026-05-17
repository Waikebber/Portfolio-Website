const REGIONS = ["All", "Japan", "Italy", "California"];

interface Props {
  value: string;
  onChange: (region: string) => void;
}

export default function RegionFilter({ value, onChange }: Props) {
  return (
    <div className="flex scrollbar-none" style={{ gap: "0.5rem", overflowX: "auto" }}>
      {REGIONS.map((r) => {
        const label = r === "All" ? "All regions" : r;
        const isActive = value === r;
        return (
          <button
            key={r}
            onClick={() => onChange(r)}
            className="flex-none cursor-pointer whitespace-nowrap transition-colors"
            style={{
              borderRadius: "1.25rem",
              padding: "0.4375rem 0.875rem",
              fontSize: "0.75rem",
              background: isActive ? "rgba(97,193,216,0.12)" : "#19191d",
              border: isActive
                ? "1px solid rgba(97,193,216,0.25)"
                : "1px solid rgba(255,255,255,0.06)",
              color: isActive ? "#61c1d8" : "#888",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
