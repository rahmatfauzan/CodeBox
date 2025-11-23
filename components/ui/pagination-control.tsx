"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlProps {
  totalCount: number;
  pageSize: number;
}

export function PaginationControl({ totalCount, pageSize }: PaginationControlProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Ambil halaman saat ini dari URL (default 1)
  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Fungsi ganti halaman
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {/* Tombol Previous */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(createPageURL(currentPage - 1))}
        disabled={currentPage <= 1}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" /> Prev
      </Button>

      {/* Indikator Halaman */}
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
        Page {currentPage} of {totalPages}
      </span>

      {/* Tombol Next */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(createPageURL(currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-1"
      >
        Next <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}