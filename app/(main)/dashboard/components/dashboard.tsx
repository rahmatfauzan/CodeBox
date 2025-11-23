"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Eye,
  Star,
  Clock,
  Code2,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; // Pastikan cn diimpor

// Komponen Kartu Statistik - Tanpa Pattern Hover
function StatCard({ title, value, icon: Icon, description, trend }: any) {
  return (
    <Card className="relative border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-blue-500 hover:shadow-lg transition-all group overflow-hidden">
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          {title}
        </CardTitle>

        {/* Icon Container - Shows </> on hover */}
        <div className="relative h-10 w-10">
          {/* Default Icon */}
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-blue-600 shadow-md group-hover:scale-0 group-hover:rotate-180 transition-all duration-300">
            <Icon className="h-5 w-5 text-white" />
          </div>

          {/* Hover Icon </> */}
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-blue-600 shadow-md scale-0 rotate-180 group-hover:scale-100 group-hover:rotate-0 transition-all duration-300">
            <Code2 className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-bold text-slate-900 dark:text-white">
          {value}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1.5 flex items-center gap-1">
          {description}
          {trend && (
            <span className="text-green-600 dark:text-green-400 font-semibold">
              {trend}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}

// Helper function untuk badge difficulty
function getDifficultyBadge(difficulty: string) {
  const variants: any = {
    beginner: {
      label: "Basic",
      color:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      emoji: "🟢",
    },
    intermediate: {
      label: "Medium",
      color:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      emoji: "🟡",
    },
    advanced: {
      label: "Pro",
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      emoji: "🔴",
    },
  };
  return variants[difficulty] || variants.beginner;
}

// Component untuk Real-time Clock (Perbaikan Hydration Error)
function RealtimeClock() {
  const [time, setTime] = useState(new Date());
  // State untuk menandakan bahwa komponen sudah terhidrasi di client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Komponen terhidrasi

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time in WIB (UTC+7)
  const wibTime = new Date(time.getTime() + 7 * 60 * 60 * 1000);
  const hours = String(wibTime.getUTCHours()).padStart(2, "0");
  const minutes = String(wibTime.getUTCMinutes()).padStart(2, "0");

  // Detik: hanya dihitung real-time di client
  const seconds = String(wibTime.getUTCSeconds()).padStart(2, "0");

  // Format tanggal: hanya dilakukan di client untuk menghindari error locale/timezone
  const formattedDate = isClient
    ? wibTime.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })
    : "Loading...";

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">
          {hours}:{minutes}
        </span>

        {/* Bagian Detik: Gunakan isClient untuk menghindari Hydration Error */}
        <span
          className={cn(
            "text-lg font-bold text-blue-600 dark:text-blue-400 font-mono animate-pulse",
            !isClient && "hidden"
          )}
        >
          :{isClient ? seconds : "00"}
        </span>

        <span className="text-sm text-slate-500 dark:text-slate-500 ml-1">
          WIB
        </span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-500">
        {formattedDate}
      </p>
    </div>
  );
}

interface DashboardClientProps {
  firstName: string;
  greeting: string;
  totalDocs: number;
  totalViews: number;
  totalLikes: number;
  totalBookmarks: number;
  recentDocs: any[];

}

