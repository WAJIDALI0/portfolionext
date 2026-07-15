import { HeroSection } from "@/features/home/components/HeroSection";
import { AboutSection } from "@/features/home/components/AboutSection";
import { ProjectsOverview } from "@/features/home/components/ProjectsOverview";
import { ContactSection } from "@/features/home/components/ContactSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <AboutSection />
      <ProjectsOverview />
      <ContactSection />
    </div>
  );
}
