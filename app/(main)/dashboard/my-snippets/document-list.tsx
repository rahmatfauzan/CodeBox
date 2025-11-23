"use client";

import { useState } from "react";
import { Search, LayoutGrid, List as ListIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteModal } from "@/components/ui/delete-modal";
import { DocumentCard } from "./document-card";
import { DocumentTable } from "./document-table";
// Export tipe ini agar bisa diimport di page.tsx & card
export interface DocumentRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  status: "draft" | "published" | "archived";
  visibility: "public" | "private";
  difficulty: "beginner" | "intermediate" | "advanced" | null;
  created_at: string;
  category: { name: string; icon?: string } | null;
}

interface DocumentListProps {
  initialDocuments: DocumentRow[];
}

export function DocumentList({ initialDocuments = [] }: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRow | null>(null);

  // Filter Client Side
  const filteredDocuments = initialDocuments.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler Delete
  const handleDeleteClick = (doc: DocumentRow) => {
    setSelectedDoc(doc);
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* --- CONTROL BAR (Search & Toggle View) --- */}
      <div className="flex justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari snippet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white dark:bg-slate-950 h-full"
          />
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 self-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("card")}
            className={`h-8 px-3 rounded-md transition-all ${
              viewMode === "card"
                ? "bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("table")}
            className={`h-8 px-3 rounded-md transition-all ${
              viewMode === "table"
                ? "bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* --- CONTENT LIST --- */}
      {filteredDocuments.length === 0 ? (
        // Empty State Search Result
        <div className="text-center py-20 border border-dashed rounded-xl border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Tidak ditemukan
          </h3>
          <p className="text-sm text-slate-500">
            Tidak ada snippet yang cocok dengan kata kunci "{searchTerm}"
          </p>
        </div>
      ) : (
        <>
          {/* Conditional Rendering: Card / Table */}
          {viewMode === "card" ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredDocuments.map((doc) => (
                // Panggil komponen DocumentCard yang sudah Anda buat
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            // Panggil komponen Table (jika nanti sudah dibuat)
            <DocumentTable
              documents={filteredDocuments}
              onDelete={handleDeleteClick}
            />
          )}
        </>
      )}

      {/* --- MODAL DELETE --- */}
      {selectedDoc && (
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedDoc(null);
          }}
          documentId={selectedDoc.id}
          documentTitle={selectedDoc.title}
        />
      )}
    </div>
  );
}
