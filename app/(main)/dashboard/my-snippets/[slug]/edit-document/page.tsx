// app/documents/[documentId]/edit/page.tsx

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { DocumentForm } from "../../../components/create-document-form"; // Sesuaikan path jika perlu

// Definisikan props yang diterima dari parameter dinamis
interface EditDocumentPageProps {
  params: {
    documentId: string;
  };
}

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Ambil data dokumen spesifik
  const { data: documentData, error: documentError } = await supabase
    .from("documents")
    .select("*, tags(name)") // Ambil tags juga, asumsikan relasi many-to-many
    .eq("slug", slug)
    .single();

  if (documentError || !documentData) {
    // Jika dokumen tidak ditemukan, tampilkan notFound page
    notFound();
  }

  // 2. Ambil kategori dan tag yang ada (seperti di halaman 'new')
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  const { data: existingTagsData } = await supabase
    .from("tags")
    .select("name")
    .order("usage_count", { ascending: false })
    .limit(50);

  const existingTags = existingTagsData?.map((tag) => tag.name) || [];

  // ✅ Format data dokumen untuk DocumentForm
  // Supabase mungkin mengembalikan tags dalam bentuk array objek { name: 'tagname' }
  // Kita perlu mengubahnya menjadi array string: ['tagname1', 'tagname2']
  const initialTags = (documentData.tags as { name: string }[])?.map(
    (tag) => tag.name
  );

  const initialData = {
    ...documentData,
    tags: initialTags,
  };

  return (
    <div className="">
      <div className="max-w-6xl container mx-auto">
      <h1 className="text-3xl font-bold">
        Edit Document: {documentData.title}
      </h1>
      </div>
      <DocumentForm
        categories={categories || []}
        existingTags={existingTags}
        initialData={initialData} // ✅ Pass initial data
      />
    </div>
  );
}
