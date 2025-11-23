import { z } from "zod";

// Category Schema
export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be less than 50 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must be less than 50 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens only"
    ),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional()
    .nullable(),
  icon: z
    .string()
    .max(50, "Icon name must be less than 50 characters")
    .optional()
    .nullable(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color format")
    .optional()
    .nullable(),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
});

// Create Category Schema
export const createCategorySchema = categorySchema;

// Update Category Schema
export const updateCategorySchema = categorySchema.partial();

// Delete Category Schema
export const deleteCategorySchema = z.object({
  id: z.string().uuid("Invalid category ID"),
});

// Type exports
export type CategoryFormData = z.infer<typeof categorySchema>;
export type CreateCategoryData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryData = z.infer<typeof updateCategorySchema>;
export type DeleteCategoryData = z.infer<typeof deleteCategorySchema>;
