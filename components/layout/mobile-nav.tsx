"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Compass, Star, Settings, Plus } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Logic: Sembunyikan navbar saat scroll ke bawah, munculkan saat scroll ke atas
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Threshold 10px agar tidak terlalu sensitif (jittery)
      if (Math.abs(currentScrollY - lastScrollY) < 10) return;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false); // Scroll ke bawah -> Hilang
      } else {
        setIsVisible(true); // Scroll ke atas -> Muncul
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Daftar Menu Navigasi
  const menuItems = [
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "New", href: "/documents/new", icon: Plus, isSpecial: true }, // Tombol Tengah Spesial
    { name: "Favs", href: "/favorites", icon: Star },
    { name: "Setting", href: "/settings", icon: Settings },
  ];

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <ul className="flex justify-around items-center h-16 px-2 safe-area-pb">
        {menuItems.map((item) => {
          const Icon = item.icon;
          // Logic aktif: jika href sama persis ATAU jika sub-route (misal /documents/new aktif saat di /documents)
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <li key={item.name} className="flex-1 relative h-full flex items-center justify-center">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                  isActive 
                    ? "text-indigo-600 dark:text-indigo-400" 
                    : "text-slate-500 dark:text-slate-400 hover:text-indigo-500"
                }`}
              >
                {/* Icon Wrapper */}
                <div className={`relative flex flex-col items-center ${item.isSpecial ? "-mt-8" : ""}`}>
                  
                  {item.isSpecial ? (
                    // --- TOMBOL SPESIAL (Bulat Besar di Tengah) ---
                    <div className="p-3.5 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-full shadow-lg shadow-indigo-500/30 text-white border-[4px] border-white dark:border-slate-950 active:scale-95 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                  ) : (
                    // --- ICON BIASA ---
                    <Icon className={`w-6 h-6 mb-1 transition-all ${isActive ? "scale-110 stroke-[2.5px]" : ""}`} />
                  )}

                  {/* Label Text (Hanya muncul jika bukan tombol spesial) */}
                  {!item.isSpecial && (
                    <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
                  )}
                </div>

                {/* Indikator Garis Bawah (Hanya item biasa saat aktif) */}
                {isActive && !item.isSpecial && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute top-0 w-8 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-b-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}