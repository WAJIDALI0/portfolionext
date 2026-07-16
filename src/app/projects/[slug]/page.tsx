import { getProjectBySlug, getAllProjectSlugs } from "@/lib/mdx";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Code, ExternalLink, Calendar } from "lucide-react";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = await getProjectBySlug(slug);
    return {
      title: frontmatter.title,
      description: frontmatter.description,
    };
  } catch {
    return { title: "Project Not Found" };
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  let project;
  try {
    project = await getProjectBySlug(slug);
  } catch {
    notFound();
  }

  const { frontmatter, content } = project;

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Back link */}
        <Link
          href="/#projects"
          className="mb-12 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        {/* Header */}
        <header className="mb-16 border-b border-border/50 pb-12">
          <div className="flex flex-wrap gap-2 mb-6">
            {frontmatter.tech?.map((t) => (
              <span
                key={t}
                className="rounded-full bg-accent border border-border px-3 py-1 text-xs font-semibold text-foreground/80"
              >
                {t}
              </span>
            ))}
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground mb-6 leading-tight">
            {frontmatter.title}
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            {frontmatter.description}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{frontmatter.date}</span>
            </div>
            <div className="flex gap-3">
              {frontmatter.github && frontmatter.github !== "" && (
                <a
                  href={frontmatter.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground/80 transition-all hover:bg-accent hover:text-foreground hover:shadow-sm"
                >
                  <Code className="h-4 w-4" />
                  Source Code
                </a>
              )}
              {frontmatter.live && frontmatter.live !== "" && (
                <a
                  href={frontmatter.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-all hover:bg-foreground/90 hover:shadow-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </header>

        {/* MDX Content */}
        <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-code:bg-accent prose-code:text-foreground prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-card prose-pre:border prose-pre:border-border prose-pre:rounded-2xl prose-strong:text-foreground prose-a:text-foreground prose-a:underline-offset-4 prose-blockquote:border-l-foreground">
          {content}
        </article>

        {/* Footer CTA */}
        <div className="mt-20 pt-12 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-lg font-bold text-foreground">Interested in working together?</p>
            <p className="text-muted-foreground text-sm">Let's build something great.</p>
          </div>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:bg-foreground/90 shadow-sm"
          >
            Get in touch
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
