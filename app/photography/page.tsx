"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import Nav from "@/components/Nav";
import RegionOverview from "@/components/photography/RegionOverview";
import RegionGrid from "@/components/photography/RegionGrid";
import Accordion from "@/components/photography/Accordion";
import type { Photo, PhotoRegion, RegionId } from "@/types";

const REGION_META: Omit<PhotoRegion, "photoCount" | "heroPhoto">[] = [
  { id: "italy",      label: "Italy",      subLocations: "Capri · Sorrento · Rome · Vatican" },
  { id: "japan",      label: "Japan",      subLocations: "Tokyo · Kyoto · Asakusa" },
  { id: "california", label: "California", subLocations: "Half Moon Bay · Montara" },
];

type View = "overview" | "region" | "accordion";

export default function PhotographyPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [view, setView] = useState<View>("overview");
  const [activeRegion, setActiveRegion] = useState<RegionId | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("photos")
      .select("id, filename, location, region, is_hero")
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        setPhotos(
          (data ?? []).map((p) => ({
            ...p,
            region: p.region.toLowerCase() as RegionId,
          }))
        );
      });
  }, []);

  const regionPhotos = activeRegion
    ? photos.filter((p) => p.region === activeRegion)
    : [];

  const photoRegions: PhotoRegion[] = REGION_META.map((meta) => {
    const regionPhotosAll = photos.filter((p) => p.region === meta.id);
    const hero = regionPhotosAll.find((p) => p.is_hero) ?? regionPhotosAll[0];
    return {
      ...meta,
      heroPhoto: hero?.filename ?? "",
      photoCount: regionPhotosAll.length,
    };
  });

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
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <RegionOverview regions={photoRegions} onSelectRegion={openRegion} />
            </motion.div>
          )}

          {view === "region" && activeRegion && (
            <motion.div key="region" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <RegionGrid
                region={activeRegion}
                photos={regionPhotos}
                onBack={goToOverview}
                onSelectPhoto={openAccordion}
              />
            </motion.div>
          )}

          {view === "accordion" && activeRegion && (
            <motion.div key="accordion" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <Accordion
                photos={regionPhotos}
                regions={photoRegions}
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
