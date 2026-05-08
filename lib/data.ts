import type { ExperienceEntry, Project, SkillGroup } from "@/types";

import experienceData from "@/data/experience.json";
import projectsData from "@/data/projects.json";
import skillsData from "@/data/skills.json";

export function getExperience(): ExperienceEntry[] {
  return experienceData as ExperienceEntry[];
}

export function getProjects(): Project[] {
  return (projectsData as Project[]).sort((a, b) => a.order - b.order);
}

export function getSkills(): SkillGroup[] {
  return skillsData as SkillGroup[];
}

export function getFeaturedSkills(): SkillGroup {
  return getSkills().find((s) => s.featured)!;
}

export function getNonFeaturedSkills(): SkillGroup[] {
  return getSkills().filter((s) => !s.featured);
}
