"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/types";
import ProjectChip from "./ProjectChip";

export default function ProjectExpanded({
  project,
  onClose,
  isMobile = false,
}: {
  project: Project;
  onClose: () => void;
  isMobile?: boolean;
}) {
  if (isMobile) {
    return (
      <motion.div
        key={project.id + "-mobile"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        style={{ background: "rgba(13,13,15,0.88)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
        onClick={onClose}
      >
        {/* Card */}
        <div
          className="w-full flex flex-col overflow-hidden rounded-[1rem]"
          style={{
            maxHeight: "calc(100dvh - 2rem)",
            background: "#141417",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image banner */}
          <div
            className="relative flex-none"
            style={{ height: "50vw", minHeight: "10rem", maxHeight: "15rem" }}
          >
            {project.activeImage && (
              <Image
                src={project.activeImage}
                alt={project.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.3)" }} />
            <div
              className="absolute inset-x-0 bottom-0"
              style={{
                height: "4rem",
                background: "linear-gradient(to bottom, transparent, #141417)",
              }}
            />
            <button
              onClick={onClose}
              className="absolute top-3 left-3 z-10 flex items-center gap-[0.375rem] cursor-pointer"
              style={{
                padding: "0.3rem 0.625rem",
                borderRadius: "999px",
                fontSize: "0.6875rem",
                color: "#f0ede6",
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              ← back
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-5 pt-1 pb-6">
            <p
              style={{
                fontSize: "0.6875rem",
                letterSpacing: "1.8px",
                color: "#61c1d8",
                fontWeight: 500,
                textTransform: "uppercase",
                marginBottom: "0.375rem",
              }}
            >
              {project.tag}
            </p>
            <h3
              className="text-warm-white font-medium"
              style={{ fontSize: "1.5rem", lineHeight: 1.3, marginBottom: "0.25rem" }}
            >
              {project.title}
            </h3>
            <p style={{ fontSize: "0.8125rem", color: "#61c1d8", marginBottom: "0.875rem" }}>
              {project.subtitle}
            </p>

            <div className="h-px mb-3" style={{ background: "rgba(255,255,255,0.08)" }} />

            <p
              style={{
                fontSize: "0.875rem",
                lineHeight: 1.65,
                color: "#999",
                marginBottom: "1rem",
              }}
            >
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.chips.map((chip) => (
                <ProjectChip key={chip} label={chip} />
              ))}
            </div>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full font-medium"
                style={{
                  padding: "0.6875rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  background: "#61c1d8",
                  color: "#0d0d0f",
                }}
              >
                {project.linkType === "github" ? "View on GitHub" : "View Document"}
              </a>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Desktop layout
  return (
    <motion.div
      layoutId={project.id}
      className="absolute inset-0 z-20 rounded-[12px] overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ background: "#141417" }} />
        {(project.activeImage ?? project.image) && (
          <div
            className="absolute z-10"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: `${project.displayBottomOffset ?? 0}%`,
            }}
          >
            <Image
              src={(project.activeImage ?? project.image)!}
              alt={project.title}
              fill
              sizes="100vw"
              className="object-cover opacity-40"
            />
            <div
              className="absolute inset-x-0 bottom-0 h-[15%]"
              style={{ background: "linear-gradient(to bottom, transparent, #141417)" }}
            />
          </div>
        )}
      </div>

      <div
        className="absolute inset-x-0 top-0 h-full z-20"
        style={{
          background:
            "linear-gradient(to bottom, rgba(20,20,23,0) 0%, rgba(20,20,23,0.7) 100%)",
        }}
      />

      <div
        className="absolute inset-x-0 z-20"
        style={{
          top: "35%",
          bottom: 0,
          background:
            "linear-gradient(to bottom, rgba(13,13,15,0) 0%, rgba(13,13,15,0.75) 50%, rgba(13,13,15,0.96) 100%)",
        }}
      />

      <div className="absolute inset-0 z-30 flex flex-col justify-end p-[35px]">
        <p className="text-teal text-[11px] tracking-[1.98px] mb-2">{project.tag}</p>
        <h3 className="text-warm-white text-[28px] font-medium leading-[34px] mb-1">
          {project.title}
        </h3>
        <p className="text-teal text-[12px] mb-4">{project.subtitle}</p>

        <div className="h-px mb-4" style={{ background: "rgba(255,255,255,0.08)" }} />

        <p className="text-[#999] text-[13px] leading-[22px] max-w-[828px] mb-5">
          {project.description}
        </p>

        <div className="flex items-center flex-wrap gap-2 mb-6">
          {project.chips.map((chip) => (
            <ProjectChip key={chip} label={chip} />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-[12px] transition-colors duration-200 hover:text-muted cursor-pointer"
            style={{ color: "#4d4d4d" }}
          >
            ← back to projects
          </button>

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} ${project.linkType}`}
              className="relative size-[24px] rounded-[3px] overflow-hidden opacity-70 hover:opacity-100 transition-opacity"
            >
              <Image
                src={`/assets/icons/${project.linkType === "github" ? "github" : "doc"}-icon.png`}
                alt={project.linkType ?? "link"}
                fill
                className="object-contain invert"
              />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
