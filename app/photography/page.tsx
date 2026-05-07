"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "@/components/Nav";
import RegionOverview from "@/components/photography/RegionOverview";
import RegionGrid from "@/components/photography/RegionGrid";
import Accordion from "@/components/photography/Accordion";
import { getPhotosByRegion } from "@/lib/data";
import type { RegionId } from "@/types";

type View = "overview" | "region" | "accordion";

export default function PhotographyPage() {
  const [view, setView] = useState<View>("overview");
  const [activeRegion, setActiveRegion] = useState<RegionId | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const regionPhotos = activeRegion ? getPhotosByRegion(activeRegion) : [];

  function openRegion(region: RegionId) {
    setActiveRegion(region);
    setView("region");
  }

  function openAccordion(index: number) {
    setActivePhotoIndex(index);
    setView("accordion");
  }

  function closeAccordion() {
    setView("region");
  }

  function goToOverview() {
    setView("overview");
    setActiveRegion(null);
  }

  return (
    <div className="min-h-screen bg-bg">
      <Nav />
      <div className="pt-[64px]">
        <AnimatePresence mode="wait">
          {view === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <RegionOverview onSelectRegion={openRegion} />
            </motion.div>
          )}

          {view === "region" && activeRegion && (
            <motion.div
              key="region"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <RegionGrid
                region={activeRegion}
                photos={regionPhotos}
                onBack={goToOverview}
                onSelectPhoto={openAccordion}
              />
            </motion.div>
          )}

          {view === "accordion" && activeRegion && (
            <motion.div
              key="accordion"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Accordion
                photos={regionPhotos}
                activeIndex={activePhotoIndex}
                activeRegion={activeRegion}
                onNav={setActivePhotoIndex}
                onClose={closeAccordion}
                onSeeAll={goToOverview}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
