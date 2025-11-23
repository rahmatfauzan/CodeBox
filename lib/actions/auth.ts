"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Provider } from "@supabase/supabase-js";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/validations/auth";
import { createClient } from "../supabase/server";

type AuthResponse =
  | { success: true; error?: never }
  | { success: false; error: string };

// --- HELPER: CREATE PROFILE ---
async function ensureProfileExists(userId: string, metadata: any) {
  const supabase = await createClient();

  // Cek apakah profile sudah ada
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (existingProfile) return;

  // Generate username unik
  let username = metadata?.username || "";
  let finalUsername = username;
  let attempts = 0;

  while (attempts < 10) {
    const { data: existingUsername } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", finalUsername)
      .maybeSingle();

    if (!existingUsername) break;

    finalUsername = `${username}_${Math.floor(Math.random() * 10000)}`;
    attempts++;
  }

  // Insert profile
  await supabase.from("profiles").insert({
    id: userId,
    username: finalUsername,
    full_name: metadata?.full_name || "",
    avatar_url: metadata?.avatar_url || metadata?.picture || "",
    role: "user",
    is_verified: false,
    docs_count: 0,
    snippets_count: 0,
  });
}

// --- 1. REGISTER ---
export async function registerAction(
  data: RegisterInput
): Promise<AuthResponse> {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: "Format data tidak valid" };

  const supabase = await createClient();
  const { email, password, username } = parsed.data;

  // Cek Username Unik
  const { data: existingUser } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .single();

  if (existingUser) {
    return { success: false, error: "Username sudah digunakan user lain." };
  }

  const headersList = await headers();
  const origin =
    headersList.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  // Sign Up
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, full_name: "" },
      emailRedirectTo: `${origin}/auth/callback?next=/verify-success`,
    },
  });

  if (error) {
    if (
      error.message.includes("already registered") ||
      error.code === "user_already_exists"
    ) {
      return { success: false, error: "Email sudah terdaftar. Silakan login." };
    }
    return { success: false, error: error.message };
  }

  // Buat profile setelah sign up berhasil (untuk email/password)
  if (authData.user) {
    try {
      await ensureProfileExists(authData.user.id, { username, full_name: "" });
    } catch (err) {
      console.error("Error creating profile after signup:", err);
    }
  }

  return { success: true };
}

// --- 2. LOGIN ---
export async function loginAction(data: LoginInput): Promise<AuthResponse> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: "Format data tidak valid" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { success: false, error: "Email atau password salah." };

  return { success: true };
}

// --- 3. OAUTH (GOOGLE/GITHUB) ---
export async function oAuthLoginAction(provider: Provider) {
  const supabase = await createClient();
  const headersList = await headers();
  const origin =
    headersList.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) redirect("/login?error=oauth_failed");
  if (data.url) redirect(data.url);
}

// --- 4. LOGOUT ---
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// --- 5. FORGOT PASSWORD ---
export async function forgotPasswordAction(
  email: string
): Promise<AuthResponse> {
  const parsed = forgotPasswordSchema.safeParse({ email });
  if (!parsed.success) return { success: false, error: "Format email invalid" };

  const supabase = await createClient();
  const headersList = await headers();
  const origin =
    headersList.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// --- 6. UPDATE PASSWORD ---
export async function updatePasswordAction(
  password: string
): Promise<AuthResponse> {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { success: false, error: "Gagal update password." };
  return { success: true };
}

// --- 7. RESEND VERIFICATION ---
export async function resendVerificationAction(
  email: string
): Promise<AuthResponse> {
  const supabase = await createClient();
  const { error } = await supabase.auth.resend({ type: "signup", email });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
