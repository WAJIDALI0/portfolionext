import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';

const rootDir = process.cwd();

export async function getProjectBySlug(slug: string) {
  const filePath = path.join(rootDir, 'content/projects', `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const { frontmatter, content } = await compileMDX<{ title: string, date: string }>({
    source: fileContent,
    options: { parseFrontmatter: true },
  });

  return { frontmatter, content };
}
