"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { getProjects } from "@/lib/data";
import ProjectTile from "@/components/projects/ProjectTile";
import ProjectExpanded from "@/components/projects/ProjectExpanded";
import type { Project } from "@/types";

const GRID_CLASSES: Record<number, string> = {
  0: "col-start-1 col-span-3 row-start-1 row-span-2 max-md:w-full max-md:h-44",
  1: "col-start-4 col-span-3 row-start-1 max-md:w-full max-md:h-44",
  2: "col-start-4 col-span-3 row-start-2 max-md:w-full max-md:h-44",
  3: "col-start-1 col-span-2 row-start-3 max-md:w-full max-md:h-44",
  4: "col-start-3 col-span-2 row-start-3 max-md:w-full max-md:h-44",
  5: "col-start-5 col-span-2 row-start-3 max-md:w-full max-md:h-44",
};

const base = getProjects();

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>(base);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const scrollLockY = useRef(0);
  const activeProject = projects.find((p) => p.id === activeId) ?? null;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 48rem)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!isMobile || !activeId) return;
    scrollLockY.current = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${scrollLockY.current}px`;
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollLockY.current);
    };
  }, [activeId, isMobile]);

  useEffect(() => {
    fetch("/api/projects/images")
      .then((r) => r.json())
      .then((map: Record<string, { bento: string | null; display: string | null; displayBottomOffset: number }>) => {
        setProjects(
          base.map((p) => ({
            ...p,
            image: map[p.id]?.bento ?? null,
            activeImage: map[p.id]?.display ?? null,
            displayBottomOffset: map[p.id]?.displayBottomOffset ?? 0,
          }))
        );
      })
      .catch(() => {});
  }, []);

  return (
    <div className="h-full flex flex-col pt-[72px] px-6 md:px-16 xl:pl-[270px] xl:pr-[270px] max-md:h-auto max-md:pt-[88px] max-md:pb-12">
      <div className="flex-1 flex flex-col justify-center pt-4 pb-16 min-h-0 max-md:flex-none max-md:justify-start max-md:pt-0 max-md:pb-0">
        <p className="text-teal text-[11px] tracking-[1.4px] mb-2">PROJECTS</p>
        <h2 className="text-warm-white text-[40px] font-medium mb-6">
          Things I&apos;ve built
        </h2>

        <div className="relative max-h-[580px] flex-1 min-h-0 grid grid-cols-6 grid-rows-[minmax(120px,1fr)_minmax(120px,1fr)_minmax(120px,1fr)] gap-3 max-md:flex max-md:flex-col max-md:max-h-none max-md:min-h-0 max-md:flex-none max-md:gap-4">
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
                {!isMobile && (
                  <div
                    className="absolute inset-0 z-10"
                    onClick={() => setActiveId(null)}
                  />
                )}
                <ProjectExpanded
                  project={activeProject}
                  onClose={() => setActiveId(null)}
                  isMobile={isMobile}
                />
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
