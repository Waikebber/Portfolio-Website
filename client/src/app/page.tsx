'use client';

import { ColorModeProvider } from "@/components/ui/color-mode";
import { Provider } from "@/components/ui/provider";
import HeroSection from "@/components/main/HeroSection/HeroSection";
import Navigation from "@/components/main/Navigation/Navigation";
import Experience from "@/components/main/Experience/Experience";
import Projects from "@/components/main/Proj/Projects";
import Skills from "@/components/main/Skills/Skillls";
import Resume from "@/components/main/Resume/Resume";
import Photography from "@/components/main/Photography/Photography";
import ContactForm from "@/components/main/ContactForm/ContactForm";
import Footer from "@/components/main/Footer/Footer";

import HeroToProjBuffer from "@/components/buffers/HeroToProjBuffer";
import ProjToSkillsBuffer from "@/components/buffers/ProjToSkillsBuffer";
import ResumeToPhotoBuffer from "@/components/buffers/ResumeToPhotoBuffer";
import PhotoToContactBuffer from "@/components/buffers/PhotoToContactBuffer";

export default function Home() {
  return (
    <ColorModeProvider>
      <Provider>
        <HeroSection />
        <Navigation />
        <HeroToProjBuffer />
        <Experience />
        <Projects />
        <ProjToSkillsBuffer />
        <Skills />
        <Resume />
        <ResumeToPhotoBuffer />
        <Photography />
        <PhotoToContactBuffer />
        <ContactForm />
        <Footer />
      </Provider>
    </ColorModeProvider>
  );
}
