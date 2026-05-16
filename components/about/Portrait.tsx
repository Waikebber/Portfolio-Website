"use client";

import Image from "next/image";
import { useState } from "react";
import Spinner from "@/components/Spinner";

export default function Portrait({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-[32.5rem] rounded-[0.5rem] overflow-hidden bg-surface max-md:h-auto max-md:aspect-[4/5] max-md:rounded-[0.75rem]">
      {!loaded && <Spinner />}
      <Image
        src={src}
        alt="Kai Webber"
        fill
        className={`object-cover transition-opacity duration-300 max-md:object-top ${loaded ? "opacity-100" : "opacity-0"}`}
        priority
        onLoad={() => setLoaded(true)}
      />
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none hidden max-md:block"
        style={{
          height: "40%",
          background: "linear-gradient(to bottom, transparent 60%, #0d0d0f)",
        }}
      />
    </div>
  );
}
