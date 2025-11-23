"use client";

import Link from "next/link";
import {
  MoreVertical,
  Edit,
  Trash2,
  Code2,
  Globe,
  Lock,
  Calendar,
  Eye,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentRow } from "./document-list";

interface DocumentTableProps {
  documents: DocumentRow[];
  onDelete: (doc: DocumentRow) => void;
}

// Helper untuk difficulty badge
function getDifficultyBadge(difficulty: string | null) {
  const diff = difficulty || "beginner";
  const variants: any = {
    beginner: {
      label: "Basic",
      color:
        "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800",
      dot: "bg-green-500",
    },
    intermediate: {
      label: "Medium",
      color:
        "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
      dot: "bg-yellow-500",
    },
    advanced: {
      label: "Pro",
      color:
        "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800",
      dot: "bg-red-500",
    },
  };
  return variants[diff];
}

export function DocumentTable({ documents, onDelete }: DocumentTableProps) {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300 w-[35%] px-6 py-4">
                Snippet
              </TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300 px-6 py-4">
                Kategori
              </TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300 px-6 py-4">
                Level
              </TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300 px-6 py-4">
                Status
              </TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300 px-6 py-4">
                Visibilitas
              </TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300 px-6 py-4">
                Tanggal
              </TableHead>
              <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300 w-[60px] px-6 py-4">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center px-6 py-8">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <Code2 className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">Tidak ada snippet ditemukan</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => {
                const difficulty = getDifficultyBadge(doc.difficulty);

                return (
                  <TableRow
                    key={doc.id}
                    className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
                  >
                    {/* Snippet Title & Excerpt */}
                    <TableCell className="px-6 py-5">
                      <Link
                        href={`/dashboard/my-snippets/${doc.slug}`}
                        className="block space-y-1"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                            <Code2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-1">
                              {doc.title}
                            </p>
                            {doc.excerpt && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                {doc.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </TableCell>

                    {/* Category */}
                    <TableCell className="px-6 py-5">
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-0 px-2.5 py-1"
                      >
                        {doc.category?.name || "Uncategorized"}
                      </Badge>
                    </TableCell>

                    {/* Difficulty Level */}
                    <TableCell className="px-6 py-5">
                      <Badge
                        className={`text-xs font-medium border px-2.5 py-1 ${difficulty.color}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full mr-1.5 ${difficulty.dot}`}
                        />
                        {difficulty.label}
                      </Badge>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-6 py-5">
                      {doc.status === "published" ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-xs font-medium">Published</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          <span className="text-xs font-medium">Draft</span>
                        </div>
                      )}
                    </TableCell>

                    {/* Visibility */}
                    <TableCell className="px-6 py-5">
                      <div className="inline-flex items-center gap-2 text-sm">
                        {doc.visibility === "public" ? (
                          <>
                            <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                              <Globe className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              Public
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <Lock className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                            </div>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              Private
                            </span>
                          </>
                        )}
                      </div>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="tabular-nums">
                          {new Date(doc.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right px-6 py-5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity data-[state=open]:opacity-100"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <Link href={`/documents/${doc.slug}`}>
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat
                            </DropdownMenuItem>
                          </Link>
                          <Link href={`/documents/${doc.slug}/edit`}>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(doc)}
                            className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Info */}
      {documents.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Menampilkan{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {documents.length}
            </span>{" "}
            snippet
          </p>
        </div>
      )}
    </div>
  );
}
