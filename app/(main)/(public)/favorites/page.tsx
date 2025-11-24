
import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart, Rocket } from "lucide-react"; // Ganti Bookmark jadi Heart
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { PublicDocumentCard } from "../components/public-document-card";
export const metadata = {
  title: "Disukai | CodeBox",
  description: "Koleksi snippet kode yang Anda sukai.",
};

export default async function FavoritesPage() {
  const supabase = await createClient();

  // 1. Cek Login
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Fetch IDs dari Tabel Likes (BUKAN Bookmarks)
  const { data: likes, error: likeError } = await supabase
    .from("likes")
    .select("likeable_id")
    .eq("user_id", user.id)
    .eq("likeable_type", "document"); // Pastikan tipe document

  if (likeError) {
    console.error("Error fetching likes:", likeError);
  }

  const docIds = likes?.map((l) => l.likeable_id) || [];
  let documents: any[] = [];

  // 3. Fetch Detail Dokumen (Hanya jika ada like)
  if (docIds.length > 0) {
    const { data: rawDocs, error: docError } = await supabase
      .from("documents_with_details")
      .select("*")
      .in("id", docIds)
      .order("created_at", { ascending: false });

    if (!docError && rawDocs) {
      // Mapping Data
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
      <div className="container mx-auto px-4 max-w-6xl py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              {/* Icon Hati Merah */}
              <Heart className="h-8 w-8 text-red-500 fill-red-500" />
              Disukai
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Menampilkan {documents.length} snippet yang Anda sukai.
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
              <PublicDocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20">
            <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full mb-4">
              <Heart className="w-10 h-10 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Belum ada yang disukai
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm text-center mb-6">
              Jelajahi kode publik di halaman Explore dan berikan "Like" pada
              snippet yang bermanfaat.
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
