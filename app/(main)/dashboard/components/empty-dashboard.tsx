import { FileCode, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 p-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/20 mb-4">
        <FileCode className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        Belum ada snippet
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 text-sm leading-relaxed">
        Perpustakaan Anda masih kosong. Mulai simpan potongan kode, konfigurasi,
        atau catatan teknis pertama Anda sekarang.
      </p>
      <Link href="/documents/new">
        <Button
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Buat Snippet Pertama
        </Button>
      </Link>
    </div>
  );
}
