import { getProjectBySlug } from "@/lib/mdx";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectPage({ params }: Props) {
  const resolvedParams = await params;
  
  let project;
  try {
    project = await getProjectBySlug(resolvedParams.slug);
  } catch (error) {
    // If the MDX file doesn't exist, return a 404 instead of throwing a 500 Server Error
    notFound();
  }

  const { frontmatter, content } = project;
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-70"></div>
      
      <article className="prose prose-invert max-w-none p-10 mx-auto">
        <div className="mb-12 border-b border-border/40 pb-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 mb-4">
            {frontmatter.title}
          </h1>
          <div className="flex items-center space-x-4 text-muted-foreground text-sm font-medium">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">{frontmatter.date || "2026"}</span>
          </div>
        </div>
        {content}
      </article>
    </div>
  );
}
