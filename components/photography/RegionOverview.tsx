"use client";

import Image from "next/image";
import { useState } from "react";
import { getPhotoUrl } from "@/lib/storage";
import Spinner from "@/components/Spinner";
import type { PhotoRegion, RegionId } from "@/types";

export default function RegionOverview({
  regions,
  onSelectRegion,
}: {
  regions: PhotoRegion[];
  onSelectRegion: (region: RegionId) => void;
}) {

  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center pt-16 pb-16 px-6">
      {/* Header */}
      <h1 className="text-warm-white text-[48px] font-medium mb-4">Photography</h1>

      {/* Region cards */}
      <div className="flex gap-10 justify-center max-md:flex-col max-md:items-center max-md:gap-6 max-md:w-full">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => onSelectRegion(region.id)}
            className="group relative w-[380px] h-[580px] rounded-[14px] overflow-hidden cursor-pointer text-left flex-shrink-0 max-md:w-[calc(100%-3rem)] max-md:h-auto max-md:aspect-[3/4]"
            style={{
              background: "#141417",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Hero image */}
            {!loadedMap[region.id] && <Spinner />}
            {region.heroPhoto && (
              <Image
                src={getPhotoUrl(region.heroPhoto)}
                alt={region.label}
                fill
                unoptimized
                className="object-cover transition-[opacity,transform] duration-500 group-hover:scale-[1.03]"
                style={{ opacity: loadedMap[region.id] ? 1 : 0 }}
                onLoad={() => setLoadedMap((m) => ({ ...m, [region.id]: true }))}
              />
            )}

            {/* Tint overlay */}
            <div
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.3)" }}
            />

            {/* Bottom gradient */}
            <div
              className="absolute inset-x-0 bottom-0 h-[220px]"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(13,13,15,0.95))",
              }}
            />

            {/* Photo count badge */}
            <div
              className="absolute top-4 right-4 h-6 px-3 flex items-center rounded-full"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="text-muted text-[11px]">{region.photoCount} photos</span>
            </div>

            {/* Text */}
            <div className="absolute bottom-[90px] left-6 right-6">
              <p className="text-warm-white text-[28px] font-medium leading-tight mb-1">
                {region.label}
              </p>
              <p className="text-muted text-[12px]">{region.subLocations}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
