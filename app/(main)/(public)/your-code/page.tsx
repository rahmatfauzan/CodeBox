import { redirect } from "next/navigation";
import { FileCode, Plus, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicDocumentCard } from "../components/public-document-card";
import { createClient } from "@/lib/supabase/server";
export const metadata = {
  title: "Kode Saya | CodeBox",
  description: "Koleksi seluruh snippet kode Anda.",
};

export default async function YourCodePage() {
  const supabase = await createClient();

  // 1. Cek User Login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Fetch Data (Semua snippet user, termasuk private/draft)
  const { data: rawDocuments, error } = await supabase
    .from("documents_with_details") // Menggunakan View
    .select("*")
    .eq("author_id", user.id) // Hanya milik user yang login
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching your codes:", error);
  }

  // 3. Data Mapping (Flat View -> Nested Object untuk Card)
  const documents =
    rawDocuments?.map((doc) => ({
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
    })) || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              KodeMu
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Menampilkan {documents.length} snippet dari perpustakaan Anda
              (Public & Private).
            </p>
          </div>

          <Link href="/documents/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
              <Plus className="mr-2 h-4 w-4" /> Buat Baru
            </Button>
          </Link>
        </div>

        {/* Content Grid */}
        {documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <PublicDocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950">
            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-full mb-4">
              <FileCode className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Belum ada kode
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm text-center mb-6">
              Anda belum menyimpan snippet apapun. Mulai buat dokumentasi kode
              pertama Anda sekarang.
            </p>
            <Link href="/documents/new">
              <Button variant="outline">Buat Snippet Pertama</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
