import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Github,
  Twitter,
  Linkedin,
  Edit,
  Code2,
  Heart,
  Eye,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { PublicDocumentCard } from "../../components/public-document-card";
interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;
  return {
    title: `${username} | CodeBox Profile`,
    description: `Lihat koleksi kode dan snippet dari ${username}.`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const supabase = await createClient();

  // 1. Cek User yang sedang Login (Untuk logika tombol Edit)
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  // 2. Fetch Data Profil Target
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  console.log(profileError);

  if (profileError || !profile) {
    return notFound(); // 404 jika username tidak ditemukan
  }

  const isOwnProfile = currentUser?.id === profile.id;

  // 3. Fetch Snippet Publik Milik User Ini
  const { data: rawDocuments } = await supabase
    .from("documents_with_details")
    .select("*")
    .eq("author_id", profile.id)
    .eq("status", "published") // Hanya yang Published
    .eq("visibility", "public") // Hanya yang Public
    .order("created_at", { ascending: false });

  // Data Mapping untuk Card
  const documents =
    rawDocuments?.map((doc) => ({
      ...doc,
      author: {
        full_name: profile.full_name,
        username: profile.username,
        avatar_url: profile.avatar_url,
        is_verified: profile.is_verified,
      },
      category: {
        name: doc.category_name,
        icon: doc.category_icon,
      },
    })) || [];

  // Hitung Statistik Sederhana
  const totalSnippets = documents.length;
  const totalLikes = documents.reduce(
    (acc, doc) => acc + (doc.like_count || 0),
    0
  );
  const totalViews = documents.reduce(
    (acc, doc) => acc + (doc.view_count || 0),
    0
  );

  const initials = (profile.full_name || profile.username || "U")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/50">
      {/* --- HEADER PROFIL --- */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar Besar */}
            <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-900 shadow-xl bg-slate-100">
              <AvatarImage
                src={profile.avatar_url || ""}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Info User */}
            <div className="flex-1 space-y-4 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {profile.full_name}
                    {/* Badge Verified (Opsional) */}
                    {/* <CheckCircle2 className="h-5 w-5 text-blue-500 fill-blue-500/10" /> */}
                  </h1>
                  <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
                    @{profile.username}
                  </p>
                </div>

                {/* Tombol Aksi */}
                {isOwnProfile ? (
                  <Link href="/dashboard/settings">
                    <Button variant="outline" className="gap-2">
                      <Edit className="h-4 w-4" /> Edit Profil
                    </Button>
                  </Link>
                ) : (
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                    Follow
                  </Button>
                )}
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="max-w-2xl text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                  {profile.bio}
                </p>
              )}

              {/* Meta Info & Socials */}
              <div className="flex flex-wrap gap-4 text-sm text-slate-500 pt-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined{" "}
                    {new Date(profile.created_at || "").toLocaleDateString(
                      "id-ID",
                      { month: "long", year: "numeric" }
                    )}
                  </span>
                </div>

                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-indigo-500 transition-colors"
                  >
                    <LinkIcon className="h-4 w-4" />
                    <span className="truncate max-w-[200px]">
                      {profile.website.replace(/^https?:\/\//, "")}
                    </span>
                  </a>
                )}

                {/* Social Icons (Hanya muncul jika ada di DB) */}
                <div className="flex items-center gap-3 ml-auto sm:ml-4 border-l border-slate-200 dark:border-slate-800 pl-4">
                  {profile.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      className="hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {profile.twitter_url && (
                    <a
                      href={profile.twitter_url}
                      target="_blank"
                      className="hover:text-blue-400 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      className="hover:text-blue-600 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar (Opsional tapi Keren) */}
          <div className="grid grid-cols-3 sm:flex sm:gap-8 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-indigo-500" />
              <span className="font-bold text-slate-900 dark:text-white">
                {totalSnippets}
              </span>
              <span className="text-slate-500 text-sm">Snippets</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="font-bold text-slate-900 dark:text-white">
                {totalLikes}
              </span>
              <span className="text-slate-500 text-sm">Likes</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <span className="font-bold text-slate-900 dark:text-white">
                {totalViews}
              </span>
              <span className="text-slate-500 text-sm">Views</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Publikasi ({documents.length})
          </h2>
          {/* Bisa tambah filter/search disini nanti */}
        </div>

        {documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <PublicDocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        ) : (
          // Empty State Profile
          <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950">
            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-full inline-flex mb-4">
              <User className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Belum ada snippet publik
            </h3>
            <p className="text-slate-500 mt-1 max-w-sm mx-auto">
              {isOwnProfile
                ? "Anda belum mempublikasikan snippet apapun. Ubah visibilitas snippet Anda menjadi Public agar muncul di sini."
                : "User ini belum membagikan kode apapun ke publik."}
            </p>
            {isOwnProfile && (
              <Link href="/documents/new" className="mt-6 inline-block">
                <Button>Buat Snippet Baru</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
