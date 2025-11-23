"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";

type ActionResponse = { success: true } | { success: false; error: string };

// --- TOGGLE LIKE ---
export async function toggleLikeAction(
  documentId: string
): Promise<ActionResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Harus login untuk menyukai." };
  }

  // Panggil RPC (Database Function)
  // Pastikan fungsi 'toggle_like' ada di database Supabase Anda
  // Argumen disesuaikan dengan definisi function di SQL
  const { error } = await supabase.rpc("toggle_like", {
    p_likeable_id: documentId,
    p_likeable_type: "document",
  });

  if (error) {
    console.error("Like Error:", error);
    return { success: false, error: error.message };
  }

  // Refresh data di halaman terkait agar icon & angka berubah
  revalidatePath("/explore");
  revalidatePath(`/snippet/[slug]`, "page");

  return { success: true };
}

// --- TOGGLE BOOKMARK ---
export async function toggleBookmarkAction(
  documentId: string
): Promise<ActionResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Harus login untuk menyimpan." };
  }

  // Panggil RPC
  const { error } = await supabase.rpc("toggle_bookmark", {
    p_bookmarkable_id: documentId,
    p_bookmarkable_type: "document",
  });

  if (error) {
    console.error("Bookmark Error:", error);
    return { success: false, error: error.message };
  }

  // Refresh halaman
  revalidatePath("/saved");
  revalidatePath(`/snippet/[slug]`, "page");

  return { success: true };
}
