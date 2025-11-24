import { Skeleton } from "@/components/ui/skeleton";

export default function SnippetLoading() {
  return (
    <div className="container mx-auto max-w-6xl px-4 mt-5 pb-20">
      {/* Back Button Skeleton */}
      <Skeleton className="h-9 w-24 mb-6" />

      {/* Header Section */}
      <div className="space-y-6 mb-10">
        {/* Badge Row */}
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-28 rounded-full" />
        </div>

        {/* Title */}
        <Skeleton className="h-12 w-full max-w-2xl" />

        {/* Excerpt */}
        <div className="border-l-4 border-slate-300 dark:border-slate-700 pl-4 py-1">
          <Skeleton className="h-5 w-full max-w-3xl mb-2" />
          <Skeleton className="h-5 w-2/3 max-w-2xl" />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-full" />
          ))}
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-4 ml-auto">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>

      {/* Separator */}
      <Skeleton className="h-px w-full my-8" />

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-20 rounded-md" />
        </div>
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>

      {/* Separator */}
      <Skeleton className="h-px w-full my-8" />

      {/* Code Viewer Skeleton */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Code Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
        {/* Code Content */}
        <div className="p-4 space-y-2 bg-slate-50 dark:bg-slate-900">
          {[...Array(15)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-4"
              style={{ width: `${Math.random() * 40 + 40}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
