"use client";

import Link from "next/link";
import {
  Code2,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  Eye,
  Lock,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentRow } from "./document-list";
interface DocumentCardProps {
  doc: DocumentRow;
  onDelete: (doc: DocumentRow) => void;
}

export function DocumentCard({ doc, onDelete }: DocumentCardProps) {
  // Helper warna badge Difficulty
  const difficultyColor = {
    beginner:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
    intermediate:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-900",
    advanced:
      "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-900",
  };

  // Helper warna badge Status
  const statusColor = {
    draft:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200",
    published:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900",
    archived: "bg-gray-100 text-gray-500 border-gray-200",
  };

  return (
    <Card className="group relative h-full flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300 hover:shadow-xl hover:border-indigo-400/50 dark:hover:border-indigo-500/50 hover:-translate-y-1">
      {/* Gradient Glow saat Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <CardContent className="p-5 flex-1 flex flex-col h-full relative z-10">
        {/* --- HEADER CARD --- */}
        <div className="flex items-start justify-between mb-4">
          {/* Kategori Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-600 dark:text-slate-300">
            <Code2 className="h-3.5 w-3.5 text-indigo-500" />
            <span className="truncate max-w-[100px]">
              {doc.category?.name || "General"}
            </span>
          </div>

          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mr-2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <Link href={`/documents/${doc.slug}/edit`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() => onDelete(doc)}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* --- MAIN CONTENT (Clickable) --- */}
        <Link href={`/dashboard/my-snippets/${doc.slug}`} className="flex-1 group/link">
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 group-hover/link:text-indigo-600 dark:group-hover/link:text-indigo-400 transition-colors">
            {doc.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
            {doc.excerpt || (
              <span className="italic opacity-50">
                Tidak ada deskripsi singkat.
              </span>
            )}
          </p>
        </Link>

        {/* --- FOOTER METADATA --- */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between">
          {/* Left: Badges */}
          <div className="flex items-center gap-2">
            {/* Status Badge */}
            <Badge
              variant="outline"
              className={`text-[10px] px-2 py-0 h-5 font-medium border ${
                statusColor[doc.status]
              }`}
            >
              {doc.status === "published" ? "Live" : "Draft"}
            </Badge>

            {/* Difficulty Badge */}
            <Badge
              variant="outline"
              className={`text-[10px] px-2 py-0 h-5 font-medium border ${
                difficultyColor[
                  (doc.difficulty as keyof typeof difficultyColor) || "beginner"
                ]
              }`}
            >
              {doc.difficulty}
            </Badge>
          </div>

          {/* Right: Icons Info */}
          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            {/* Visibility */}
            <div className="flex items-center gap-1" title={doc.visibility}>
              {doc.visibility === "public" ? (
                <Eye className="h-3.5 w-3.5 text-indigo-400" />
              ) : (
                <Lock className="h-3.5 w-3.5" />
              )}
            </div>

            {/* Date */}
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {new Date(doc.created_at).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
