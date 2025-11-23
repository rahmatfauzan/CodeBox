// app/documents/[id]/page.tsx

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Globe,
  Lock,
  Code2,
  Clock,
  Gauge,
  Hash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { CodeViewer } from "../../components/code-viewer";

interface PageProps {
  params: { slug: string }; // ✅ Changed from id to id
}

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: doc, error } = await supabase
    .from("documents")
    .select(
      `
      *,
      category:categories(name, icon)
    `
    )
    .eq("slug", slug) // ✅ Changed from id to id
    .single();

  if (error || !doc) {
    console.error("Document not found:", error);
    notFound(); // Tampilkan 404 jika tidak ketemu
  }

  // 3. Cek Hak Akses (Apakah user ini pemiliknya?)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const isAuthor = user.id === doc.author_id;

  // // ✅ Jika private dan bukan pemilik, redirect
  if (doc.visibility === "private" && !isAuthor) {
    notFound();
  }

  // Helper untuk warna difficulty
  const difficultyColor = {
    beginner:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    intermediate:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* --- HEADER NAVIGASI --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <Link href="/dashboard/my-snippets">
          <Button
            variant="ghost"
            className="gap-2 pl-0 -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Button>
        </Link>

        {/* Tombol Aksi (Hanya muncul jika pemilik) */}
        {isAuthor && (
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/my-snippets/${doc.slug}/edit-document`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" /> Edit
              </Button>
            </Link>
            {/* <DeleteDocumentButton id={doc.id} /> */}
          </div>
        )}
      </div>

      {/* --- JUDUL & META DATA --- */}
      <div className="space-y-6 mb-10">
        {/* Badge Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Kategori */}
          <Badge
            variant="secondary"
            className="gap-1.5 py-1 px-3 text-sm font-medium bg-slate-100 dark:bg-slate-800"
          >
            <Code2 className="h-3.5 w-3.5 text-indigo-500" />
            {(doc.category as any)?.name || "Uncategorized"}
          </Badge>

          {/* Visibilitas */}
          <Badge
            variant="outline"
            className="gap-1.5 py-1 px-3 border-slate-300 dark:border-slate-700"
          >
            {doc.visibility === "public" ? (
              <Globe className="h-3.5 w-3.5 text-blue-500" />
            ) : (
              <Lock className="h-3.5 w-3.5 text-amber-500" />
            )}
            {doc.visibility === "public" ? "Public" : "Private"}
          </Badge>

          {/* Kesulitan */}
          {doc.difficulty && (
            <Badge
              className={`gap-1.5 py-1 px-3 border-0 ${
                difficultyColor[doc.difficulty as keyof typeof difficultyColor]
              }`}
            >
              <Gauge className="h-3.5 w-3.5" />
              <span className="capitalize">{doc.difficulty}</span>
            </Badge>
          )}
        </div>

        {/* Judul Utama */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          {doc.title}
        </h1>

        {/* Excerpt / Deskripsi Singkat */}
        {doc.excerpt && (
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl border-l-4 border-indigo-500 pl-4 py-1 bg-slate-50 dark:bg-slate-900/50 rounded-r-lg">
            {doc.excerpt}
          </p>
        )}

        {/* Info Waktu */}
        <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 pt-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Dibuat:{" "}
            {new Date(doc.created_at || "").toLocaleDateString("id-ID", {
              dateStyle: "long",
            })}
          </div>
          {doc.reading_time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Estimasi baca: {doc.reading_time} menit
            </div>
          )}
        </div>
      </div>

      <Separator className="my-8" />

      {/* --- KONTEN UTAMA (CODE VIEWER) --- */}
      <div className="min-h-[200px]">
        {/* Komponen ini akan merender Markdown & Highlight Kode */}
        <CodeViewer content={doc.content} />
      </div>
    </div>
  );
}
