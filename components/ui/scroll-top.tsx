"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScrollTop() {
  const [show, setShow] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Tampilkan jika scroll lebih dari 300px
      if (currentScrollY > 300) {
        // Jika sedang scroll ke bawah -> Sembunyikan (Supaya layar bersih)
        // Jika sedang scroll ke atas -> Tampilkan
        if (currentScrollY < lastScrollY) {
          setShow(true);
        } else {
          setShow(false);
        }
      } else {
        setShow(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className={`fixed right-6 z-40 rounded-full shadow-xl transition-all duration-500 ease-in-out bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-110
        ${
          show
            ? "translate-y-0 opacity-100"
            : "translate-y-24 opacity-0 pointer-events-none"
        }
        /* POSISI PENTING: bottom-24 di HP (biar ga ketutup nav), bottom-8 di Desktop */
        bottom-24 lg:bottom-8
      `}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
