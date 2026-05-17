"use client";

import Image from "next/image";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import type { AdminPhoto } from "@/hooks/admin/usePhotos";

interface Props {
  photo: AdminPhoto;
  photoUrl: string;
  onClick: () => void;
  priority?: boolean;
}

export default function PhotoTile({ photo, photoUrl, onClick, priority = false }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      onClick={onClick}
      className="relative w-full aspect-[4/3] rounded-[8px] overflow-hidden group cursor-pointer"
      style={{ background: "#141417" }}
    >
      {!loaded && <Spinner />}
      <Image
        src={photoUrl}
        alt={photo.location}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        unoptimized
        priority={priority}
        className="object-cover group-hover:scale-[1.03] transition-[opacity,transform] duration-300"
        style={{ opacity: loaded ? 1 : 0 }}
        onLoad={() => setLoaded(true)}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "rgba(0,0,0,0.3)" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 px-2.5 py-2"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)" }}
      >
        <p className="text-white text-[11px] truncate">{photo.location}</p>
      </div>
    </button>
  );
}
