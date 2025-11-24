import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./components/dashboard";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Ambil User
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const fullName = user.user_metadata?.full_name || "Developer";
  const firstName = fullName.split(" ")[0];

  // Get current time in WIB (UTC+7)
  const now = new Date();
  const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const hour = wibTime.getUTCHours();

  // Greeting based on time - Tanpa emoji
  let greeting = "Selamat Pagi";
  if (hour >= 11 && hour < 15) {
    greeting = "Selamat Siang";
  } else if (hour >= 15 && hour < 18) {
    greeting = "Selamat Sore";
  } else if (hour >= 18 || hour < 4) {
    greeting = "Selamat Malam";
  }

  // 2. Fetch Data Statistik
  const [
    documentsCount,
    viewsCount,
    recentDocsResult,
    likesCount,
    bookmarksCount,
  ] = await Promise.all([
    // Total Documents
    supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("author_id", user.id),

    // Total Views
    supabase.from("documents").select("view_count").eq("author_id", user.id),

    // Recent Documents dengan likes_count dan bookmark_count
    supabase
      .from("documents")
      .select(
        `
          id,
          title,
          slug,
          excerpt,
          created_at,
          difficulty,
          category:categories(name, icon),
          visibility,
          status,
          like_count,
          bookmark_count
          `
      )
      .eq("author_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6),

    // Total Likes dari semua dokumen user
    supabase.from("documents").select("like_count").eq("author_id", user.id),

    // Total Bookmarks dari semua dokumen user
    supabase
      .from("documents")
      .select("bookmark_count")
      .eq("author_id", user.id),
  ]);

  const totalDocs = documentsCount.count || 0;
  const totalViews =
    viewsCount.data?.reduce((acc, curr) => acc + (curr.view_count || 0), 0) ||
    0;
  const totalLikes =
    likesCount.data?.reduce((acc, curr) => acc + (curr.like_count || 0), 0) ||
    0;
  const totalBookmarks =
    bookmarksCount.data?.reduce(
      (acc, curr) => acc + (curr.bookmark_count || 0),
      0
    ) || 0;

  return (
    <DashboardClient
      firstName={firstName}
      greeting={greeting}
      totalDocs={totalDocs}
      totalViews={totalViews}
      totalLikes={totalLikes}
      totalBookmarks={totalBookmarks}
      recentDocs={recentDocsResult.data || []}
    />
  );
}
