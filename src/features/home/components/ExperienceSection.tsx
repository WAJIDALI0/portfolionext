"use client";

import { motion } from "framer-motion";
import { FadeUp } from "@/components/animations/fade-up";
import { Briefcase, GraduationCap, MapPin, Calendar } from "lucide-react";

const experiences = [
  {
    type: "work",
    role: "Associate Frontend Developer",
    company: "Dexterz Technologies (Pvt.) Ltd.",
    location: "Lahore, Pakistan",
    period: "July 2025",
    description:
      "Fulfilled frontend development responsibilities and successfully collaborated with the broader development team to meet enterprise project milestones.",
    highlights: [
      "Built dynamic, high-performance user interfaces using React.js and modern JavaScript",
      "Collaborated within cross-functional agile development teams to deliver robust software solutions",
      "Optimized frontend components for speed, scalability, and cross-platform responsiveness",
    ],
    tech: ["React.js", "JavaScript (ES6+)", "Tailwind CSS", "Git", "Agile"],
  },
  {
    type: "work",
    role: "MERN Stack Developer",
    company: "CallBackCrew Software House",
    location: "Sahiwal, Pakistan",
    period: "2023 — 2025",
    description:
      "Designed and developed scalable web applications and cross-platform mobile solutions using the MERN stack and React Native for iOS and Android.",
    highlights: [
      "Optimized MongoDB database schemas and indexes for scalability in high-traffic applications",
      "Integrated real-time communication features using Socket.io for enhanced user engagement",
      "Developed and deployed cross-platform mobile applications for iOS and Android using React Native",
    ],
    tech: ["Node.js", "React.js", "React Native", "MongoDB", "Express.js", "Socket.io"],
  },
  {
    type: "work",
    role: "Computer Science Educator",
    company: "Morning Star Public High School",
    location: "Okara, Pakistan",
    period: "2025 — Present",
    description:
      "Teaching Computer Science and science subjects, combining practical programming skills with theoretical foundations for aspiring students.",
    highlights: [
      "Delivering practical, hands-on instruction in modern computer programming and software concepts",
      "Bridging foundational theoretical computer science with real-world technical applications",
      "Mentoring students in analytical problem-solving and structured software development logic",
    ],
    tech: ["Computer Science", "Programming Fundamentals", "Mentorship", "Curriculum Design"],
  },
  {
    type: "education",
    role: "B.Sc. Computer Science (BSCS)",
    company: "Superior College (Affiliated with Gomal University, DI Khan)",
    location: "Pakistan",
    period: "Currently in 8th Semester",
    description:
      "Pursuing a degree in Computer Science with a core focus on advanced software engineering, database optimization, and cross-platform mobile/web architecture.",
    highlights: [
      "Completed Associate Degree Program in IT (ADB-IT) from University of Punjab (2021 — 2023)",
      "Earned Web Development Certification (2025) and CIT in Web & Mobile App Development",
      "Core coursework focused on algorithms, data structures, REST APIs, and DevOps methodologies",
    ],
    tech: ["Data Structures", "Algorithms", "Database Design", "Web & Mobile Architecture", "TypeScript"],
  },
];

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative container mx-auto py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/50"
    >
      <FadeUp delay={0.1}>
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6 text-foreground">
            Experience & Education
          </h2>
          <p className="text-muted-foreground md:text-xl leading-relaxed">
            Delivering scalable web and mobile software solutions with the MERN stack and React Native.
          </p>
        </div>
      </FadeUp>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />

        <div className="space-y-12">
          {experiences.map((exp, idx) => (
            <FadeUp key={idx} delay={0.1 + idx * 0.15}>
              <div className="relative flex gap-8 group">
                {/* Timeline dot */}
                <div className="hidden md:flex flex-col items-center">
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background transition-colors group-hover:border-foreground group-hover:bg-foreground">
                    {exp.type === "work" ? (
                      <Briefcase className="h-5 w-5 text-muted-foreground group-hover:text-background transition-colors" />
                    ) : (
                      <GraduationCap className="h-5 w-5 text-muted-foreground group-hover:text-background transition-colors" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm transition-all duration-300 hover:shadow-lg dark:border dark:border-white/10 dark:hover:border-white/20">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{exp.role}</h3>
                        <p className="text-base font-semibold text-muted-foreground">{exp.company}</p>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-1 text-sm text-muted-foreground shrink-0">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{exp.period}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{exp.location}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-6">{exp.description}</p>

                    <ul className="space-y-2 mb-6">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                          {h}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {exp.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground border border-border"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}