"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Gunakan router nextjs
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
  Rocket,
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
import { cn } from "@/lib/utils"; // Pastikan punya utils cn

interface NavbarProps {
  user: User | null;
}

export function Navbar({ user }: NavbarProps) {
  console.log("Navbar user:", user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { setTheme, theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  // --- USER DATA ---
  const initials = user?.email?.charAt(0).toUpperCase() || "U";
  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name || user?.email;
  const username = user?.user_metadata?.username || "user";

  // --- NAVIGATION ITEMS ---
  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Explore", href: "/explore", icon: Compass },
    ...(user
      ? [{ name: "Your Codes", href: "/your-code", icon: FileCode }]
      : []),
  ];

  const userMenuItems = user
    ? [
        { name: "Dashboard", href: "/dashboard", icon: Rocket },
        { name: "Favorites", href: "/favorites", icon: Heart },
        { name: "Bookmarks", href: "/saved", icon: Bookmark }, // Sesuaikan link saved
        { name: "History", href: "/history", icon: Clock },
      ]
    : [];

  // --- HANDLERS ---

  // 1. Handle Search Submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false); // Tutup modal
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`); // Redirect
      setSearchQuery(""); // Reset input
    }
  };

  // 2. Helper Cek Active Menu
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // 3. Toggle Theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/60 ">
        <div className="container max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          {/* --- 1. LOGO --- */}
          <Link
            href="/"
            className="flex items-center gap-2 group flex-shrink-0"
          >
            <div className="p-1.5 rounded-lg shadow-sm bg-gradient-to-br from-indigo-600 to-purple-600 group-hover:shadow-md group-hover:scale-105 transition-all">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white hidden sm:inline">
              Code<span className="text-indigo-600">Box</span>
            </span>
          </Link>

          {/* --- 2. DESKTOP NAVIGATION --- */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium flex-1 ml-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive(item.href)
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                    : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* --- 3. ACTIONS KANAN --- */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Search Trigger */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full"
            >
              <Search className="h-[1.2rem] w-[1.2rem]" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full ring-2 ring-slate-200 dark:ring-slate-800 hover:ring-indigo-500 transition-all ml-2"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={avatarUrl} alt={fullName} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">
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
                    <Link href={`/u/${username}`}>
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
              <div className="flex items-center gap-2 ml-2">
                <Link href="/login">
                  <Button variant="ghost" className="font-semibold">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-md">
                    Daftar
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* --- 4. MOBILE TOGGLE --- */}
          <div className="flex lg:hidden items-center gap-1 ">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5 text-slate-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* --- 5. MOBILE MENU DRAWER --- */}
        {isMobileMenuOpen && (
          <div className="max-w-6xl mx-auto container lg:hidden absolute top-16 left-0 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl z-50 animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-4rem)] overflow-y-auto ">
            <div className="p-4 space-y-4 max-w-6xl mx-auto container">
              {/* Theme Toggle Mobile */}
              <div className="flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
                <span className="text-sm font-medium">Tema Tampilan</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="h-8 w-8 p-0"
                >
                  {theme === "dark" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="space-y-1">
                <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Menu
                </p>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20"
                        : "hover:bg-slate-100 dark:hover:bg-slate-900"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" /> {item.name}
                  </Link>
                ))}
              </div>

              {user && (
                <>
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                    <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      My Space
                    </p>
                    <div className="space-y-1">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-900"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <item.icon className="h-5 w-5 text-slate-500" />{" "}
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                    <Link
                      href={`/u/${username}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={avatarUrl} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden flex-1">
                          <p className="text-sm font-bold truncate">
                            {fullName}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {user.email}
                          </p>
                        </div>
                        <Settings className="h-5 w-5 text-slate-400" />
                      </div>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full mt-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200"
                      onClick={async () => {
                        await logoutAction();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                  </div>
                </>
              )}

              {!user && (
                <div className="grid grid-cols-1 gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full h-11">
                      Masuk
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                      Daftar
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* --- 6. SEARCH MODAL (DIALOG) --- */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0 top-[20%] translate-y-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
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
                  placeholder="Type to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 h-12 text-base rounded-lg focus-visible:ring-indigo-500"
                  autoFocus
                />
              </div>

              {/* Popular Tags (Clickable) */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Popular
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "React",
                    "Next.js",
                    "Supabase",
                    "Tailwind",
                    "Python",
                    "API",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSearchQuery(tag);
                        // Opsional: Langsung search saat klik tag
                        // router.push(`/explore?q=${encodeURIComponent(tag)}`);
                        // setIsSearchOpen(false);
                      }}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-slate-700 dark:text-slate-300 rounded-full text-sm transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsSearchOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
