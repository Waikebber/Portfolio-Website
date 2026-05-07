import Image from "next/image";
import { getPhotoRegions } from "@/lib/data";
import type { RegionId } from "@/types";

function photoSrc(filename: string) {
  return `/assets/photography/${encodeURIComponent(filename)}`;
}

export default function RegionOverview({
  onSelectRegion,
}: {
  onSelectRegion: (region: RegionId) => void;
}) {
  const regions = getPhotoRegions();

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center pt-16 pb-16 px-6">
      {/* Header */}
      <h1 className="text-warm-white text-[48px] font-medium mb-4">Photography</h1>

      {/* Region cards */}
      <div className="flex gap-10 justify-center">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => onSelectRegion(region.id)}
            className="group relative w-[380px] h-[580px] rounded-[14px] overflow-hidden cursor-pointer text-left flex-shrink-0"
            style={{
              background: "#141417",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Hero image */}
            <Image
              src={photoSrc(region.heroPhoto)}
              alt={region.label}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />

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
