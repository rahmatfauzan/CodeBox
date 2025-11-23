"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce"; // npm install use-debounce

// Jika belum install use-debounce, jalankan: npm install use-debounce
// Atau gunakan timeout manual sederhana

export function ExploreSearch() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    replace(`/explore?${params.toString()}`);
  }, 300); // Delay 300ms agar tidak spam request

  return (
    <div className="relative w-full max-w-lg mx-auto mb-12">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <Input
        type="search"
        placeholder="Cari snippet publik (ex: React, Authentication)..."
        className="pl-11 h-12 rounded-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm focus-visible:ring-indigo-500"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("q")?.toString()}
      />
    </div>
  );
}
