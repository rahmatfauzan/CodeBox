"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { Menu, X, Code2, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import ScrollTop from "@/components/ui/scroll-top";
import { DashboardSidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

export default function DashboardLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebar-open");
    if (saved !== null) {
      setIsSidebarOpen(saved === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem("sidebar-open", String(newState));
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950/50">
      {/* Sidebar - Sticky */}
      <aside
        className={cn(
          "sticky top-0 h-screen transition-all duration-300 ease-in-out flex-shrink-0 hidden md:block",
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        <DashboardSidebar user={user} isCollapsed={!isSidebarOpen} />
      </aside>

      {/* Mobile Sidebar - Fixed Overlay */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen z-40 transition-transform duration-300 ease-in-out md:hidden w-64",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <DashboardSidebar user={user} isCollapsed={false} />
      </aside>

      {/* Toggle Button - Desktop Only */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "hidden md:flex fixed top-26 z-50 h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all hover:scale-110",
          isSidebarOpen ? "left-[248px]" : "left-[48px]"
        )}
      >
        {isSidebarOpen ? (
          <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-30 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content - No extra wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Sticky */}
        <header className="sticky top-0 z-20 h-16 border-b bg-white/95 dark:bg-slate-950/95 backdrop-blur-md flex items-center justify-between px-4 md:px-6 shadow-sm flex-shrink-0">
          {/* Left: Logo (Mobile) */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="md:hidden flex items-center gap-2 font-bold text-lg group"
            >
              <div className="p-1 bg-blue-600 rounded-lg group-hover:rotate-3 transition-transform">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-slate-900 dark:text-white">
                Code<span className="text-blue-600">Box</span>
              </span>
            </Link>

            {/* Desktop: Page Title */}
            <h2 className="hidden md:block text-lg font-semibold text-slate-900 dark:text-white">
              Dashboard
            </h2>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <ModeToggle />

            {/* Mobile Toggle Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className="md:hidden border-slate-200 dark:border-slate-800 h-9 w-9"
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              ) : (
                <Menu className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              )}
            </Button>
          </div>
        </header>

        {/* Content Area - Langsung di bawah header */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>

      <ScrollTop />
    </div>
  );
}
