// app/documents/new/page.tsx (or edit page)

import { createClient } from "@/lib/supabase/server";
import { DocumentForm } from "../../components/create-document-form";
export default async function NewDocumentPage() {
  const supabase = await createClient();

  // ✅ Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  // ✅ Fetch existing tags untuk suggestions
  const { data: existingTagsData } = await supabase
    .from("tags")
    .select("name")
    .order("usage_count", { ascending: false }) // Sort by popularity
    .limit(50); // Limit untuk performance

  // Extract tag names
  const existingTags = existingTagsData?.map((tag) => tag.name) || [];

  console.log("Existing tags:", existingTags); // ✅ Debug log

  return (
    <div className="">
      <DocumentForm
        categories={categories || []}
        existingTags={existingTags} // ✅ Pass suggestions
      />
    </div>
  );
}
