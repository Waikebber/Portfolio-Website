import type { ExperienceEntry as Entry } from "@/types";

export default function ExperienceEntry({
  entry,
  showDivider,
}: {
  entry: Entry;
  showDivider: boolean;
}) {
  return (
    <div>
      <div className="grid grid-cols-[240px_1fr] py-0">
        <div>
          <p className="text-[12px] leading-[20px]" style={{ color: "#444" }}>
            {entry.dateRange}
          </p>
          <p className="text-[12px] leading-[20px]" style={{ color: "#4d4d4d" }}>
            {entry.location}
          </p>
        </div>

        <div className="pb-6">
          <p className="text-warm-white text-[15px] font-medium leading-[22px]">
            {entry.title}
          </p>
          <p className="text-teal text-[13px] leading-[20px] mt-0.5">
            {entry.company}
          </p>
          <p className="text-muted text-[13px] leading-[21px] mt-2 max-w-[620px]">
            {entry.description}
          </p>
        </div>
      </div>

      {showDivider && (
        <div
          className="h-px mb-6"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
      )}
    </div>
  );
}
