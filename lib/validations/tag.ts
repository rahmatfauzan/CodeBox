import { z } from 'zod'

// Tag Schema
export const tagSchema = z.object({
  name: z
    .string()
    .min(2, 'Tag name must be at least 2 characters')
    .max(30, 'Tag name must be less than 30 characters')
    .regex(
      /^[a-zA-Z0-9\s-]+$/,
      'Tag name can only contain letters, numbers, spaces, and hyphens'
    ),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(30, 'Slug must be less than 30 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase letters, numbers, and hyphens only'
    ),
})

// Create Tag Schema (auto-generate slug from name)
export const createTagSchema = tagSchema
  .omit({ slug: true })
  .extend({
    slug: z.string().optional(),
  })
  .transform((data) => ({
    ...data,
    slug: data.slug || data.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-'),
  }))

// Update Tag Schema
export const updateTagSchema = tagSchema.partial()

// Delete Tag Schema
export const deleteTagSchema = z.object({
  id: z.string().uuid('Invalid tag ID'),
})

// Bulk Create Tags Schema
export const bulkCreateTagsSchema = z.object({
  tags: z.array(z.string().min(2).max(30)).min(1, 'At least one tag is required'),
})

// Type exports
export type TagFormData = z.infer<typeof tagSchema>
export type CreateTagData = z.infer<typeof createTagSchema>
export type UpdateTagData = z.infer<typeof updateTagSchema>
export type DeleteTagData = z.infer<typeof deleteTagSchema>
export type BulkCreateTagsData = z.infer<typeof bulkCreateTagsSchema>