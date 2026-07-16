import { HeroSection } from "@/features/home/components/HeroSection";
import { AboutSection } from "@/features/home/components/AboutSection";
import { SkillsSection } from "@/features/home/components/SkillsSection";
import { ExperienceSection } from "@/features/home/components/ExperienceSection";
import { ProjectsOverview } from "@/features/home/components/ProjectsOverview";
import { ContactSection } from "@/features/home/components/ContactSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsOverview />
      <ContactSection />
    </div>
  );
}
