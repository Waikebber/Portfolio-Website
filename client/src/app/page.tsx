'use client';

import { ColorModeProvider } from "@/components/ui/color-mode";
import { Provider } from "@/components/ui/provider";
import HeroSection from "@/components/main/HeroSection/HeroSection";
// import NavBar from "./components/NavBar";
// import Projects from "@/components/main/Projects";
// import Skills from "@/components/main/Skills";
// import Resume from "@/components/main/Resume";
// import Photography from "@/components/main/Photography";
// import ContactForm from "@/components/main/ContactForm";
// import Footer from "@/components/main/Footer";

export default function Home() {
  return (
    <ColorModeProvider>
      <Provider>
        <HeroSection />
        {/* Add <Projects />, <Skills /> here when ready */}
      </Provider>
    </ColorModeProvider>
  );
}
