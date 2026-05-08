import type { SkillGroup } from "@/types";
import { SmallChip } from "./SkillChip";

export default function SkillTile({ group }: { group: SkillGroup }) {
  return (
    <div
      className="min-h-full rounded-[12px] p-4"
      style={{
        background: "#141417",
        border: "0.5px solid rgba(255,255,255,0.08)",
      }}
    >
      <p className="text-teal text-[10px] tracking-[1.4px] mb-3">{group.category}</p>
      <div className="flex flex-wrap gap-1.5">
        {group.skills.map((skill) => (
          <SmallChip key={skill} label={skill} />
        ))}
      </div>
    </div>
  );
}
