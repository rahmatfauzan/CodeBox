"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  Sparkles,
  Terminal,
  Code2,
  ChevronDown,
  Zap,
  Lock,
  BrainCircuit,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { PublicDocumentCard } from "./(main)/(publick)/components/public-document-card";

interface LandingPageClientProps {
  trendingDocs: any[];
  user?: any; // Optional user prop
}

export default function LandingPageClient({
  trendingDocs,
  user,
}: LandingPageClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Fungsi Scroll ke bagian Trending
  const scrollToTrending = () => {
    const element = document.getElementById("trending");
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y - 50, behavior: "smooth" });
    }
  };

  console.log("User in LandingPageClient:", user);

  return (
    <div>
      {/* Gunakan user dari props jika ada */}
      <Navbar user={user} />

      <div className="flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
        {/* --- BACKGROUND EFFECTS --- */}
        <div className="absolute inset-0 bg-white dark:bg-slate-950 -z-50"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/20 dark:bg-purple-600/10 rounded-full blur-[120px] -z-40 pointer-events-none opacity-70 mix-blend-multiply dark:mix-blend-normal" />
        <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/20 dark:bg-cyan-600/10 rounded-full blur-[120px] -z-40 pointer-events-none opacity-70" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-40 pointer-events-none" />

        {/* --- SECTION 1: HERO --- */}
        <section className="relative pt-32 pb-10 px-4 flex flex-col items-center text-center z-10 min-h-[90vh] justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 backdrop-blur-md">
            <Terminal className="w-3 h-3 text-indigo-500" />
            <span>Personal Code Repository</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-5xl mb-6 leading-[1.1] md:leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
            Simpan, Atur, & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              Gunakan Kembali.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Satu tempat terpusat untuk semua snippet kode, konfigurasi, dan
            catatan teknis Anda. Tidak perlu lagi mencari ulang solusi yang
            pernah Anda buat.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-xl relative mb-10 group animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <Input
                type="text"
                placeholder="Cari snippet (ex: navbar react)..."
                className="pl-12 h-16 rounded-full border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-full bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white px-6 h-11"
                >
                  Cari
                </Button>
              </div>
            </div>
          </form>

          {/* Popular Tags */}
          <div className="flex flex-wrap justify-center gap-3 text-sm animate-in fade-in duration-1000 delay-200 mb-20">
            {["React", "Tailwind", "Python", "Next.js"].map((tag) => (
              <Link key={tag} href={`/explore?q=${tag}`}>
                <span className="px-3 py-1.5 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-500 hover:text-indigo-500 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-all cursor-pointer font-medium backdrop-blur-sm">
                  #{tag}
                </span>
              </Link>
            ))}
          </div>

          {/* Scroll Down Arrow */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
            onClick={scrollToTrending}
          >
            <ChevronDown className="w-8 h-8 text-slate-400 dark:text-slate-600 opacity-70 hover:text-indigo-500 hover:opacity-100 transition-all" />
          </motion.div>
        </section>

        {/* --- SECTION 2: TRENDING SNIPPETS --- */}
        <section id="trending" className="px-4 relative z-10 pb-20 pt-10">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-end mb-10 px-2">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  Trending Minggu Ini
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Snippet paling populer dari komunitas.
                </p>
              </div>
              <Link
                href="/explore"
                className="group text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1 transition-colors"
              >
                Lihat Semua
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Render Kartu Data */}
            {trendingDocs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingDocs.map((doc) => (
                  <PublicDocumentCard key={doc.id} doc={doc} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <Code2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Belum ada snippet trending saat ini.</p>
              </div>
            )}
          </div>
        </section>

        {/* --- SECTION 3: WHY CHOOSE US (FITUR) --- */}
        <section className="py-20 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
          <div className="container mx-auto max-w-6xl px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-12">
              Kenapa menyimpan di sini?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Fitur 1 */}
              <div className="flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">
                  Akses Cepat
                </h3>
                <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                  Cari snippet dalam hitungan milidetik. Tidak perlu loading
                  lama atau iklan mengganggu.
                </p>
              </div>

              {/* Fitur 2 */}
              <div className="flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">
                  Private by Default
                </h3>
                <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                  Kode Anda adalah milik Anda. Setel ke Private untuk snippet
                  rahasia, atau Public untuk berbagi.
                </p>
              </div>

              {/* Fitur 3 */}
              <div className="flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">
                  AI Assistant
                </h3>
                <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                  Biarkan AI menuliskan dokumentasi dan penjelasan untuk kode
                  yang Anda simpan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 4: TECH STACK SUPPORT --- */}
        <section className="py-20 border-t border-slate-200 dark:border-slate-800 relative overflow-hidden">
          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-8">
              Works with any syntax
            </p>

            <div className="flex flex-wrap justify-center gap-3 opacity-80">
              {[
                "JavaScript",
                "TypeScript",
                "Python",
                "Go",
                "Rust",
                "PHP",
                "Laravel",
                "Java",
                "Kotlin",
                "Swift",
                "HTML",
                "CSS",
                "Tailwind",
                "SQL",
                "Docker",
                "Bash",
              ].map((lang) => (
                <div
                  key={lang}
                  className="px-4 py-2 bg-white dark:bg-slate-900 rounded-lg text-sm font-mono font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 select-none hover:border-indigo-500 hover:text-indigo-500 transition-colors shadow-sm cursor-default"
                >
                  {lang}
                </div>
              ))}
              <div className="px-4 py-2 text-sm text-slate-400 italic font-medium">
                + 100 more
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 5: FAQ --- */}
        <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-8 h-8 text-indigo-500" /> FAQ
            </h2>

            <div className="space-y-4">
              {/* FAQ Item 1 */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
                  Apakah kode saya aman/privat?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  Ya. Secara default, setiap snippet yang Anda buat bersifat{" "}
                  <strong>Private</strong>. Hanya Anda yang bisa melihatnya.
                  Anda harus secara manual mengubahnya menjadi Public jika ingin
                  membagikannya.
                </p>
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
                  Bisakah saya mengexport data saya?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  Tentu. Kami percaya pada <em>Data Ownership</em>. Anda bisa
                  mengekspor seluruh snippet Anda ke format JSON atau Markdown
                  kapan saja untuk backup atau migrasi.
                </p>
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
                  Apakah ini gratis?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  CodeBox 100% Gratis untuk penggunaan personal dengan batas
                  penyimpanan yang sangat lega. Fitur berbayar (nanti) hanya
                  untuk kolaborasi tim atau fitur AI tingkat lanjut.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 6: FINAL CTA --- */}
        <section className="py-32 px-4 text-center relative overflow-hidden border-t border-slate-200 dark:border-slate-800">
          {/* Glow background khusus section ini */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/10 dark:bg-indigo-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

          <div className="container mx-auto max-w-2xl relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">
              Mulai bangun <br />
              <span className="text-indigo-600 dark:text-indigo-400">
                perpustakaan Anda.
              </span>
            </h2>

            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
              Simpan snippet pertama Anda hari ini. Dokumentasikan perjalanan
              coding Anda agar lebih terorganisir dan mudah diakses kapan saja.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 font-bold px-8 h-12 text-base shadow-xl shadow-indigo-500/20"
                >
                  Buat Akun Gratis
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-full border-slate-300 dark:border-slate-700 h-12 px-8 text-base hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Lihat Contoh
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
