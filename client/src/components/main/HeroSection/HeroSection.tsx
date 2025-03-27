'use client';

import { useEffect, useState } from "react";
import HeroFullWidth from "./HeroFullWidth/HeroFullWidth";
import HeroCompact from "./HeroCompact/HeroCompact";
import "@/styles/global.css";

const HeroSection = () => {
  const [isClient, setIsClient] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const match = window.matchMedia("(max-width: 900px), (orientation: portrait)");
    const update = () => setIsCompact(match.matches);
    update();

    match.addEventListener("change", update);
    return () => match.removeEventListener("change", update);
  }, []);

  if (!isClient) return null;

  return isCompact ? <HeroCompact /> : <HeroFullWidth />;
};

export default HeroSection;
