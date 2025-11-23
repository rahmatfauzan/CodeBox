import { z } from 'zod'

// Like Schema
export const likeSchema = z.object({
  likeable_id: z.string().uuid('Invalid likeable ID'),
  likeable_type: z.enum(['document', 'comment']).default('document'),
})

// Toggle Like Schema
export const toggleLikeSchema = z.object({
  likeable_id: z.string().uuid('Invalid likeable ID'),
  likeable_type: z.enum(['document', 'comment']).default('document'),
})

// Bookmark Schema
export const bookmarkSchema = z.object({
  bookmarkable_id: z.string().uuid('Invalid bookmarkable ID'),
  bookmarkable_type: z.enum(['document']).default('document'),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
    .nullable(),
})

// Toggle Bookmark Schema
export const toggleBookmarkSchema = z.object({
  bookmarkable_id: z.string().uuid('Invalid bookmarkable ID'),
  bookmarkable_type: z.enum(['document']).default('document'),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
    .nullable(),
})

// Update Bookmark Notes Schema
export const updateBookmarkNotesSchema = z.object({
  id: z.string().uuid('Invalid bookmark ID'),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
    .nullable(),
})

// Type exports
export type LikeData = z.infer<typeof likeSchema>
export type ToggleLikeData = z.infer<typeof toggleLikeSchema>
export type BookmarkData = z.infer<typeof bookmarkSchema>
export type ToggleBookmarkData = z.infer<typeof toggleBookmarkSchema>
export type UpdateBookmarkNotesData = z.infer<typeof updateBookmarkNotesSchema>