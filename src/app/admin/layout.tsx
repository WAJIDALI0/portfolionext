"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, LogOut, ArrowLeft, MessageCircle, ShieldAlert, Menu, X } from "lucide-react";
import { logout } from "@/app/login/actions";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsMobileMenuOpen(false);

  const NavLinks = () => (
    <>
      <Link
        href="/admin/dashboard"
        onClick={closeMenu}
        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${pathname === "/admin/dashboard" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
      >
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </Link>
      <Link
        href="/admin/contacts"
        onClick={closeMenu}
        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${pathname === "/admin/contacts" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
      >
        <Users className="h-4 w-4" />
        Contact Submissions
      </Link>
      <Link
        href="/admin/chat"
        onClick={closeMenu}
        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${pathname === "/admin/chat" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
      >
        <MessageCircle className="h-4 w-4" />
        Live Chat
      </Link>
      <Link
        href="/admin/setup-2fa"
        onClick={closeMenu}
        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${pathname === "/admin/setup-2fa" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
      >
        <ShieldAlert className="h-4 w-4" />
        Setup 2FA
      </Link>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-border/50 bg-card flex-col hidden md:flex">
        <div className="p-6 border-b border-border/50">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            Admin Panel
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavLinks />
        </nav>

        <div className="p-4 border-t border-border/50 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={closeMenu} />
          <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border/50 flex flex-col shadow-xl">
            <div className="p-6 border-b border-border/50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                Admin Panel
              </h2>
              <button onClick={closeMenu} className="p-1 rounded-md text-muted-foreground hover:bg-accent">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <NavLinks />
            </nav>

            <div className="p-4 border-t border-border/50 space-y-2 bg-card">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Site
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border/50 bg-card">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 -ml-1 text-muted-foreground hover:text-foreground">
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              Admin
            </h2>
          </div>
          <form action={logout}>
            <button type="submit" className="p-2 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
