import { useState, useEffect } from "react";

export interface SkillCategory {
  category: string;
  skills: string[];
}

export const useSkillsData = () => {
  const [skillsData, setSkillsData] = useState<SkillCategory[]>([]);

  useEffect(() => {
    fetch("/data/skills.json")
      .then((res) => res.json())
      .then((data) => setSkillsData(data))
      .catch((err) => console.error("Failed to load skills data", err));
  }, []);

  return skillsData;
};
