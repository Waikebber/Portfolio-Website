import type { ExperienceEntry, Photo, PhotoRegion, Project, RegionId, SkillGroup } from "@/types";

import experienceData from "@/data/experience.json";
import photosData from "@/data/photos.json";
import projectsData from "@/data/projects.json";
import skillsData from "@/data/skills.json";

const PHOTO_REGIONS: PhotoRegion[] = [
  {
    id: "italy",
    label: "Italy",
    heroPhoto: "ita_capri_tree.webp",
    subLocations: "Capri · Sorrento · Rome · Vatican",
    photoCount: 5,
  },
  {
    id: "japan",
    label: "Japan",
    heroPhoto: "jpn_nanzenji.webp",
    subLocations: "Tokyo · Kyoto · Asakusa",
    photoCount: 9,
  },
  {
    id: "california",
    label: "California",
    heroPhoto: "usa_halfMoon_harbor.webp",
    subLocations: "Half Moon Bay · Montara",
    photoCount: 7,
  },
];

export function getExperience(): ExperienceEntry[] {
  return experienceData as ExperienceEntry[];
}

export function getPhotos(): Photo[] {
  return photosData as Photo[];
}

export function getPhotosByRegion(region: RegionId): Photo[] {
  return getPhotos().filter((p) => p.region === region);
}

export function getPhotoRegions(): PhotoRegion[] {
  return PHOTO_REGIONS;
}

export function getPhotoRegion(id: RegionId): PhotoRegion | undefined {
  return PHOTO_REGIONS.find((r) => r.id === id);
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
