import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { DocumentList, type DocumentRow } from "./document-list";
import { createClient } from "@/lib/supabase/server";

const ITEMS_PER_PAGE = 9;

export const metadata = {
  title: "Koleksi Snippet Saya | CodeBox",
  description: "Kelola semua potongan kode yang telah Anda simpan.",
};

export default async function MySnippetsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const query = params.query || "";

  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let supabaseQuery = supabase
    .from("documents")
    .select(
      `
      id, slug, title, excerpt, status, visibility, difficulty, created_at,
      category:categories(name, icon)
    `,
      { count: "exact" }
    )
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

    
    if (query) {
      supabaseQuery = supabaseQuery.ilike("title", `%${query}%`);
    }
    
    const { data: documents, count, error } = await supabaseQuery;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <p>Gagal memuat data.</p>
        <p className="text-sm opacity-70">{error.message}</p>
      </div>
    );
  }

  const typedDocuments = (documents as unknown as DocumentRow[]) || [];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500 container max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Koleksi Saya
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Kelola {count || 0} snippet yang telah Anda buat
        </p>
      </div>

      <Separator />

      {/* Document List */}
      <DocumentList initialDocuments={typedDocuments} />
    </div>
  );
}
