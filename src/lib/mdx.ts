import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";

const rootDir = process.cwd();

export interface ProjectFrontmatter {
  title: string;
  date: string;
  description: string;
  tech?: string[];
  github?: string;
  live?: string;
}

export async function getProjectBySlug(slug: string) {
  const filePath = path.join(rootDir, "content/projects", `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const { frontmatter, content } = await compileMDX<ProjectFrontmatter>({
    source: fileContent,
    options: { parseFrontmatter: true },
  });

  return { frontmatter, content };
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const dir = path.join(rootDir, "content/projects");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
