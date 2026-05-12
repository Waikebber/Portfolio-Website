export type RegionId = "italy" | "japan" | "california";

export interface Photo {
  id: string;
  filename: string;
  location: string;
  region: RegionId;
  is_hero: boolean;
}

export interface PhotoRegion {
  id: RegionId;
  label: string;
  heroPhoto: string;
  subLocations: string;
  photoCount: number;
}

export interface ExperienceEntry {
  id: string;
  dateRange: string;
  location: string;
  title: string;
  company: string;
  description: string;
  type: "work" | "education";
}

export type ProjectSize = "large" | "medium" | "small";
export type LinkType = "github" | "doc";

export interface Project {
  id: string;
  tag: string;
  title: string;
  tileBlurb: string;
  subtitle: string;
  description: string;
  chips: string[];
  image?: string | null;
  activeImage?: string | null;
  displayBottomOffset?: number;
  link?: string;
  linkType?: LinkType;
  size: ProjectSize;
  order: number;
}

export interface AboutData {
  subheading: string;
  bio: string[];
  quickFacts: { label: string; value: string }[];
}

export interface SkillGroup {
  id: string;
  category: string;
  label: string;
  skills: string[];
  featured: boolean;
}
