interface Props {
  sectors: string[];
  active: string;
  onSelect: (sector: string) => void;
  search: string;
  onSearch: (v: string) => void;
}

export default function SectorChips({ sectors, active, onSelect, search, onSearch }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {sectors.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="h-8 px-3 rounded-full text-[12px] cursor-pointer transition-colors"
          style={{
            background: active === s ? "rgba(97,193,216,0.15)" : "rgba(255,255,255,0.04)",
            color:      active === s ? "#61c1d8" : "#888",
            border:     active === s ? "1px solid rgba(97,193,216,0.3)" : "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {s}
        </button>
      ))}
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search tickers or companies…"
        className="ml-auto h-8 px-3 rounded-[6px] text-[13px] outline-none"
        style={{
          background: "#19191d",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#f0ede6",
          minWidth: "14rem",
        }}
      />
    </div>
  );
}
