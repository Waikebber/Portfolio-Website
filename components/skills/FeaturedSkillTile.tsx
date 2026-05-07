import type { SkillGroup } from "@/types";
import { LargeChip } from "./SkillChip";

export default function FeaturedSkillTile({ group }: { group: SkillGroup }) {
  return (
    <div
      className="min-h-full rounded-[12px] p-4"
      style={{
        background: "#0f1e22",
        border: "1px solid rgba(97,193,216,0.35)",
      }}
    >
      <p className="text-teal text-[10px] tracking-[1.4px] mb-2">{group.category}</p>
      <p className="text-warm-white text-[15px] font-medium mb-4">{group.label}</p>
      <div className="flex flex-col gap-2">
        {group.skills.map((skill) => (
          <LargeChip key={skill} label={skill} />
        ))}
      </div>
    </div>
  );
}
