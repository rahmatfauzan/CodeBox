"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function DashboardHeader({ name }: { name: string }) {
  const hour = new Date().getHours();
  let greeting = "Selamat Pagi";
  if (hour >= 12) greeting = "Selamat Siang";
  if (hour >= 15) greeting = "Selamat Sore";
  if (hour >= 18) greeting = "Selamat Malam";

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {greeting}, {name} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Berikut adalah ringkasan aktivitas perpustakaan kode Anda.
        </p>
      </div>
      <Link href="/dashboard/documents/create-document">
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all hover:scale-[1.02]">
          <Plus className="mr-2 h-4 w-4" /> Buat Snippet Baru
        </Button>
      </Link>
    </div>
  );
}
