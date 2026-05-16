import type { SkillGroup } from "@/types";
import { LargeChip } from "./SkillChip";

export default function FeaturedSkillTile({ group }: { group: SkillGroup }) {
  return (
    <div className="min-h-full rounded-[12px] p-4 bg-surface-teal border border-[rgba(97,193,216,0.35)] max-md:rounded-none max-md:bg-transparent max-md:border-0 max-md:p-0">
      <p className="text-teal text-[10px] tracking-[1.4px] mb-2 max-md:text-[0.625rem] max-md:tracking-[0.08em] max-md:uppercase max-md:mb-[0.375rem]">{group.category}</p>
      <p className="text-warm-white text-[15px] font-medium mb-4 max-md:hidden">{group.label}</p>
      <div className="flex flex-col gap-2 max-md:flex-row max-md:flex-wrap max-md:gap-1.5">
        {group.skills.map((skill) => (
          <LargeChip key={skill} label={skill} />
        ))}
      </div>
    </div>
  );
}
