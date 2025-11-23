import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // 1. CASE A: Token Hash (Link tipe lama / Magic Link / Recovery)
  if (token_hash && type) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error && data.user) {
      // Buat profile jika belum ada (untuk email verification)
      await createProfileIfNotExists(data.user);

      const redirectTo = request.nextUrl.clone();

      // Logika Redirect Berdasarkan Tipe
      if (type === "signup") {
        redirectTo.pathname = "/verify-email/verify-success";
      } else if (type === "recovery") {
        redirectTo.pathname = "/update-password";
      } else {
        redirectTo.pathname = next;
      }

      // Bersihkan URL
      redirectTo.searchParams.delete("token_hash");
      redirectTo.searchParams.delete("type");
      redirectTo.searchParams.delete("next");

      return NextResponse.redirect(redirectTo);
    }
  }

  // 2. CASE B: Code Exchange (PKCE - Register Baru & OAuth)
  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // 🔥 PENTING: Buat profile jika belum ada (untuk OAuth seperti Google)
      await createProfileIfNotExists(data.user);

      const redirectTo = request.nextUrl.clone();

      // Cek apakah ada titipan tujuan di parameter 'next'
      if (next === "/verify-success") {
        redirectTo.pathname = "/verify-email/verify-success";
      } else if (next === "/update-password") {
        redirectTo.pathname = "/update-password";
      } else {
        redirectTo.pathname = "/dashboard"; // Default (misal Google Login)
      }

      redirectTo.searchParams.delete("code");
      redirectTo.searchParams.delete("next");

      return NextResponse.redirect(redirectTo);
    }
  }

  // 3. CASE C: Error
  const errorUrl = request.nextUrl.clone();
  errorUrl.pathname = "/verify-email/verify-error";
  errorUrl.searchParams.set("error", "invalid_token");

  return NextResponse.redirect(errorUrl);
}

// 🔥 HELPER FUNCTION: Buat profile otomatis jika belum ada
async function createProfileIfNotExists(user: any) {
  try {
    const supabase = await createClient();

    // Cek apakah profile sudah ada
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    // Jika sudah ada, skip
    if (existingProfile) {
      console.log("✅ Profile already exists for user:", user.id);
      return;
    }

    let avatarUrl =
      user.user_metadata?.avatar_url || // GitHub biasanya ini
      user.user_metadata?.picture || // Google biasanya ini
      user.user_metadata?.avatar || // Provider lain
      "";

    // Jika kosong, pakai DiceBear (Inisial Nama)
    if (!avatarUrl) {
      const seed = user.email || "user";
      avatarUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=indigo,purple,blue`;
    }

    // Generate username dari berbagai sumber metadata (Google, GitHub, dll)
    let baseUsername =
      user.user_metadata?.username ||
      user.user_metadata?.user_name ||
      user.user_metadata?.preferred_username ||
      user.email?.split("@")[0] ||
      `user_${user.id.substring(0, 8)}`;

    // Pastikan username unik
    let finalUsername = baseUsername;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const { data: existingUsername } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", finalUsername)
        .maybeSingle();

      if (!existingUsername) {
        break; // Username unik, keluar dari loop
      }

      // Username sudah ada, tambahkan angka random
      finalUsername = `${baseUsername}_${Math.floor(Math.random() * 10000)}`;
      attempts++;
    }

    // Buat profile baru
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      username: finalUsername,
      full_name:
        user.user_metadata?.full_name || user.user_metadata?.name || "",
      avatar_url: avatarUrl,
      bio: "",
      website: "",
      github_url: "",
      twitter_url: "",
      linkedin_url: "",
      role: "creator",
      is_verified: user.user_metadata?.email_verified === true || false,
      docs_count: 0,
      snippets_count: 0,
    });

    if (insertError) {
      console.error("❌ Error creating profile:", insertError);
      // Tidak throw error agar auth tetap berhasil
      // User bisa buat profile manual nanti jika perlu
    } else {
      console.log("✅ Profile created successfully:", {
        userId: user.id,
        username: finalUsername,
      });
    }
  } catch (err) {
    console.error("❌ Unexpected error in createProfileIfNotExists:", err);
    // Tidak throw error agar auth tetap berhasil
  }
}
