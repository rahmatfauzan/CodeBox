import { z } from 'zod'

// Search Documents Schema
export const searchDocumentsSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(200, 'Search query is too long'),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20)
    .or(z.string().transform(Number)),
  offset: z
    .number()
    .int()
    .min(0)
    .default(0)
    .or(z.string().transform(Number)),
  category_id: z.string().uuid().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
})

// Search Users Schema
export const searchUsersSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query is too long'),
  limit: z.number().int().min(1).max(50).default(10),
})

// Search Tags Schema
export const searchTagsSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(50, 'Search query is too long'),
  limit: z.number().int().min(1).max(50).default(20),
})

// Type exports
export type SearchDocumentsData = z.infer<typeof searchDocumentsSchema>
export type SearchUsersData = z.infer<typeof searchUsersSchema>
export type SearchTagsData = z.infer<typeof searchTagsSchema>