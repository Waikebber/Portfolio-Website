'use client';

import { ColorModeProvider } from "@/components/ui/color-mode";
import { Provider } from "@/components/ui/provider";
import HeroSection from "@/components/main/HeroSection/HeroSection";
import Skills from "@/components/main/Skills/Skillls";
import Resume from "@/components/main/Resume/Resume";
import Photography from "@/components/main/Photography/Photography";
import Footer from "@/components/main/Footer/Footer";
// import NavBar from "./components/NavBar";
// import Projects from "@/components/main/Projects";
// import ContactForm from "@/components/main/ContactForm";

import HeroToProjBuffer from "@/components/buffers/HeroToProjBuffer";
import ResumeToPhotoBuffer from "@/components/buffers/ResumeToPhotoBuffer";

export default function Home() {
  return (
    <ColorModeProvider>
      <Provider>
        <HeroSection />
        <HeroToProjBuffer />
        <Skills />
        <Resume />
        <ResumeToPhotoBuffer />
        <Photography />
        <Footer />
      </Provider>
    </ColorModeProvider>
  );
}
