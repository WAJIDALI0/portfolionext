import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        
        {/* Brand & Copyright */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-bold">{siteConfig.name}</h4>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-8">
          <Link href="#about" className="text-sm hover:text-primary transition-colors">About</Link>
          <Link href="#projects" className="text-sm hover:text-primary transition-colors">Projects</Link>
          <Link href="#contact" className="text-sm hover:text-primary transition-colors">Contact</Link>
        </div>

        {/* Social Links */}
        <div className="flex gap-4">
          <a href={siteConfig.links.github} target="_blank" className="text-sm hover:text-primary transition-colors">GitHub</a>
          <a href={siteConfig.links.linkedin} target="_blank" className="text-sm hover:text-primary transition-colors">LinkedIn</a>
          <a href={siteConfig.links.whatsapp} target="_blank" className="text-sm hover:text-primary transition-colors">WhatsApp</a>
        </div>
      </div>
    </footer>
  );
}
