'use client';
import { useMediaQuery } from "@chakra-ui/react";
import HeroFullWidth from "./HeroFullWidth/HeroFullWidth";
import HeroCompact from "./HeroCompact/HeroCompact";
import "@/styles/global.css";

const HeroSection = () => {
  const [isCompact] = useMediaQuery(
    ["(max-width: 800px)", "(orientation: portrait)"],
    { ssr: false }
  );

  return isCompact ? <HeroCompact /> : <HeroFullWidth />;
};

export default HeroSection;
