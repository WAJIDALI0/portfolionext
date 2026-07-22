"use client";

import { motion } from "framer-motion";
import { FadeUp } from "@/components/animations/fade-up";

const skillCategories = [
  {
    name: "Frontend",
    skills: [
      { name: "React / Next.js", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 92 },
      { name: "Framer Motion", level: 80 },
    ],
  },
  {
    name: "Backend",
    skills: [
      { name: "Node.js / Express", level: 90 },
      { name: "REST APIs", level: 92 },
      { name: "PostgreSQL / Supabase", level: 82 },
      { name: "MongoDB", level: 85 },
    ],
  },
  {
    name: "DevOps & Tools",
    skills: [
      { name: "Git / GitHub", level: 90 },
      { name: "Docker", level: 70 },
      { name: "Linux / Server Admin", level: 85 },
      { name: "CI/CD (GitHub Actions)", level: 75 },
    ],
  },
  {
    name: "AI & Emerging",
    skills: [
      { name: "OpenAI / LLM APIs", level: 80 },
      { name: "AI Agents (Cursor, Antigravity)", level: 85 },
      { name: "Vibe Coding (Lovable, CodeX)", level: 78 },
      { name: "n8n Automation", level: 72 },
    ],
  },
];

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium">
        <span className="text-foreground">{name}</span>
        <span className="text-muted-foreground">{level}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <motion.div
          className="h-full rounded-full bg-foreground"
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="relative container mx-auto py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/50"
    >
      <FadeUp delay={0.1}>
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6 text-foreground">
            Technical Skills
          </h2>
          <p className="text-muted-foreground md:text-xl leading-relaxed">
            A decade of hands-on experience across the full stack — from designing
            scalable architectures to deploying on production servers.
          </p>
        </div>
      </FadeUp>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {skillCategories.map((category, catIdx) => (
          <FadeUp key={category.name} delay={0.15 + catIdx * 0.1}>
            <div className="group flex flex-col h-full bg-card rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg dark:border dark:border-white/10 dark:hover:border-white/20">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
                {category.name}
              </h3>
              <div className="space-y-5 flex-1">
                {category.skills.map((skill, skillIdx) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    delay={0.2 + catIdx * 0.1 + skillIdx * 0.05}
                  />
                ))}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
