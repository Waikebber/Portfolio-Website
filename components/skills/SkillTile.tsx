import type { SkillGroup } from "@/types";
import { SmallChip } from "./SkillChip";

export default function SkillTile({ group }: { group: SkillGroup }) {
  return (
    <div className="min-h-full rounded-[12px] p-4 bg-surface border-[0.5px] border-[rgba(255,255,255,0.08)] max-md:rounded-none max-md:bg-transparent max-md:border-0 max-md:p-0">
      <p className="text-teal text-[10px] tracking-[1.4px] mb-3 max-md:text-[0.625rem] max-md:tracking-[0.08em] max-md:uppercase max-md:mb-[0.375rem]">{group.category}</p>
      <div className="flex flex-wrap gap-1.5">
        {group.skills.map((skill) => (
          <SmallChip key={skill} label={skill} />
        ))}
      </div>
    </div>
  );
}
