
import { redirect } from "next/navigation";
import Link from "next/link";
import { Bookmark, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { PublicDocumentCard } from "../components/public-document-card";

export const metadata = {
  title: "Favorit Saya | CodeBox",
  description: "Koleksi snippet kode yang Anda simpan.",
};

export default async function FavoritesPage() {
  const supabase = await createClient();

  // 1. Cek Login
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Fetch Bookmark IDs
  // Kita ambil ID dokumen dulu dari tabel bookmarks
  const { data: bookmarks, error: bookmarkError } = await supabase
    .from("bookmarks")
    .select("bookmarkable_id")
    .eq("user_id", user.id)
    .eq("bookmarkable_type", "document");

  if (bookmarkError) {
    console.error("Error fetching bookmarks:", bookmarkError);
  }

  const docIds = bookmarks?.map((b) => b.bookmarkable_id) || [];
  let documents: any[] = [];

  // 3. Fetch Detail Dokumen (Hanya jika ada bookmark)
  if (docIds.length > 0) {
    // Kita ambil dari VIEW 'documents_with_details' agar datanya lengkap
    // (ada author avatar, like count, view count) untuk ditampilkan di Card
    const { data: rawDocs, error: docError } = await supabase
      .from("documents_with_details")
      .select("*")
      .in("id", docIds)
      .order("created_at", { ascending: false });

    if (!docError && rawDocs) {
      // Mapping Data agar sesuai format PublicDocumentCard
      documents = rawDocs.map((doc) => ({
        ...doc,
        author: {
          full_name: doc.author_full_name,
          username: doc.author_username,
          avatar_url: doc.author_avatar,
        },
        category: {
          name: doc.category_name,
          icon: doc.category_icon,
        },
      }));
    }
  }

  return (
    <div className="min-h-screen pb-20 animate-in fade-in duration-500">
      {/* Container dibatasi max-w-6xl agar rapi */}
      <div className="container mx-auto px-4 max-w-6xl py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Bookmark className="h-8 w-8 text-yellow-500 fill-yellow-500" />
              Favorit Saya
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Menampilkan {documents.length} snippet yang Anda simpan untuk
              dibaca nanti.
            </p>
          </div>

          <Link href="/explore">
            <Button variant="outline" className="gap-2">
              <Rocket className="w-4 h-4" /> Cari Lebih Banyak
            </Button>
          </Link>
        </div>

        <Separator className="mb-8" />

        {/* Content Grid */}
        {documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              // Menggunakan PublicDocumentCard (Tampilan Gallery)
              <PublicDocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-full mb-4">
              <Bookmark className="w-10 h-10 text-yellow-600 dark:text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Belum ada favorit
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm text-center mb-6">
              Jelajahi kode publik di halaman Explore dan tekan tombol bookmark
              untuk menyimpannya di sini.
            </p>
            <Link href="/explore">
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-md">
                Jelajahi Sekarang
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
