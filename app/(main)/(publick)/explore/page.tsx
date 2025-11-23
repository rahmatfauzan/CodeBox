import { Sparkles, Rocket } from "lucide-react";
import { PaginationControl } from "@/components/ui/pagination-control";
import { createClient } from "@/lib/supabase/client";
import { ExploreSearch } from "../components/explore-search";
import { PublicDocumentCard } from "../components/public-document-card";

// Konfigurasi Pagination (12 item agar rapi di grid 2, 3, atau 4 kolom)
const ITEMS_PER_PAGE = 12;

export const metadata = {
  title: "Explore Code | CodeBox",
  description: "Temukan snippet kode terbaik dari komunitas developer.",
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;

  // 1. Ambil Parameter URL
  const query = params.q || "";
  const currentPage = Number(params.page) || 1;

  // 2. Hitung Range Pagination (Supabase 0-based index)
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // 3. Build Query Database
  let supabaseQuery = supabase
    .from("documents_with_details") // Menggunakan View SQL
    .select("*", { count: "exact" }) // Hitung total data untuk pagination
    .eq("status", "published")
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .range(from, to); // Batasi data sesuai halaman

  // 4. Tambahkan Filter Pencarian (Jika ada query)
  if (query) {
    supabaseQuery = supabaseQuery.ilike("title", `%${query}%`);
  }

  // 5. Eksekusi Query
  const { data: rawDocuments, count, error } = await supabaseQuery;

  if (error) {
    console.error("Explore Error:", error);
  }

  // 6. Data Mapping (Flat View -> Nested Object)
  // Agar cocok dengan props PublicDocumentCard
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/50 ">
      {/* --- HEADER SECTION --- */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 pt-24 pb-12 px-4 text-center">
        <div className="container mx-auto max-w-6xl">
          {/* Badge Kecil */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-medium mb-6 border border-indigo-100 dark:border-indigo-800">
            <span>Community Library</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Simpan Sekali, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              Pakai Selamanya.
            </span>
          </h1>

          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
            Berhenti <i>Googling</i> solusi yang sama berulang kali. Kumpulkan
            konfigurasi, <i>helper function</i>, dan komponen UI favorit Anda di
            satu tempat yang terorganisir dan mudah dicari.
          </p>

          {/* Search Bar */}
          <div className="max-w-lg mx-auto">
            <ExploreSearch />
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="container mx-auto max-w-6xl px-4 py-10 pb-24">
        {!documents || documents.length === 0 ? (
          // EMPTY STATE
          <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-full inline-flex mb-4">
              <Rocket className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Belum ada snippet ditemukan
            </h3>
            <p className="text-slate-500">
              {query
                ? `Tidak ada hasil untuk "${query}"`
                : "Jadilah yang pertama membagikan kode!"}
            </p>
          </div>
        ) : (
          // GRID & PAGINATION
          <>
            {/* Grid Kartu */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {documents.map((doc) => (
                <PublicDocumentCard key={doc.id} doc={doc} />
              ))}
            </div>

            {/* Pagination Control */}
            <div className="mt-12">
              <PaginationControl
                totalCount={count || 0}
                pageSize={ITEMS_PER_PAGE}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
