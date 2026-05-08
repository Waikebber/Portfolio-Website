"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { getProjects } from "@/lib/data";
import ProjectTile from "@/components/projects/ProjectTile";
import ProjectExpanded from "@/components/projects/ProjectExpanded";

const GRID_CLASSES: Record<number, string> = {
  0: "col-start-1 col-span-3 row-start-1 row-span-2",
  1: "col-start-4 col-span-3 row-start-1",
  2: "col-start-4 col-span-3 row-start-2",
  3: "col-start-1 col-span-2 row-start-3",
  4: "col-start-3 col-span-2 row-start-3",
  5: "col-start-5 col-span-2 row-start-3",
};

export default function ProjectsSection() {
  const projects = getProjects();
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeProject = projects.find((p) => p.id === activeId) ?? null;

  return (
    <div className="h-full flex flex-col pt-[72px] px-6 md:px-16 xl:pl-[270px] xl:pr-[270px]">
      <div className="flex-1 flex flex-col justify-center pt-4 pb-16 min-h-0">
        <p className="text-teal text-[11px] tracking-[1.4px] mb-2">PROJECTS</p>
        <h2 className="text-warm-white text-[40px] font-medium mb-6">
          Things I&apos;ve built
        </h2>

        <div className="relative max-h-[580px] flex-1 min-h-0 grid grid-cols-6 grid-rows-[minmax(120px,1fr)_minmax(120px,1fr)_minmax(120px,1fr)] gap-3">
          {projects.map((project) => (
            <div key={project.id} className={GRID_CLASSES[project.order]}>
              {activeId === project.id ? (
                <div className="h-full w-full rounded-[12px]" />
              ) : (
                <ProjectTile
                  project={project}
                  onExpand={() => setActiveId(project.id)}
                  inactive={activeProject !== null}
                  activeProject={activeProject}
                />
              )}
            </div>
          ))}

          <AnimatePresence>
            {activeProject && (
              <>
                <div
                  className="absolute inset-0 z-10"
                  onClick={() => setActiveId(null)}
                />
                <ProjectExpanded
                  project={activeProject}
                  onClose={() => setActiveId(null)}
                />
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
