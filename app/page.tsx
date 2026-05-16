import Nav from "@/components/Nav";
import SectionWrapper from "@/components/SectionWrapper";
import HeroSection from "@/components/sections/HeroSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth max-md:h-auto max-md:overflow-visible max-md:snap-none">
        <SectionWrapper id="hero">
          <HeroSection />
        </SectionWrapper>

        <SectionWrapper id="experience">
          <ExperienceSection />
        </SectionWrapper>

        <SectionWrapper id="projects">
          <ProjectsSection />
        </SectionWrapper>

        <SectionWrapper id="skills">
          <SkillsSection />
        </SectionWrapper>

        <SectionWrapper id="contact">
          <ContactSection />
        </SectionWrapper>
      </main>
    </>
  );
}
