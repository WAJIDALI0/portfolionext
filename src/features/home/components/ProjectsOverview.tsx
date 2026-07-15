"use client";

import { motion } from "framer-motion";
import { FadeUp } from "@/components/animations/fade-up";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, Code, Globe, FileText, Image, PenTool } from "lucide-react";
import { siteConfig } from "@/config/site";

const getProjectIcon = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes('photo')) return Image;
  if (lower.includes('pdf')) return FileText;
  if (lower.includes('omni') || lower.includes('ai')) return PenTool;
  if (lower.includes('resume')) return FileText;
  return Globe;
};

export function ProjectsOverview() {
  return (
    <section id="projects" className="container mx-auto py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <FadeUp delay={0.1}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Featured Work
            </h2>
            <p className="mt-4 text-muted-foreground md:text-xl leading-relaxed">
              Explore a selection of my scalable MERN applications, AI-driven tools, and robust system solutions.
            </p>
          </div>
          <Link href={siteConfig.links.github} target="_blank">
            <Button variant="outline" className="rounded-full px-6 py-6 font-medium shadow-sm">
              View Github <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </FadeUp>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {siteConfig.projects.map((project, idx) => {
          const Icon = getProjectIcon(project.title);
          return (
            <FadeUp delay={0.2 + idx * 0.1} key={idx}>
              <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col">
                {/* Icon Badge */}
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-xl font-bold tracking-tight text-foreground">{project.title}</h3>
                <p className="mb-6 text-muted-foreground leading-relaxed flex-1">
                  A high-performance application built to solve complex workflow challenges with elegant architecture.
                </p>

                {/* Action Link */}
                <div className="pt-4 mt-auto">
                  {project.link.startsWith("http") ? (
                    <Link href={project.link} target="_blank" rel="noreferrer" className="flex items-center text-sm font-semibold text-primary transition-all group-hover:gap-2">
                      View Project <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  ) : (
                    <Link href={`/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center text-sm font-semibold text-primary transition-all group-hover:gap-2">
                      Read Case Study <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              </div>
            </FadeUp>
          );
        })}

        {/* Dynamic MDX ResumeIQ Route */}
        <FadeUp delay={0.5}>
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col">
            {/* Icon Badge */}
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
              <FileText className="h-6 w-6" />
            </div>

            {/* Content */}
            <h3 className="mb-2 text-xl font-bold tracking-tight text-foreground">ResumeIQ</h3>
            <p className="mb-6 text-muted-foreground leading-relaxed flex-1">
              An automated resume processing and optimization platform (MDX Showcase).
            </p>

            {/* Action Link */}
            <div className="pt-4 mt-auto">
              <Link href="/projects/resumeiq" className="flex items-center text-sm font-semibold text-primary transition-all group-hover:gap-2">
                Read Case Study <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
