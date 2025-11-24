"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Menu, X, Code2, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import ScrollTop from "@/components/ui/scroll-top";
import { DashboardSidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

// Custom hook untuk sidebar state dengan localStorage
function useSidebarState(defaultOpen = true) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Hydrate dari localStorage hanya di client
    const saved = localStorage.getItem("sidebar-open");
    if (saved !== null) {
      setIsOpen(saved === "true");
    }
    setIsHydrated(true);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebar-open", String(newState));
      return newState;
    });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem("sidebar-open", "false");
  }, []);

  return { isOpen, toggle, close, isHydrated };
}

// Custom hook untuk page title berdasarkan pathname
function usePageTitle() {
  const pathname = usePathname();

  const titles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/documents": "Documents",
    "/dashboard/snippets": "Snippets",
    "/dashboard/settings": "Settings",
    "/dashboard/profile": "Profile",
  };

  // Check exact match first, then prefix match
  return titles[pathname] || 
    Object.entries(titles).find(([path]) => pathname.startsWith(path))?.[1] || 
    "Dashboard";
}

export default function DashboardLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const { isOpen: isSidebarOpen, toggle: toggleSidebar, close: closeSidebar, isHydrated } = useSidebarState(true);
  const pageTitle = usePageTitle();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Close mobile sidebar on route change
  useEffect(() => {
    // Only close on mobile
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  }, [pathname, closeSidebar]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  // Render skeleton saat belum hydrated untuk menghindari layout shift
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950/50">
        {/* Sidebar Skeleton */}
        <aside className="sticky top-0 h-screen w-64 flex-shrink-0 hidden md:block bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800" />
        
        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-20 h-16 border-b bg-white dark:bg-slate-950 flex items-center px-4 md:px-6">
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </header>
          <main className="flex-1 p-4 md:p-8">
            <div className="space-y-4">
              <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950/50">
      {/* Sidebar - Desktop (Sticky) */}
      <aside
        className={cn(
          "sticky top-0 h-screen transition-all duration-300 ease-in-out flex-shrink-0 hidden md:block will-change-[width]",
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        <DashboardSidebar user={user} isCollapsed={!isSidebarOpen} />
      </aside>

      {/* Sidebar - Mobile (Fixed Overlay) */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen z-40 transition-transform duration-300 ease-in-out md:hidden w-64 will-change-transform",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <DashboardSidebar user={user} isCollapsed={false} />
      </aside>

      {/* Toggle Button - Desktop Only */}
      <button
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        className={cn(
          "hidden md:flex fixed top-26 z-50 h-8 w-8 items-center justify-center rounded-full",
          "bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800",
          "shadow-lg hover:shadow-xl transition-all hover:scale-110",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
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
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Sticky */}
        <header className="sticky top-0 z-20 h-16 border-b bg-white/95 dark:bg-slate-950/95 backdrop-blur-md flex items-center justify-between px-4 md:px-6 shadow-sm flex-shrink-0">
          {/* Left: Logo (Mobile) / Page Title (Desktop) */}
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

            {/* Desktop: Dynamic Page Title */}
            <h2 className="hidden md:block text-lg font-semibold text-slate-900 dark:text-white">
              {pageTitle}
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
              aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
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

        {/* Content Area */}
        <main 
          className={cn(
            "flex-1 p-4 md:p-8",
            isPending && "opacity-70 pointer-events-none"
          )}
        >
          {children}
        </main>
      </div>

      <ScrollTop />
    </div>
  );
}