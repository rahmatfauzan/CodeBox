import { z } from "zod";

// --- HELPER FUNCTIONS ---
const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") +
  "-" +
  Date.now().toString().slice(-4);

const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute) || 1;
};

// 1. FORM SCHEMA
export const documentFormSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(200),
  content: z.string().min(10, "Kode terlalu pendek"),
  category_id: z.string().min(1, "Kategori wajib dipilih"),
  excerpt: z.string().optional(),
  slug: z.string().optional(),
  tags: z.array(z.string()).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  visibility: z.enum(["public", "private"]).optional(),
  meta_title: z.string().max(60).optional(),
  meta_description: z.string().max(160).optional(),
  meta_keywords: z.array(z.string()).max(10).optional(),
  thumbnail_url: z.string().url("URL tidak valid").optional().or(z.literal("")),
});

export type DocumentFormValues = z.infer<typeof documentFormSchema>;

// 2. TRANSFORM FUNCTION (Manual Transform)
export function transformFormToDatabase(formData: DocumentFormValues) {
  return {
    title: formData.title,
    content: formData.content,
    category_id: formData.category_id,
    excerpt: formData.excerpt || null,
    difficulty: formData.difficulty || "beginner",
    status: formData.status || "draft",
    visibility: formData.visibility || "private",
    slug: formData.slug || generateSlug(formData.title),
    reading_time: calculateReadingTime(formData.content),
    published_at:
      formData.status === "published" ? new Date().toISOString() : null,
    meta_title: formData.meta_title || formData.title,
    meta_description:
      formData.meta_description || formData.excerpt || formData.title,
    meta_keywords: formData.meta_keywords?.length
      ? formData.meta_keywords
      : null,
    thumbnail_url: formData.thumbnail_url || null,
    tags: formData.tags || [], // Pastikan tags selalu array
  };
}

// 3. UPDATE SCHEMA
export const updateDocumentFormSchema = documentFormSchema.partial().extend({
  id: z.string().uuid("ID tidak valid"),
});

export type UpdateDocumentFormValues = z.infer<typeof updateDocumentFormSchema>;

// 4. TRANSFORM UPDATE
export function transformUpdateFormToDatabase(
  formData: UpdateDocumentFormValues
) {
  const updates: any = { id: formData.id };

  if (formData.title !== undefined) updates.title = formData.title;
  if (formData.content !== undefined) {
    updates.content = formData.content;
    updates.reading_time = calculateReadingTime(formData.content);
  }
  if (formData.excerpt !== undefined)
    updates.excerpt = formData.excerpt || null;
  if (formData.category_id !== undefined)
    updates.category_id = formData.category_id;
  if (formData.difficulty !== undefined)
    updates.difficulty = formData.difficulty;
  if (formData.visibility !== undefined)
    updates.visibility = formData.visibility;

  if (formData.status !== undefined) {
    updates.status = formData.status;
    if (formData.status === "published")
      updates.published_at = new Date().toISOString();
    else if (formData.status === "draft") updates.published_at = null;
  }

  if (formData.meta_title !== undefined)
    updates.meta_title = formData.meta_title;
  if (formData.meta_description !== undefined)
    updates.meta_description = formData.meta_description;
  if (formData.meta_keywords !== undefined)
    updates.meta_keywords = formData.meta_keywords?.length
      ? formData.meta_keywords
      : null;
  if (formData.thumbnail_url !== undefined)
    updates.thumbnail_url = formData.thumbnail_url || null;
  if (formData.tags !== undefined) updates.tags = formData.tags;

  return updates;
}

// 5. DELETE SCHEMA
export const deleteDocumentSchema = z.object({
  id: z.string().uuid(),
});
