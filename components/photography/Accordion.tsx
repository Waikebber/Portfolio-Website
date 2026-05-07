"use client";

import Image from "next/image";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getPhotoRegions } from "@/lib/data";
import type { Photo, RegionId } from "@/types";

function photoSrc(filename: string) {
  return `/assets/photography/${encodeURIComponent(filename)}`;
}

export default function Accordion({
  photos,
  activeIndex,
  activeRegion,
  onNav,
  onClose,
  onSeeAll,
}: {
  photos: Photo[];
  activeIndex: number;
  activeRegion: RegionId;
  onNav: (index: number) => void;
  onClose: () => void;
  onSeeAll: () => void;
}) {
  const photo = photos[activeIndex];
  const total = photos.length;
  const [venue, city] = photo.location.includes(",")
    ? photo.location.split(",").map((s) => s.trim())
    : [photo.location, null];

  function prev() {
    onNav((activeIndex - 1 + total) % total);
  }
  function next() {
    onNav((activeIndex + 1) % total);
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onNav((activeIndex - 1 + total) % total);
      if (e.key === "ArrowRight") onNav((activeIndex + 1) % total);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, total, onNav, onClose]);

  return (
    <div className="relative h-[calc(100vh-64px)]">
      {/* Photo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={photo.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Image
            src={photoSrc(photo.filename)}
            alt={photo.location}
            fill
            className="object-contain"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Radial vignette */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Bottom gradient */}
      <div
        className="absolute inset-x-0 bottom-0 h-[200px] z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(13,13,15,0.92))",
        }}
      />

      {/* Prev arrow */}
      <button
        onClick={prev}
        className="absolute left-10 top-1/2 -translate-y-1/2 z-20 size-12 rounded-full flex items-center justify-center text-warm-white hover:bg-white/5 transition-colors cursor-pointer"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >
        ←
      </button>

      {/* Next arrow */}
      <button
        onClick={next}
        className="absolute right-10 top-1/2 -translate-y-1/2 z-20 size-12 rounded-full flex items-center justify-center text-warm-white hover:bg-white/5 transition-colors cursor-pointer"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >
        →
      </button>

      {/* Top-right controls */}
      <div className="absolute top-6 right-10 z-20 flex items-center gap-2">
        <button
          onClick={onSeeAll}
          className="h-8 px-4 text-muted text-[12px] rounded-[6px] hover:text-warm-white transition-colors cursor-pointer"
          style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          See all
        </button>
        <button
          onClick={onClose}
          className="size-8 flex items-center justify-center text-muted text-[13px] rounded-[6px] hover:text-warm-white transition-colors cursor-pointer"
          style={{ background: "#141417", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          ✕
        </button>
      </div>

      {/* Bottom-left location */}
      <div className="absolute bottom-14 left-12 z-20">
        {city && <p className="text-muted text-[13px] leading-5">{city}</p>}
        <p className="text-warm-white text-[32px] font-medium leading-tight">{venue}</p>
      </div>

      {/* Bottom-center counter + region dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5">
          {getPhotoRegions().map(({ id }) => (
            <div
              key={id}
              style={{
                width: id === activeRegion ? "24px" : "8px",
                height: "4px",
                borderRadius: "2px",
                background: id === activeRegion ? "#61c1d8" : "#444444",
                transition: "width 0.3s ease, background 0.3s ease",
              }}
            />
          ))}
        </div>
        <span className="text-muted text-[12px]">
          {activeIndex + 1} / {total}
        </span>
      </div>
    </div>
  );
}
