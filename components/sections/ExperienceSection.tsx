import { getExperience } from "@/lib/data";
import ExperienceEntry from "@/components/experience/ExperienceEntry";

export default function ExperienceSection() {
  const entries = getExperience();

  return (
    <div className="h-full flex flex-col justify-center pt-[28px] px-6 md:px-16 xl:pl-[270px] xl:pr-[270px]">
      <p className="text-teal text-[11px] tracking-[2.2px] mb-1">EXPERIENCE</p>
      <h2 className="text-warm-white text-[40px] font-medium mb-5">So far...</h2>

      <div className="flex flex-col">
        {entries.map((entry, i) => (
          <ExperienceEntry
            key={entry.id}
            entry={entry}
            showDivider={i < entries.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
