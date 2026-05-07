"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Project } from "@/types";

const COL_CENTER: Record<number, number> = {
  0: 1.5,
  1: 4.5,
  2: 4.5,
  3: 0.5,
  4: 2.5,
  5: 4.5,
};

export const TILE_BORDER: Record<number, string> = {
  0: "rgba(97,193,216,0.18)",
  1: "rgba(255,255,255,0.07)",
  2: "rgba(255,255,255,0.07)",
  3: "rgba(255,255,255,0.07)",
  4: "rgba(255,255,255,0.07)",
  5: "rgba(255,255,255,0.07)",
};

export function getSlideX(project: Project, active: Project): number {
  return COL_CENTER[project.order] <= COL_CENTER[active.order] ? -320 : 320;
}

export default function ProjectTile({
  project,
  onExpand,
  inactive,
  activeProject,
}: {
  project: Project;
  onExpand: () => void;
  inactive: boolean;
  activeProject: Project | null;
}) {
  const slideX = inactive && activeProject ? getSlideX(project, activeProject) : 0;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layoutId={project.id}
      className="relative h-full rounded-[12px] overflow-hidden cursor-pointer"
      style={{
        border: `1px solid ${TILE_BORDER[project.order]}`,
        pointerEvents: inactive ? "none" : "auto",
      }}
      animate={{ x: slideX, opacity: inactive ? 0 : 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      onClick={onExpand}
      onHoverStart={() => !inactive && setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={inactive ? {} : { scale: 1.01 }}
    >
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 z-10 rounded-[12px]"
          animate={{ background: hovered ? "rgba(0,0,0,0.38)" : "rgba(0,0,0,0.62)" }}
          transition={{ duration: 0.25 }}
        />
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover rounded-[12px]"
        />
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-[100px] z-20"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.85))",
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 z-30 p-5">
        <p className="text-[10px] tracking-[1.4px] mb-1" style={{ color: "#d9ebf0" }}>
          {project.tag}
        </p>
        <p className="text-warm-white font-medium text-[15px] leading-tight mb-1">
          {project.title}
        </p>
        <p className="text-[#bfbfbf] text-[11px] leading-[16px]">{project.tileBlurb}</p>
      </div>
    </motion.div>
  );
}
