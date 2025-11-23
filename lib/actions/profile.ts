"use server";

import { revalidatePath } from "next/cache";
import { ProfileUpdateData, profileUpdateSchema } from "../validations";
import { createClient } from "../supabase/server";
// 👇 Import Schema Anda

type ActionResponse = { success: true } | { success: false; error: string };

export async function updateProfileAction(
  data: ProfileUpdateData
): Promise<ActionResponse> {
  // 1. Validasi Server Side
  const parsed = profileUpdateSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: "Format data tidak valid" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  // 2. Cek Username Unik (Jika user mengganti username)
  if (data.username) {
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", data.username)
      .neq("id", user.id)
      .single();

    if (existingUser) {
      return { success: false, error: "Username sudah digunakan orang lain." };
    }
  }

  // 3. Update Database (Termasuk Social Links)
  const { error } = await supabase
    .from("profiles")
    .update({
      username: data.username,
      full_name: data.full_name,
      bio: data.bio,
      website: data.website,
      avatar_url: data.avatar_url,
      // Tambahan field dari schema Anda:
      github_url: data.github_url,
      twitter_url: data.twitter_url,
      linkedin_url: data.linkedin_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { success: false, error: error.message };

  // 4. Update Auth Metadata (Agar sesi tetap sinkron)
  const { error: authError } = await supabase.auth.updateUser({
    data: {
      full_name: data.full_name,
      username: data.username,
      avatar_url: data.avatar_url,
    },
  });

  if (authError) console.error("Auth Update Error:", authError);

  // 5. Revalidate
  revalidatePath("/dashboard");
  revalidatePath("/settings");
  if (data.username) revalidatePath(`/u/${data.username}`);

  return { success: true };
}
