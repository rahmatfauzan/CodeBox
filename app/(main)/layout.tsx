import { ConditionalNavbar } from "@/components/layout/conditional-navbar"; // Import Wrapper tadi
import ScrollTop from "@/components/ui/scroll-top";
import { createClient } from "@/lib/supabase/server";

export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // 1. Cek User
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      {/* Gunakan ConditionalNavbar pengganti Navbar biasa */}
      <ConditionalNavbar user={user} />

      {/* Konten Utama */}
      <main>{children}</main>

      <ScrollTop />
    </div>
  );
}
