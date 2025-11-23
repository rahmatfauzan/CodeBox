import Link from "next/link";
import { Clock, Code2, Eye, Heart, Bookmark, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PublicCardProps {
  doc: any;
}

// Helper format number
function formatNumber(num: number): string {
  if (num >= 1000000)
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return num.toString();
}

// Helper difficulty style
function getDifficultyStyle(difficulty: string) {
  const styles = {
    beginner: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
      dot: "bg-green-500",
    },
    intermediate: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-700 dark:text-yellow-400",
      border: "border-yellow-200 dark:border-yellow-800",
      dot: "bg-yellow-500",
    },
    advanced: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
      dot: "bg-red-500",
    },
  };
  return styles[difficulty as keyof typeof styles] || styles.beginner;
}

export function PublicDocumentCard({ doc }: PublicCardProps) {
  const author = doc.author || {};
  const authorName = author.full_name || author.username || "Anonymous";
  const authorInitials = authorName.charAt(0).toUpperCase();
  const difficulty = getDifficultyStyle(doc.difficulty || "beginner");

  return (
    <Link href={`/${doc.slug}`}>
      <Card className="group h-full border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-600 hover:scale-[1.02] transition-all duration-300 overflow-hidden flex flex-col rounded-xl">
        <CardContent className="p-5 flex-1 flex flex-col gap-4">
          {/* 1. Header: Author & Difficulty Badge */}
          <div className="flex items-center justify-between">
            {/* Author */}
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-blue-100 dark:border-blue-900/30 ring-2 ring-blue-500/20">
                <AvatarImage src={author.avatar_url} />
                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                    {authorName}
                  </span>
                  {author.is_verified && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 fill-blue-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Difficulty Badge */}
            <Badge
              className={`text-[10px] px-2 py-1 border ${difficulty.bg} ${difficulty.text} ${difficulty.border}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full mr-1.5 ${difficulty.dot}`}
              />
              {doc.difficulty === "beginner"
                ? "Pemula"
                : doc.difficulty === "intermediate"
                ? "Menengah"
                : "Mahir"}
            </Badge>
          </div>

          {/* 2. Content: Title & Excerpt */}
          <div className="flex-1 space-y-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {doc.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {doc.excerpt || "Tidak ada deskripsi singkat untuk snippet ini."}
            </p>
          </div>

          {/* 3. Footer: Stats & Category */}
          <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-900 space-y-3">
            {/* Stats Row */}
            <div className="flex items-center justify-between text-xs">
              {/* Left: Engagement Stats */}
              <div className="flex items-center gap-3">
                {/* Views */}
                <div
                  className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="Views"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span className="font-medium">
                    {formatNumber(doc.view_count || 0)}
                  </span>
                </div>

                {/* Likes */}
                <div
                  className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  title="Likes"
                >
                  <Heart className="h-3.5 w-3.5" />
                  <span className="font-medium">
                    {formatNumber(doc.like_count || 0)}
                  </span>
                </div>

                {/* Bookmarks */}
                <div
                  className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                  title="Bookmarks"
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  <span className="font-medium">
                    {formatNumber(doc.bookmark_count || 0)}
                  </span>
                </div>
              </div>

              {/* Right: Reading Time */}
              <div
                className="flex items-center gap-1 text-slate-500 dark:text-slate-400"
                title="Reading Time"
              >
                <Clock className="h-3.5 w-3.5" />
                <span className="font-medium">{doc.reading_time || 5} min</span>
              </div>
            </div>

            {/* Category Badge */}
            <Badge
              variant="secondary"
              className="text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-2.5 py-1"
            >
              {doc.category?.icon && (
                <span className="mr-1.5">{doc.category.icon}</span>
              )}
              <Code2 className="h-3 w-3 mr-1.5" />
              {doc.category?.name || "Code"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
