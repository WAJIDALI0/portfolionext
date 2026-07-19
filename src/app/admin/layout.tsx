import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, LogOut, ArrowLeft, MessageCircle, ShieldAlert } from "lucide-react";
import { logout } from "@/app/login/actions";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/50 bg-card flex flex-col hidden md:flex">
        <div className="p-6 border-b border-border/50">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            Admin Panel
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/contacts"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Users className="h-4 w-4" />
            Contact Submissions
          </Link>
          <Link
            href="/admin/chat"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Live Chat
          </Link>
          <Link
            href="/admin/setup-2fa"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <ShieldAlert className="h-4 w-4" />
            Setup 2FA
          </Link>
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border/50 bg-card">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            Admin
          </h2>
          <form action={logout}>
            <button type="submit" className="p-2 text-red-500 rounded-lg hover:bg-red-500/10">
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
