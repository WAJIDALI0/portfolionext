"use client";

import { motion } from "framer-motion";
import { FadeUp } from "@/components/animations/fade-up";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative container mx-auto flex min-h-[90vh] flex-col items-center justify-center py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* SaaS Background Elements */}
      <motion.div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
      
      <div className="absolute inset-0 -z-20 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <FadeUp delay={0.1} className="space-y-8 text-center max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center rounded-full bg-muted/50 border border-border px-6 py-2 text-sm font-semibold text-foreground/80 mb-4 shadow-sm"
        >
          {siteConfig.roles.join("  •  ")}
        </motion.div>
        
        <h1 className="text-5xl font-extrabold tracking-tighter sm:text-7xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-4">
          Hi, I'm {siteConfig.name}
        </h1>
        
        <p className="mx-auto max-w-[800px] text-lg text-muted-foreground sm:text-2xl leading-relaxed tracking-tight">
          {siteConfig.bio}
        </p>
      </FadeUp>

      <FadeUp delay={0.3} className="flex flex-col sm:flex-row gap-6 pt-12">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href="#projects">
            <Button size="lg" className="w-full sm:w-auto px-10 h-14 text-lg font-semibold shadow-lg hover:shadow-primary/20 transition-all">View Projects</Button>
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href="#contact">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-10 h-14 text-lg font-semibold border-border hover:bg-accent transition-all shadow-sm">Contact Me</Button>
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <a href="/Wajid_Ali_Professional_Resume.pdf" target="_blank" download>
            <Button variant="ghost" size="lg" className="w-full sm:w-auto px-8 h-14 text-lg font-semibold hover:bg-accent transition-all">Resume</Button>
          </a>
        </motion.div>
      </FadeUp>
    </section>
  );
}
