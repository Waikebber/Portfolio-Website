"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getPhotoUrl } from "@/lib/storage";
import Spinner from "@/components/Spinner";
import type { Photo, PhotoRegion, RegionId } from "@/types";

export default function Accordion({
  photos,
  regions,
  activeIndex,
  activeRegion,
  onNav,
  onClose,
  onSeeAll,
}: {
  photos: Photo[];
  regions: PhotoRegion[];
  activeIndex: number;
  activeRegion: RegionId;
  onNav: (index: number) => void;
  onClose: () => void;
  onSeeAll: () => void;
}) {
  const photo = photos[activeIndex];
  const total = photos.length;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setLoaded(false); }, [photo.id]);
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
    <div className="relative h-[calc(100vh-64px)] max-md:h-auto max-md:min-h-[calc(100vh-64px)] max-md:flex max-md:flex-col">
      {/* Photo area */}
      <div className="max-md:relative max-md:h-[65vw] max-md:min-h-[18rem] max-md:flex-none max-md:overflow-hidden">
        {/* Photo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={photo.id}
            className="absolute inset-0 max-md:absolute max-md:inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {!loaded && <Spinner size={32} />}
            <Image
              src={getPhotoUrl(photo.filename)}
              alt={photo.location}
              fill
              unoptimized
              className="object-contain transition-opacity duration-300"
              style={{ opacity: loaded ? 1 : 0 }}
              priority
              onLoad={() => setLoaded(true)}
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

        {/* Bottom gradient — desktop only within photo area */}
        <div
          className="absolute inset-x-0 bottom-0 h-[200px] z-10 pointer-events-none max-md:hidden"
          style={{
            background: "linear-gradient(to bottom, transparent, rgba(13,13,15,0.92))",
          }}
        />

        {/* Prev arrow */}
        <button
          onClick={prev}
          className="absolute left-10 top-1/2 -translate-y-1/2 z-20 size-12 rounded-full flex items-center justify-center text-warm-white hover:bg-white/5 transition-colors cursor-pointer max-md:left-3 max-md:size-10"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          ←
        </button>

        {/* Next arrow */}
        <button
          onClick={next}
          className="absolute right-10 top-1/2 -translate-y-1/2 z-20 size-12 rounded-full flex items-center justify-center text-warm-white hover:bg-white/5 transition-colors cursor-pointer max-md:right-3 max-md:size-10"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          →
        </button>

        {/* Top-right controls */}
        <div className="absolute top-6 right-10 z-20 flex items-center gap-2 max-md:top-3 max-md:right-3">
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
      </div>

      {/* Bottom gradient for mobile — sits between photo and caption */}
      <div
        className="hidden max-md:block h-8 shrink-0"
        style={{
          background: "linear-gradient(to bottom, rgba(13,13,15,0.6), #0d0d0f)",
        }}
      />

      {/* Caption + dots — desktop: absolute; mobile: static in flex flow */}
      <div className="max-md:flex-1 max-md:bg-bg max-md:px-6 max-md:pt-4 max-md:pb-8 max-md:flex max-md:flex-col max-md:gap-4">
        {/* Bottom-left location */}
        <div className="absolute bottom-14 left-12 z-20 max-md:static max-md:bottom-auto max-md:left-auto">
          {city && <p className="text-muted text-[13px] leading-5 max-md:text-[0.8125rem]">{city}</p>}
          <p className="text-warm-white text-[32px] font-medium leading-tight max-md:text-[2rem]">{venue}</p>
        </div>

        {/* Bottom-center counter + region dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 max-md:static max-md:translate-x-0 max-md:left-auto max-md:bottom-auto max-md:items-start">
          <div className="flex items-center gap-1.5">
            {regions.map(({ id }) => (
              <div
                key={id}
                style={{
                  width: id === activeRegion ? "1.25rem" : "0.375rem",
                  height: id === activeRegion ? "0.375rem" : "0.375rem",
                  borderRadius: "0.1875rem",
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
    </div>
  );
}
