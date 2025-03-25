'use client';

import { ColorModeProvider } from "@/components/ui/color-mode";
import { Provider } from "@/components/ui/provider";
import HeroSection from "@/components/main/HeroSection/HeroSection";
import HeroToProjBuffer from "@/components/buffers/HeroToProjBuffer";
import Skills from "@/components/main/Skills/Skillls";
import Resume from "@/components/main/Resume/Resume";
// import NavBar from "./components/NavBar";
// import Projects from "@/components/main/Projects";
// import Photography from "@/components/main/Photography";
// import ContactForm from "@/components/main/ContactForm";
// import Footer from "@/components/main/Footer";

export default function Home() {
  return (
    <ColorModeProvider>
      <Provider>
        <HeroSection />
        <HeroToProjBuffer />
        <Skills />
        <Resume />
      </Provider>
    </ColorModeProvider>
  );
}
