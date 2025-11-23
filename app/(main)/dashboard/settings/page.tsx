import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { SettingsProfileForm } from "./settings-profile-form";

export const metadata = {
  title: "Pengaturan Profil | CodeBox",
  description: "Kelola informasi profil dan akun Anda.",
};

export default async function SettingsPage() {
  const supabase = await createClient();

  // 1. Cek User Login
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Ambil Data Profil dari Database
  // Kita gunakan single() karena 1 user pasti cuma punya 1 profil
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Halaman */}
      <div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          Pengaturan Profil
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Informasi ini akan ditampilkan secara publik di halaman profil Anda.
        </p>
      </div>

      <Separator />

      {/* Render Form dengan Data Awal */}
      {/* Kita kirim 'user' (Auth) dan 'profile' (Database Public) */}
      <SettingsProfileForm user={user} profile={profile} />
    </div>
  );
}
