import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Code2,
  ArrowLeft,
  User,
  Bookmark,
  Globe,
  Lock,
  Gauge,
  Tag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { CodeViewer } from "../../dashboard/components/code-viewer";
import { SnippetActions } from "../components/marketing/snippets-actions";
import { BackButton } from "@/components/ui/back-button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Fetch data lengkap untuk Metadata
  // Kita butuh author dan keywords juga
  const { data: doc } = await supabase
    .from("documents")
    .select(
      `
      title,
      excerpt,
      meta_title,
      meta_description,
      meta_keywords,
      thumbnail_url,
      created_at,
      updated_at,
      author:profiles(full_name, username)
    `
    )
    .eq("slug", slug)
    .single();

  if (!doc) {
    return {
      title: "Snippet Not Found | CodeBox",
      description: "The snippet you are looking for does not exist.",
    };
  }

  // 2. Siapkan Variabel Meta
  const title = doc.meta_title || doc.title;
  const description =
    doc.meta_description ||
    doc.excerpt ||
    `Lihat kode ${doc.title} di CodeBox.`;
  const authorName =
    (doc.author as any)?.full_name ||
    (doc.author as any)?.username ||
    "CodeBox User";
  const keywords = doc.meta_keywords || [
    "code",
    "snippet",
    "developer",
    "programming",
  ];
  const images = doc.thumbnail_url ? [{ url: doc.thumbnail_url }] : []; // Atau masukkan URL gambar default logo CodeBox

  // 3. Return Metadata Object
  return {
    title: `${title} | CodeBox`,
    description: description,
    keywords: keywords,
    authors: [{ name: authorName }],
    openGraph: {
      title: title,
      description: description,
      type: "article",
      publishedTime: doc.created_at,
      modifiedTime: doc.updated_at,
      authors: [authorName],
      images: images,
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: images,
    },
  };
}

export default async function PublicSnippetPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Get current user (if logged in)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch document dengan join
  const { data: doc, error } = await supabase
    .from("documents")
    .select(
      `
      *,
      category:categories(name, icon),
      author:profiles(
        full_name,
        username,
        avatar_url,
        is_verified
      )
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .eq("visibility", "public")
    .single();

  if (error || !doc) {
    console.error("Error fetching doc:", error);
    return notFound();
  }

  // Fetch tags separately (many-to-many relationship)
  const { data: documentTags } = await supabase
    .from("document_tags")
    .select(
      `
      tag:tags(id, name, slug)
    `
    )
    .eq("document_id", doc.id);

  const tags = documentTags?.map((dt: any) => dt.tag).filter(Boolean) || [];

  // Check if user has liked/bookmarked (only if logged in)
  let hasLiked = false;
  let hasBookmarked = false;

  if (user) {
    // Check like status
    const { data: likeData } = await supabase
      .from("likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("likeable_id", doc.id)
      .eq("likeable_type", "document")
      .maybeSingle();
    hasLiked = !!likeData;

    // Check bookmark status
    const { data: bookmarkData } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("bookmarkable_id", doc.id)
      .eq("bookmarkable_type", "document")
      .maybeSingle();
    hasBookmarked = !!bookmarkData;
  }

  // Mapping author data
  const authorData = doc.author as any;
  const author = {
    name: authorData?.full_name || authorData?.username || "Anonymous",
    username: authorData?.username || "anonymous",
    avatar: authorData?.avatar_url,
    verified: authorData?.is_verified || false,
    initial: (authorData?.full_name || authorData?.username || "A")
      .charAt(0)
      .toUpperCase(),
  };

  // Category
  const categoryData = doc.category as any;
  const categoryName = categoryData?.name || "Code";
  const categoryIcon = categoryData?.icon;

  // Difficulty colors
  const difficultyColor = {
    beginner:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    intermediate:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  // Format number
  const formatNumber = (num: number) => {
    if (num >= 1000000)
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return num?.toString() || "0";
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 mt-5 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 ">
      {/* Back Button */}
      <BackButton/>
      {/* Header Section */}
      <div className="space-y-6 mb-10">
        {/* Badge Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category */}
          <Badge
            variant="secondary"
            className="gap-1.5 py-1 px-3 text-sm font-medium bg-slate-100 dark:bg-slate-800"
          >
            {categoryIcon && <span>{categoryIcon}</span>}
            <Code2 className="h-3.5 w-3.5" />
            {categoryName}
          </Badge>

          {/* Visibility */}
          <Badge
            variant="outline"
            className="gap-1.5 py-1 px-3 border-slate-300 dark:border-slate-700"
          >
            {doc.visibility === "public" ? (
              <Globe className="h-3.5 w-3.5 text-blue-500" />
            ) : (
              <Lock className="h-3.5 w-3.5 text-amber-500" />
            )}
            {doc.visibility === "public" ? "Public" : "Private"}
          </Badge>

          {/* Difficulty */}
          {doc.difficulty && (
            <Badge
              className={`gap-1.5 py-1 px-3 border-0 ${
                difficultyColor[doc.difficulty as keyof typeof difficultyColor]
              }`}
            >
              <Gauge className="h-3.5 w-3.5" />
              <span className="capitalize">{doc.difficulty}</span>
            </Badge>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          {doc.title}
        </h1>

        {/* Excerpt */}
        {doc.excerpt && (
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl border-l-4 border-blue-500 pl-4 py-1 bg-slate-50 dark:bg-slate-900/50 rounded-r-lg">
            {doc.excerpt}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            {tags.map((tag: any) => (
              <Link key={tag.id} href={`/explore?tag=${tag.slug}`}>
                <Badge
                  variant="outline"
                  className="text-xs px-2.5 py-1 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-800 hover:text-blue-700 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  #{tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400 pt-2">
          {/* Author */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 border border-slate-200 dark:border-slate-700">
              <AvatarImage src={author.avatar || undefined} />
              <AvatarFallback className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {author.initial}
              </AvatarFallback>
            </Avatar>
            <span>Oleh {author.name}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {new Date(
              doc.published_at || doc.created_at || ""
            ).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>

          {/* Reading Time */}
          {doc.reading_time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {doc.reading_time} menit baca
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-1" title="Views">
              <Eye className="h-4 w-4" />
              <span>{formatNumber(doc.view_count || 0)}</span>
            </div>
            <div className="flex items-center gap-1" title="Likes">
              <Heart className="h-4 w-4" />
              <span>{formatNumber(doc.like_count || 0)}</span>
            </div>
            <div className="flex items-center gap-1" title="Bookmarks">
              <Bookmark className="h-4 w-4" />
              <span>{formatNumber(doc.bookmark_count || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <SnippetActions
          documentId={doc.id}
          initialLiked={hasLiked}
          initialBookmarked={hasBookmarked}
          likeCount={doc.like_count || 0}
          bookmarkCount={doc.bookmark_count || 0}
        />

        <Link href={`/u/${author.username}`}>
          <Button variant="outline" className="gap-2">
            <User className="h-4 w-4" />
            Lihat Profil Author
          </Button>
        </Link>
      </div>

      <Separator className="my-8" />

      {/* Code Viewer */}
      <div className="min-h-[400px]">
        {doc.content ? (
          <CodeViewer content={doc.content} />
        ) : (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <Code2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Tidak ada konten untuk ditampilkan</p>
          </div>
        )}
      </div>
    </div>
  );
}
