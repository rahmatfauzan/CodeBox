"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { toggleBookmarkAction, toggleLikeAction } from "../actions/interactions";

interface UseEngagementProps {
  documentId: string;
  initialLiked?: boolean;
  initialBookmarked?: boolean;
  initialLikeCount: number;
  initialBookmarkCount: number;
}

export function useEngagement({
  documentId,
  initialLiked = false,
  initialBookmarked = false,
  initialLikeCount,
  initialBookmarkCount,
}: UseEngagementProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarkCount);
  const [isPendingLike, startLikeTransition] = useTransition();
  const [isPendingBookmark, startBookmarkTransition] = useTransition();

  const toggleLike = () => {
    // Optimistic update
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    startLikeTransition(async () => {
      const result = await toggleLikeAction(documentId);

      if (!result.success) {
        // Revert on error
        setIsLiked(wasLiked);
        setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
        toast.error(result.error);
      } else {
        toast.success(wasLiked ? "Like dihapus" : "Snippet disukai!");
      }
    });
  };

  const toggleBookmark = () => {
    // Optimistic update
    const wasBookmarked = isBookmarked;
    setIsBookmarked(!wasBookmarked);
    setBookmarkCount((prev) => (wasBookmarked ? prev - 1 : prev + 1));

    startBookmarkTransition(async () => {
      const result = await toggleBookmarkAction(documentId);

      if (!result.success) {
        // Revert on error
        setIsBookmarked(wasBookmarked);
        setBookmarkCount((prev) => (wasBookmarked ? prev + 1 : prev - 1));
        toast.error(result.error);
      } else {
        toast.success(wasBookmarked ? "Bookmark dihapus" : "Snippet disimpan!");
      }
    });
  };

  return {
    isLiked,
    isBookmarked,
    likeCount,
    bookmarkCount,
    isPendingLike,
    isPendingBookmark,
    toggleLike,
    toggleBookmark,
  };
}
