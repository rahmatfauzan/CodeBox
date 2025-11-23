"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  documentFormSchema,
  transformFormToDatabase,
  updateDocumentFormSchema,
  transformUpdateFormToDatabase,
  deleteDocumentSchema,
  type DocumentFormValues,
  type UpdateDocumentFormValues,
} from "@/lib/validations/documents";
import { createClient } from "../supabase/server";

type ActionResponse =
  | { success: true; data?: any }
  | { success: false; error: string };

// --- HELPER TAGS ---
async function processTags(supabase: any, documentId: string, tags: string[]) {
  if (!tags || tags.length === 0) return;

  const tagIds: string[] = [];

  for (const tagName of tags) {
    const slug = tagName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    // 1. Cek / Buat Tag
    const { data: existingTag } = await supabase
      .from("tags")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existingTag) {
      tagIds.push(existingTag.id);
    } else {
      const { data: newTag } = await supabase
        .from("tags")
        .insert({ name: tagName, slug })
        .select("id")
        .single();
      if (newTag) tagIds.push(newTag.id);
    }
  }

  // 2. Link ke Document
  if (tagIds.length > 0) {
    // Bersihkan link lama (untuk update)
    await supabase.from("document_tags").delete().eq("document_id", documentId);

    // Insert baru
    const links = tagIds.map((tagId) => ({
      document_id: documentId,
      tag_id: tagId,
    }));
    await supabase.from("document_tags").insert(links);
  }
}

// --- CREATE ---
export async function createDocumentAction(
  input: DocumentFormValues
): Promise<ActionResponse> {
  const parsed = documentFormSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Data tidak valid" };

  // Transformasi Data
  const { tags, ...docData } = transformFormToDatabase(parsed.data);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  // Insert Dokumen
  const { data: newDoc, error } = await supabase
    .from("documents")
    .insert({ ...docData, author_id: user.id })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  // Proses Tags
  if (tags && tags.length > 0) {
    await processTags(supabase, newDoc.id, tags);
  }

  revalidatePath("/dashboard");
  revalidatePath("/documents");
  return { success: true };
}

// --- UPDATE ---
export async function updateDocumentAction(
  input: UpdateDocumentFormValues
): Promise<ActionResponse> {
  const parsed = updateDocumentFormSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Data tidak valid" };

  const { tags, id, ...docData } = transformUpdateFormToDatabase(parsed.data);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  // Update Dokumen
  const { error } = await supabase
    .from("documents")
    .update(docData)
    .eq("id", id)
    .eq("author_id", user.id);

  if (error) return { success: false, error: error.message };

  // Update Tags (Jika ada perubahan tags)
  if (tags !== undefined) {
    await processTags(supabase, id, tags);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/documents/${id}`);
  return { success: true };
}

// --- DELETE ---
export async function deleteDocumentAction(
  id: string
): Promise<ActionResponse> {
  const parsed = deleteDocumentSchema.safeParse({ id });
  if (!parsed.success) return { success: false, error: "ID tidak valid" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", id)
    .eq("author_id", user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/documents");
  return { success: true };
}
