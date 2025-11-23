"use client";

import { Heart, Bookmark, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEngagement } from "@/lib/hooks/use-interactions";

interface SnippetActionsProps {
  documentId: string;
  initialLiked?: boolean;
  initialBookmarked?: boolean;
  likeCount: number;
  bookmarkCount: number;
}

export function SnippetActions({
  documentId,
  initialLiked = false,
  initialBookmarked = false,
  likeCount: initialLikeCount,
  bookmarkCount: initialBookmarkCount,
}: SnippetActionsProps) {
  const {
    isLiked,
    isBookmarked,
    likeCount,
    bookmarkCount,
    isPendingLike,
    isPendingBookmark,
    toggleLike,
    toggleBookmark,
  } = useEngagement({
    documentId,
    initialLiked,
    initialBookmarked,
    initialLikeCount,
    initialBookmarkCount,
  });

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: url,
        });
        toast.success("Berhasil dibagikan!");
      } catch (error) {
        // User cancelled, do nothing
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link disalin ke clipboard!");
      } catch (error) {
        toast.error("Gagal menyalin link");
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Like Button */}
      <Button
        onClick={toggleLike}
        disabled={isPendingLike}
        variant={isLiked ? "default" : "outline"}
        className={`gap-2 transition-all ${
          isLiked
            ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
            : "border-slate-300 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 hover:border-red-300"
        }`}
      >
        {isPendingLike ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        )}
        {isLiked ? "Liked" : "Like"} ({likeCount})
      </Button>

      {/* Bookmark Button */}
      <Button
        onClick={toggleBookmark}
        disabled={isPendingBookmark}
        variant={isBookmarked ? "default" : "outline"}
        className={`gap-2 transition-all ${
          isBookmarked
            ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
            : "border-slate-300 dark:border-slate-700 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 hover:text-yellow-600 hover:border-yellow-300"
        }`}
      >
        {isPendingBookmark ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Bookmark
            className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
          />
        )}
        {isBookmarked ? "Tersimpan" : "Simpan"} ({bookmarkCount})
      </Button>

      {/* Share Button */}
      <Button
        onClick={handleShare}
        variant="outline"
        className="gap-2 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
      >
        <Share2 className="h-4 w-4" />
        Bagikan
      </Button>
    </div>
  );
}
