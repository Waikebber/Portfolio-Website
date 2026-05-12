"use client";

import Image from "next/image";
import { useState } from "react";
import Spinner from "@/components/Spinner";

export default function Portrait({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-[32.5rem] rounded-[0.5rem] overflow-hidden bg-surface">
      {!loaded && <Spinner />}
      <Image
        src={src}
        alt="Kai Webber"
        fill
        className={`object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        priority
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
