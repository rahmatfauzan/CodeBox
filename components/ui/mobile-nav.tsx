"use client";

import { useState } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { useTheme } from "next-themes";
import {
  Code2,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  Settings,
  LifeBuoy,
  Sun,
  Moon,
  Home,
  Compass,
  FileCode,
  Heart,
  Clock,
  Bookmark,
  Search,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { logoutAction } from "@/lib/actions/auth";

interface NavbarProps {
  user: User | null;
}

export function Navbar({ user }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { setTheme, theme } = useTheme();

  const initials = user?.email?.charAt(0).toUpperCase() || "U";
  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name || user?.email;
  const username = user?.user_metadata?.username || "user";

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Explore", href: "/explore", icon: Compass },
    ...(user
      ? [{ name: "Your Codes", href: "/my-codes", icon: FileCode }]
      : []),
  ];

  const userMenuItems = user
    ? [
        { name: "Favorites", href: "/favorites", icon: Heart },
        { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
        { name: "History", href: "/history", icon: Clock },
      ]
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  // CSS Classes
  const headerClasses = [
    "sticky top-0 z-50 w-full",
    "border-b",
    "bg-white/95 dark:bg-slate-950/95",
    "backdrop-blur",
    "supports-[backdrop-filter]:bg-white/60",
    "dark:supports-[backdrop-filter]:bg-slate-950/60",
  ].join(" ");

  const logoGradientClasses = [
    "p-1.5 rounded-lg shadow-sm",
    "bg-gradient-to-br from-indigo-600 to-purple-600",
    "group-hover:shadow-md group-hover:scale-105",
    "transition-all",
  ].join(" ");

  const navLinkClasses = (isActive = false) =>
    [
      "flex items-center gap-2 px-3 py-2 rounded-lg",
      "text-sm font-medium transition-all",
      isActive
        ? "text-indigo-600 dark:text-indigo-400 bg-slate-100 dark:bg-slate-900"
        : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900",
    ].join(" ");

  const iconButtonClasses = [
    "text-slate-500",
    "hover:text-indigo-600 hover:bg-slate-100",
    "dark:hover:bg-slate-900",
    "rounded-full",
  ].join(" ");

  const registerButtonClasses = [
    "bg-gradient-to-r from-indigo-600 to-purple-600",
    "hover:from-indigo-700 hover:to-purple-700",
    "text-white font-bold",
    "shadow-lg shadow-indigo-500/30",
    "hover:shadow-xl hover:shadow-indigo-500/40",
    "transition-all",
  ].join(" ");

  const mobileMenuClasses = [
    "md:hidden absolute top-16 left-0 w-full",
    "border-b border-slate-200 dark:border-slate-800",
    "bg-white dark:bg-slate-950 shadow-xl z-50",
    "animate-in slide-in-from-top-2 duration-200",
    "max-h-[calc(100vh-4rem)] overflow-y-auto",
  ].join(" ");

  const mobileMenuItemClasses = [
    "flex items-center gap-3 p-3 rounded-lg",
    "text-sm font-medium",
    "text-slate-700 dark:text-slate-200",
    "hover:bg-slate-100 dark:hover:bg-slate-900",
    "transition-colors",
  ].join(" ");

  const userCardClasses = [
    "flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer",
    "bg-gradient-to-br from-slate-50 to-indigo-50",
    "dark:from-slate-900 dark:to-indigo-950/30",
    "border border-slate-200 dark:border-slate-800",
    "hover:border-indigo-300 dark:hover:border-indigo-800",
    "transition-colors",
  ].join(" ");

  const avatarClasses = [
    "h-12 w-12",
    "border-2 border-white dark:border-slate-800",
    "shadow-sm",
  ].join(" ");

  const avatarFallbackClasses = [
    "bg-gradient-to-br from-indigo-500 to-purple-600",
    "text-white font-bold",
  ].join(" ");

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        {/* --- 1. LOGO --- */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className={logoGradientClasses}>
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white hidden sm:inline">
            Code<span className="text-indigo-600">Box</span>
          </span>
        </Link>

        {/* --- 2. DESKTOP NAVIGATION --- */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium flex-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClasses()}>
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* --- 3. ACTIONS KANAN (Desktop) --- */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            className={iconButtonClasses}
          >
            <Search className="h-[1.2rem] w-[1.2rem]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={iconButtonClasses}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full ring-2 ring-slate-200 dark:ring-slate-800 hover:ring-indigo-500 transition-all"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={avatarUrl} alt={fullName} />
                    <AvatarFallback className={avatarFallbackClasses}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none truncate">
                      {fullName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`/u/${username}`}>
                      <UserIcon className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  {userMenuItems.map((item) => (
                    <DropdownMenuItem
                      key={item.href}
                      asChild
                      className="cursor-pointer"
                    >
                      <Link href={item.href}>
                        <item.icon className="mr-2 h-4 w-4" /> {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/help">
                    <LifeBuoy className="mr-2 h-4 w-4" /> Help & Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
                  onClick={async () => await logoutAction()}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button className={registerButtonClasses}>Daftar</Button>
              </Link>
            </div>
          )}
        </div>

        {/* --- 4. MOBILE ACTIONS --- */}
        <div className="flex items-center gap-1 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            className="text-slate-500 hover:text-indigo-600"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-slate-500 hover:text-indigo-600"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-700 dark:text-slate-300"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* --- 5. SEARCH MODAL --- */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Search className="h-5 w-5 text-indigo-600" />
              Search CodeBox
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search codes, users, tags, languages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 h-12 text-base bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">
                      Enter
                    </kbd>
                    <span>to search</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">
                      Esc
                    </kbd>
                    <span>to close</span>
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "React",
                    "Python",
                    "JavaScript",
                    "API",
                    "Authentication",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSearchQuery(tag);
                        handleSearch(new Event("submit") as any);
                      }}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- 6. MOBILE MENU DRAWER --- */}
      {isMobileMenuOpen && (
        <div className={mobileMenuClasses}>
          <div className="p-4 space-y-4">
            {/* Main Navigation */}
            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Menu
              </p>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={mobileMenuItemClasses}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 text-indigo-600" />
                  {item.name}
                </Link>
              ))}
            </div>

            {/* User Section */}
            {user && userMenuItems.length > 0 && (
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <p className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  My Content
                </p>
                <div className="space-y-1">
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={mobileMenuItemClasses}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5 text-slate-500" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* User Info or Auth Buttons */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
              {user ? (
                <div className="space-y-4">
                  <Link
                    href={`/u/${username}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className={userCardClasses}>
                      <Avatar className={avatarClasses}>
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback className={avatarFallbackClasses}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {fullName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      href="/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 h-11 hover:bg-slate-100 dark:hover:bg-slate-900"
                      >
                        <Settings className="h-4 w-4" /> Settings
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 h-11 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900/30"
                      onClick={async () => {
                        await logoutAction();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className="w-full h-12 font-semibold text-base hover:bg-slate-100 dark:hover:bg-slate-900"
                    >
                      Masuk
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-base shadow-lg shadow-indigo-500/30">
                      Daftar Sekarang
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
