'use client';

import { useMediaQuery } from "@chakra-ui/react";
import HeroFullWidth from "./HeroFullWidth/HeroFullWidth";
import HeroCompact from "./HeroCompact/HeroCompact";
import { useEffect, useState } from "react";
import "@/styles/global.css";

const HeroSection = () => {
  const [isClient, setIsClient] = useState(false);
  const [isCompact] = useMediaQuery(
    ["(max-width: 900px)", "(orientation: portrait)"],
    { ssr: false }
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return isCompact ? <HeroCompact /> : <HeroFullWidth />;
};

export default HeroSection;
