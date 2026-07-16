"use client";

import { motion } from "framer-motion";
import { FadeUp } from "@/components/animations/fade-up";
import { Code, Smartphone, GraduationCap } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="relative container mx-auto py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/50">
      <FadeUp delay={0.1}>
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6 text-foreground">
            Architecting Scalable Web & Mobile Software
          </h2>
          <p className="text-muted-foreground md:text-2xl leading-relaxed tracking-tight">
            From high-traffic MERN stack platforms to cross-platform React Native apps, my work is defined by clean code, robust backend architectures, and a passion for technical mentorship.
          </p>
        </div>
      </FadeUp>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Full-Stack Web Developer */}
        <FadeUp delay={0.2}>
          <motion.div 
            whileHover={{ y: -5 }}
            className="group flex flex-col h-full bg-card p-8 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg dark:shadow-none dark:border dark:border-white/10 dark:hover:border-white/20"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <Code className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Full-Stack Web Developer</h3>
            <p className="text-muted-foreground flex-1 leading-relaxed text-sm">
              Designing and deploying scalable MERN-stack web applications using Node.js, Express.js, React.js, and MongoDB. Experienced in optimizing database schemas and building real-time communication features with Socket.io.
            </p>
          </motion.div>
        </FadeUp>

        {/* Card 2: Cross-Platform Mobile Developer */}
        <FadeUp delay={0.3}>
          <motion.div 
            whileHover={{ y: -5 }}
            className="group flex flex-col h-full bg-card p-8 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg dark:shadow-none dark:border dark:border-white/10 dark:hover:border-white/20"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <Smartphone className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Cross-Platform Mobile Developer</h3>
            <p className="text-muted-foreground flex-1 leading-relaxed text-sm">
              Building high-performance iOS and Android mobile applications using React Native and React Navigation. Focused on intuitive user interfaces, cross-platform responsiveness, and seamless REST API integrations.
            </p>
          </motion.div>
        </FadeUp>

        {/* Card 3: Computer Science Educator */}
        <FadeUp delay={0.4}>
          <motion.div 
            whileHover={{ y: -5 }}
            className="group flex flex-col h-full bg-card p-8 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg dark:shadow-none dark:border dark:border-white/10 dark:hover:border-white/20"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Computer Science Educator</h3>
            <p className="text-muted-foreground flex-1 leading-relaxed text-sm">
              Teaching core computer science foundations and practical programming logic at Morning Star Public High School. Dedicated to bridging theoretical concepts with hands-on, real-world software development.
            </p>
          </motion.div>
        </FadeUp>
      </div>
    </section>
  );
}
