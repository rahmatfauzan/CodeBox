"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { FileText, Eye, Clock, ArrowRight, Globe, Lock } from "lucide-react";

interface RecentDocument {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null; // ✅ Allow null
  category: {
    name: string;
    icon?: string | null; // ✅ Allow null
    color?: string | null; // ✅ Allow null
  } | null; // ✅ Allow null category
  difficulty: string | null; // ✅ Allow null
  visibility: string | null; // ✅ Allow null
  view_count?: number | null; // ✅ Allow null
  reading_time?: number | null; // ✅ Allow null
  created_at: string | null; // ✅ Allow null
  updated_at: string | null; // ✅ Allow null
}

interface RecentDocumentsProps {
  documents: RecentDocument[];
}

export function RecentDocuments({ documents }: RecentDocumentsProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Recent Documents
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/documents" className="gap-2">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No documents yet</p>
              <Button className="mt-4" asChild>
                <Link href="/documents/new">Create Your First Document</Link>
              </Button>
            </div>
          ) : (
            documents.map((doc) => (
              <Link
                key={doc.id}
                href={`/documents/${doc.slug}`}
                className="block"
              >
                <div className="group p-4 rounded-lg border hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all cursor-pointer">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {doc.title}
                      </h4>
                      {doc.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {doc.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Visibility */}
                    {doc.visibility === "private" ? (
                      <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <Globe className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Category */}
                    {doc.category && (
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          borderColor: doc.category.color || "#6366f1",
                          color: doc.category.color || "#6366f1",
                        }}
                      >
                        {doc.category.icon} {doc.category.name}
                      </Badge>
                    )}

                    {/* Difficulty */}
                    {doc.difficulty && (
                      <Badge
                        className={`text-xs ${getDifficultyColor(
                          doc.difficulty
                        )}`}
                      >
                        {doc.difficulty}
                      </Badge>
                    )}

                    {/* Reading Time */}
                    {doc.reading_time && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {doc.reading_time} min
                      </span>
                    )}

                    {/* View Count */}
                    {doc.view_count && doc.view_count > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {doc.view_count}
                      </span>
                    )}

                    {/* Time Ago */}
                    {doc.updated_at && (
                      <span className="text-xs text-muted-foreground ml-auto">
                        {formatDistanceToNow(new Date(doc.updated_at), {
                          addSuffix: true,
                          locale: localeId,
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
