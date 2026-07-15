"use client";

import { motion } from "framer-motion";
import { FadeUp } from "@/components/animations/fade-up";
import { siteConfig } from "@/config/site";
import { Code, Server, Presentation } from "lucide-react";

const getRoleIcon = (role: string) => {
  if (role.includes("Developer")) return <Code className="h-8 w-8 text-primary" />;
  if (role.includes("Architect")) return <Server className="h-8 w-8 text-primary" />;
  return <Presentation className="h-8 w-8 text-primary" />;
};

export function AboutSection() {
  return (
    <section id="about" className="relative container mx-auto py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/50">
      <FadeUp delay={0.1}>
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6 text-foreground">
            Bridging Systems & Software
          </h2>
          <p className="text-muted-foreground md:text-2xl leading-relaxed tracking-tight">
            From Wajid Tech Labs to the classroom, my career is defined by a passion for robust architectures, scalable development, and sharing knowledge.
          </p>
        </div>
      </FadeUp>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {siteConfig.roles.map((role, idx) => (
          <FadeUp delay={0.2 + idx * 0.1} key={idx}>
            <motion.div 
              whileHover={{ y: -5 }}
              className="group flex flex-col h-full bg-card p-8 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg dark:shadow-none dark:border dark:border-white/10 dark:hover:border-white/20"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                {getRoleIcon(role)}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{role}</h3>
              <p className="text-muted-foreground flex-1 leading-relaxed text-sm">
                Driving technical excellence through specialized domain knowledge, ensuring performance, security, and scalability from the ground up.
              </p>
            </motion.div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
