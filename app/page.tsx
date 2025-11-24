import { createClient } from "@/lib/supabase/server";
import LandingPageClient from "./landing-page-client";

// Revalidate data setiap 60 detik (ISR) agar tidak terlalu membebani DB
export const revalidate = 60;

export default async function LandingPage() {
  const supabase = await createClient();

  // 1. Fetch Trending Documents
  // Menggunakan View 'documents_with_details' yang sudah kita buat
  const { data: trendingDocs, error } = await supabase
    .from("trending_documents")
    .select("*")
    .limit(6);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching trending docs:", error);
  }
  // 2. Data Mapping (PENTING)
  // Mengubah struktur 'Flat' dari Database View menjadi 'Nested'
  // agar sesuai dengan props yang diminta oleh PublicDocumentCard
  const formattedDocs =
    trendingDocs?.map((doc) => ({
      ...doc,
      // Mapping Author (Flat -> Object)
      author: {
        full_name: doc.author_name,
        username: doc.author_username,
        avatar_url: doc.author_avatar,
      },
      // Mapping Category (Flat -> Object)
      category: {
        name: doc.category_name,
      },
    })) || [];

  return <LandingPageClient trendingDocs={formattedDocs} user={user} />;
}
