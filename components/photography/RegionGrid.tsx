"use client";

import Image from "next/image";
import { useState } from "react";
import { getPhotoUrl } from "@/lib/storage";
import Spinner from "@/components/Spinner";
import type { Photo, RegionId } from "@/types";

function PhotoCard({
  photo,
  onClick,
}: {
  photo: Photo;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      onClick={onClick}
      className="group relative w-full rounded-[8px] overflow-hidden cursor-pointer block text-left"
      style={{ background: "#0f1e22", minHeight: loaded ? undefined : 180 }}
    >
      {!loaded && <Spinner />}
      <Image
        src={getPhotoUrl(photo.filename)}
        alt={photo.location}
        width={560}
        height={374}
        style={{ width: "100%", height: "auto", display: "block", opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }}
        onLoad={() => setLoaded(true)}
      />

      {/* Bottom gradient */}
      <div
        className="absolute inset-x-0 bottom-0 h-[60px] pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.75))",
        }}
      />

      {/* Caption */}
      <p className="absolute bottom-[10px] left-[10px] text-[#cccccc] text-[10px] leading-none pointer-events-none">
        {photo.location}
      </p>

      {/* Hover teal border */}
      <div
        className="absolute inset-0 rounded-[8px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ border: "2px solid #61c1d8" }}
      />
    </button>
  );
}

export default function RegionGrid({
  region,
  photos,
  onBack,
  onSelectPhoto,
}: {
  region: RegionId;
  photos: Photo[];
  onBack: () => void;
  onSelectPhoto: (index: number) => void;
}) {
  const regionLabel = region.charAt(0).toUpperCase() + region.slice(1);

  return (
    <div className="min-h-[calc(100vh-64px)] px-12 pt-6 pb-16">
      {/* Breadcrumb */}
      <button
        onClick={onBack}
        className="text-muted text-[12px] hover:text-warm-white transition-colors cursor-pointer mb-6 block"
      >
        ← All regions
      </button>

      {/* Header */}
      <h1 className="text-warm-white text-[48px] font-medium leading-tight mb-2">
        {regionLabel}
      </h1>
      <p className="text-muted text-[14px] mb-8">{photos.length} photos</p>

      {/* Masonry grid */}
      <div className="flex gap-4 items-start">
        {[0, 1, 2].map((col) => (
          <div key={col} className="flex-1 flex flex-col gap-4">
            {photos
              .map((photo, i) => ({ photo, i }))
              .filter(({ i }) => i % 3 === col)
              .map(({ photo, i }) => (
                <PhotoCard key={photo.id} photo={photo} onClick={() => onSelectPhoto(i)} />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
