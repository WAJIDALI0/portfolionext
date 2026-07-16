"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Skills", href: "/#skills" },
    { name: "Experience", href: "/#experience" },
    { name: "Projects", href: "/#projects" },
    { name: "Contact", href: "/#contact" },
    { name: "Resume", href: "/Wajid_Ali_Professional_Resume.pdf", external: true },
  ];

  const socialLinks = [
    { name: "GitHub", href: siteConfig.links.github },
    { name: "LinkedIn", href: siteConfig.links.linkedin },
    ...(siteConfig.links.whatsapp ? [{ name: "WhatsApp", href: siteConfig.links.whatsapp }] : []),
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <span className="text-xl font-extrabold tracking-tight text-foreground">
              {siteConfig.name}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.name}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col items-center justify-center text-foreground/80 hover:text-foreground transition-colors"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 h-[2px] w-0 bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="group relative flex flex-col items-center justify-center text-foreground/80 hover:text-foreground transition-colors"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 h-[2px] w-0 bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Social & Theme */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-5 text-sm font-medium">
            {socialLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`group relative flex flex-col items-center justify-center transition-colors hover:text-foreground ${link.name === 'WhatsApp' ? 'text-green-600 dark:text-green-400' : 'text-foreground/80'}`}
                >
                  {link.name}
                  <span className="absolute -bottom-1 h-[2px] w-0 bg-current transition-all duration-300 ease-out group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="pl-4 border-l border-border h-6 flex items-center">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <button
            onClick={toggleMenu}
            className="inline-flex items-center justify-center p-2 rounded-md text-foreground/80 hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-background/95 backdrop-blur-xl border-b border-white/10 md:hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <nav>
                <ul className="flex flex-col space-y-1">
                  {navLinks.map((link) => (
                    <li key={link.name}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)}
                          className="block px-3 py-3 text-base font-semibold text-foreground/80 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="block px-3 py-3 text-base font-semibold text-foreground/80 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="border-t border-border pt-4">
                <ul className="flex flex-col space-y-1">
                  {socialLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`block px-3 py-3 text-base font-semibold rounded-md transition-colors ${link.name === 'WhatsApp' ? 'text-green-600 dark:text-green-400 hover:bg-green-500/10' : 'text-foreground/80 hover:bg-accent hover:text-accent-foreground'}`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
