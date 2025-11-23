"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { User } from "@supabase/supabase-js";

export function ConditionalNavbar({ user }: { user: User | null }) {
  const pathname = usePathname();

  // Logic: Jika URL diawali dengan "/dashboard", JANGAN tampilkan Navbar
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  // Selain itu, tampilkan Navbar
  return <Navbar user={user} />;
}
