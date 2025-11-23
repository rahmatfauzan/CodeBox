"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  FileCode,
  Compass,
  Bookmark,
  Settings,
  PlusCircle,
  Code2,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthActions } from "@/lib/hooks/use-auth-actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type MenuItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const sidebarSections: MenuSection[] = [
  {
    title: "Discovery",
    items: [
      { title: "Home", href: "/dashboard", icon: LayoutDashboard },
      { title: "Explore", href: "/explore", icon: Compass },
    ],
  },
  {
    title: "My Space",
    items: [
      { title: "My Snippets", href: "/dashboard/my-snippets", icon: FileCode },
    ],
  },
  {
    title: "Account",
    items: [{ title: "Settings", href: "/dashboard/settings", icon: Settings }],
  },
];

interface DashboardSidebarProps {
  user: User;
  isCollapsed?: boolean;
}

export function DashboardSidebar({
  user,
  isCollapsed = false,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuthActions();

  const initials = user?.email?.charAt(0).toUpperCase() || "U";
  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name || user?.email?.split("@")[0];
  const email = user?.email;

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed && "items-center"
        )}
      >
        {/* 1. HEADER: LOGO */}
        <div
          className={cn(
            "h-16 flex items-center border-b border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out overflow-hidden",
            isCollapsed ? "justify-center px-2" : "px-6"
          )}
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-bold text-xl group"
          >
            <div className="p-1.5 bg-blue-600 rounded-lg group-hover:rotate-3 transition-transform shadow-sm flex-shrink-0">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span
              className={cn(
                "text-slate-900 dark:text-white tracking-tight whitespace-nowrap transition-all duration-300 ease-in-out",
                isCollapsed
                  ? "opacity-0 w-0 translate-x-4"
                  : "opacity-100 w-auto translate-x-0"
              )}
            >
              Code<span className="text-blue-600">Box</span>
            </span>
          </Link>
        </div>

        {/* 2. USER PROFILE */}
        <div
          className={cn(
            "border-b border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out overflow-hidden",
            isCollapsed ? "p-2" : "p-4"
          )}
        >
          {!isCollapsed ? (
            <Link href="/settings">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer group">
                <Avatar className="h-9 w-9 border border-slate-100 dark:border-slate-800 flex-shrink-0">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "flex-1 min-w-0 transition-all duration-300 ease-in-out",
                    isCollapsed
                      ? "opacity-0 w-0 translate-x-4"
                      : "opacity-100 w-auto translate-x-0"
                  )}
                >
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {fullName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{email}</p>
                </div>
                <Settings
                  className={cn(
                    "h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-all duration-300 ease-in-out flex-shrink-0",
                    isCollapsed
                      ? "opacity-0 w-0 translate-x-4"
                      : "opacity-100 w-auto translate-x-0"
                  )}
                />
              </div>
            </Link>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/settings">
                  <Avatar className="h-10 w-10 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-semibold">{fullName}</p>
                <p className="text-xs text-slate-500">{email}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* 3. MENU ITEMS */}
        <div
          className={cn(
            "flex-1 py-6 overflow-y-auto overflow-x-hidden space-y-6 scrollbar-hide transition-all duration-300 ease-in-out",
            isCollapsed ? "px-2" : "px-4"
          )}
        >
          {sidebarSections.map((section) => (
            <div key={section.title}>
              <div
                className={cn(
                  "px-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider transition-all duration-300 ease-in-out",
                  isCollapsed
                    ? "opacity-0 h-0 mb-0 translate-y-2"
                    : "opacity-100 h-auto mb-2 translate-y-0"
                )}
              >
                {section.title}
              </div>
              <div
                className={cn(
                  "space-y-1",
                  isCollapsed && "flex flex-col items-center"
                )}
              >
                {section.items.map((item) => (
                  <SidebarLink
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 4. BOTTOM BUTTONS */}
        <div
          className={cn(
            "border-t border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out",
            isCollapsed ? "p-2 space-y-2" : "p-4 space-y-2"
          )}
        >
          {!isCollapsed ? (
            <>
              <Link
                href="/dashboard/my-snippets/create-document"
                className="block"
              >
                <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 h-10 transition-all overflow-hidden group">
                  <PlusCircle className="h-4 w-4 flex-shrink-0" />
                  <span
                    className={cn(
                      "transition-all duration-300 ease-in-out whitespace-nowrap",
                      isCollapsed
                        ? "opacity-0 w-0 translate-x-4"
                        : "opacity-100 w-auto translate-x-0"
                    )}
                  >
                    Buat Snippet
                  </span>
                </Button>
              </Link>
              <Button
                onClick={() => logout()}
                variant="outline"
                className="w-full gap-2 h-10 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-300 dark:hover:text-red-400 dark:hover:bg-red-900/20 dark:hover:border-red-800 transition-all overflow-hidden group"
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                <span
                  className={cn(
                    "transition-all duration-300 ease-in-out whitespace-nowrap",
                    isCollapsed
                      ? "opacity-0 w-0 translate-x-4"
                      : "opacity-100 w-auto translate-x-0"
                  )}
                >
                  Log out
                </span>
              </Button>
            </>
          ) : (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/dashboard/my-snippets/create-document"
                    className="block"
                  >
                    <Button
                      size="icon"
                      className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
                    >
                      <PlusCircle className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Buat Snippet</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => logout()}
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-300 transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Log out</TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

// Helper Link with Border Indicator & Smooth Animation
function SidebarLink({
  item,
  pathname,
  isCollapsed,
}: {
  item: MenuItem;
  pathname: string;
  isCollapsed: boolean;
}) {
  const isActive =
    pathname === item.href ||
    (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

  const linkContent = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
        isActive
          ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
          : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
        isCollapsed ? "w-10 h-10 justify-center p-0" : "px-3 py-2 gap-3"
      )}
    >
      {/* Left border indicator untuk active state */}
      {isActive && (
        <div
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 bg-blue-600 dark:bg-blue-400 rounded-r-full transition-all duration-200",
            isCollapsed ? "w-1 h-6" : "w-1 h-8"
          )}
        />
      )}

      {/* Icon */}
      <item.icon
        className={cn(
          "h-4 w-4 flex-shrink-0 transition-colors",
          isActive
            ? "text-blue-700 dark:text-blue-300"
            : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
        )}
      />

      {/* Text label dengan translate effect */}
      <span
        className={cn(
          "transition-all duration-300 ease-in-out whitespace-nowrap",
          isCollapsed
            ? "opacity-0 w-0 translate-x-4"
            : "opacity-100 w-auto translate-x-0"
        )}
      >
        {item.title}
      </span>
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right">{item.title}</TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}
