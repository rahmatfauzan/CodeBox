import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./components/dashboard";
import { unstable_cache } from "next/cache";

// Cache stats untuk 60 detik
const getCachedUserStats = unstable_cache(
  async (userId: string) => {
    const supabase = await createClient();

    // Fetch semua stats dalam 1 query yang lebih efisien
    const { data: documents } = await supabase
      .from("documents")
      .select("view_count, like_count, bookmark_count")
      .eq("author_id", userId);

    if (!documents) {
      return {
        totalDocs: 0,
        totalViews: 0,
        totalLikes: 0,
        totalBookmarks: 0,
      };
    }

    return {
      totalDocs: documents.length,
      totalViews: documents.reduce(
        (acc, doc) => acc + (doc.view_count || 0),
        0
      ),
      totalLikes: documents.reduce(
        (acc, doc) => acc + (doc.like_count || 0),
        0
      ),
      totalBookmarks: documents.reduce(
        (acc, doc) => acc + (doc.bookmark_count || 0),
        0
      ),
    };
  },
  ["user-dashboard-stats"],
  {
    revalidate: 60, // Cache selama 60 detik
    tags: ["dashboard-stats"],
  }
);

// Cache recent docs untuk 30 detik
const getCachedRecentDocs = unstable_cache(
  async (userId: string) => {
    const supabase = await createClient();

    const { data } = await supabase
      .from("documents")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        created_at,
        difficulty,
        visibility,
        status,
        like_count,
        bookmark_count,
        category:categories(name, icon)
      `
      )
      .eq("author_id", userId)
      .order("created_at", { ascending: false })
      .limit(6);

    return data || [];
  },
  ["user-recent-docs"],
  {
    revalidate: 30,
    tags: ["recent-docs"],
  }
);

// Helper untuk greeting berdasarkan waktu WIB
function getGreeting(): string {
  const now = new Date();
  const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const hour = wibTime.getUTCHours();

  if (hour >= 4 && hour < 11) return "Selamat Pagi";
  if (hour >= 11 && hour < 15) return "Selamat Siang";
  if (hour >= 15 && hour < 18) return "Selamat Sore";
  return "Selamat Malam";
}

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Ambil User - ini harus real-time, tidak di-cache
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const fullName = user.user_metadata?.full_name || "Developer";
  const firstName = fullName.split(" ")[0];
  const greeting = getGreeting();

  // 2. Fetch data dengan cache - parallel execution
  const [stats, recentDocs] = await Promise.all([
    getCachedUserStats(user.id),
    getCachedRecentDocs(user.id),
  ]);

  return (
    <DashboardClient
      firstName={firstName}
      greeting={greeting}
      totalDocs={stats.totalDocs}
      totalViews={stats.totalViews}
      totalLikes={stats.totalLikes}
      totalBookmarks={stats.totalBookmarks}
      recentDocs={recentDocs}
    />
  );
}