export function DashboardClient({
  firstName,
  greeting,
  totalDocs,
  totalViews,
  totalLikes,
  totalBookmarks,
  recentDocs,
}: DashboardClientProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Custom Header - Clean & Simple */}
      <div className="relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          {/* Floating Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-300 dark:bg-blue-900 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300 dark:bg-purple-900 rounded-full filter blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-indigo-300 dark:bg-indigo-900 rounded-full filter blur-2xl animate-pulse delay-500" />
        </div>

        {/* Code Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-5 dark:opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='10' y='30' font-family='monospace' font-size='20' fill='%233b82f6'%3E%3C/%3E%3C/text%3E%3Ctext x='60' y='70' font-family='monospace' font-size='20' fill='%233b82f6'%3E%7B%7D%3C/text%3E%3Ctext x='30' y='90' font-family='monospace' font-size='16' fill='%238b5cf6'%3E()%3C/text%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Content */}
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-blue-100 dark:border-slate-800 backdrop-blur-sm">
          {/* Left Side - Greeting */}
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {greeting}
            </p>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              {firstName}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Siap untuk coding hari ini?
            </p>
          </div>

          {/* Right Side - Clock + Button */}
          <div className="flex flex-col items-end gap-4">
            <RealtimeClock />

            <Link href="/dashboard/my-snippets/create-document">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 group">
                <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                Buat Snippet Baru
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Snippets"
          value={totalDocs}
          icon={FileText}
          description="Kode tersimpan"
        />
        <StatCard
          title="Total Views"
          value={totalViews}
          icon={Eye}
          description="Kali dilihat"
        />
        <StatCard
          title="Favorites"
          value={totalBookmarks}
          icon={Star}
          description="Disimpan favorit"
        />
        <StatCard
          title="Total Likes"
          value={totalLikes}
          icon={Heart}
          description="Jumlah suka"
        />
      </div>

      {/* Recent Snippets Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="h-8 w-1 bg-blue-600 rounded-full" />
              Snippet Terbaru
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-500 ml-5">
              {totalDocs} total snippet tersimpan
            </p>
          </div>
          {totalDocs > 0 && (
            <Link
              href="/documents"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1.5 group"
            >
              Lihat Semua
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {totalDocs === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Belum ada snippet</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentDocs?.map((doc) => {
              const difficultyBadge = getDifficultyBadge(
                doc.difficulty || "beginner"
              );

              return (
                <Link
                  key={doc.slug}
                  href={`/dashboard/my-snippets/${doc.slug}`}
                >
                  <Card className="group h-full border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer bg-white dark:bg-slate-950 rounded-xl">
                    <CardContent className="p-5 space-y-4">
                      {/* Header: Category + Status */}
                      <div className="flex items-start justify-between gap-2">
                        {/* Category */}
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg"
                        >
                          <Code2 className="h-3.5 w-3.5 mr-1" />
                          {(doc.category as any)?.name || "Uncategorized"}
                        </Badge>

                        {/* Status Badge */}
                        <div className="flex items-center gap-1.5">
                          {doc.status === "published" ? (
                            <Badge className="text-[10px] px-2 py-0.5 bg-green-500 text-white border-0 rounded-md">
                              ✓ Published
                            </Badge>
                          ) : (
                            <Badge className="text-[10px] px-2 py-0.5 bg-slate-400 text-white border-0 rounded-md">
                              Draft
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-2">
                          {doc.title}
                        </h3>

                        {/* Excerpt/Description */}
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {doc.excerpt ||
                            "Tidak ada deskripsi untuk snippet ini."}
                        </p>
                      </div>

                      {/* Footer: Difficulty, Visibility, Likes, Date */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-900">
                        <div className="flex items-center gap-2">
                          {/* Difficulty Badge */}
                          <Badge
                            className={`text-[10px] px-2 py-0.5 border-0 rounded-md ${difficultyBadge.color}`}
                          >
                            {difficultyBadge.emoji} {difficultyBadge.label}
                          </Badge>

                          {/* Visibility Indicator */}
                          <div className="flex items-center gap-1">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                doc.visibility === "public"
                                  ? "bg-green-500"
                                  : "bg-slate-400 dark:bg-slate-600"
                              }`}
                              title={
                                doc.visibility === "public"
                                  ? "Public"
                                  : "Private"
                              }
                            />
                            <span className="text-[10px] text-slate-500">
                              {doc.visibility === "public"
                                ? "Public"
                                : "Private"}
                            </span>
                          </div>
                        </div>

                        {/* Right Side: Likes + Date */}
                        <div className="flex items-center gap-3">
                          {/* Likes Counter */}
                          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500 group-hover:text-red-500 transition-colors">
                            <Heart className="h-3.5 w-3.5 fill-current" />
                            <span className="font-medium">
                              {doc.likes_count || 0}
                            </span>
                          </div>

                          {/* Date */}
                          <div className="flex items-center text-xs text-slate-500 dark:text-slate-500">
                            <Clock className="mr-1 h-3.5 w-3.5" />
                            {doc.created_at
                              ? new Date(doc.created_at).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                  }
                                )
                              : "-"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
