import { getFeaturedSkills, getNonFeaturedSkills } from "@/lib/data";
import FeaturedSkillTile from "@/components/skills/FeaturedSkillTile";
import SkillTile from "@/components/skills/SkillTile";

const GRID_CLASSES: Record<string, string> = {
  "day-to-day": "col-start-1 col-span-2 row-start-1 row-span-2",
  languages:    "col-start-3 col-span-3 row-start-1",
  infra:        "col-start-6 col-span-1 row-start-1",
  frontend:     "col-start-3 col-span-2 row-start-2",
  "apis-auth":  "col-start-5 col-span-2 row-start-2",
  ml:           "col-start-1 col-span-1 row-start-3",
  tools:        "col-start-2 col-span-2 row-start-3",
  "geo-data":   "col-start-4 col-span-1 row-start-3",
  hardware:     "col-start-5 col-span-2 row-start-3",
};

export default function SkillsSection() {
  const featured = getFeaturedSkills();
  const rest = getNonFeaturedSkills();
  const allGroups = [featured, ...rest];

  return (
    <div className="h-full flex flex-col pt-[72px] px-6 md:px-16 xl:pl-[270px] xl:pr-[270px] max-md:h-auto max-md:pt-[88px] max-md:pb-12">
      <div className="flex-1 flex flex-col justify-center pt-4 pb-16 min-h-0 max-md:flex-none max-md:justify-start max-md:pt-0 max-md:pb-0">
        <p className="text-teal text-[11px] tracking-[2.2px] mb-3">SKILLS</p>
        <h2 className="text-warm-white text-[40px] font-medium mb-6">
          What I&apos;ve worked with
        </h2>

        <div className="flex-1 min-h-0 max-h-[500px] grid grid-cols-6 grid-rows-[minmax(min-content,1fr)_minmax(min-content,1fr)_minmax(min-content,1fr)] gap-3 max-md:flex max-md:flex-col max-md:max-h-none max-md:min-h-0 max-md:flex-none max-md:gap-[0.75rem]">
          {allGroups.map((group) => (
            <div key={group.id} className={`${GRID_CLASSES[group.id]} max-md:min-w-0 max-md:w-full`}>
              {group.featured ? (
                <FeaturedSkillTile group={group} />
              ) : (
                <SkillTile group={group} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
