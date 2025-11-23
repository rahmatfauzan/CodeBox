import { z } from 'zod'

// Pagination Schema
export const paginationSchema = z.object({
  page: z
    .number()
    .int()
    .min(1)
    .default(1)
    .or(z.string().transform(Number)),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20)
    .or(z.string().transform(Number)),
})

// Sort Schema
export const sortSchema = z.object({
  sort_by: z
    .enum(['latest', 'oldest', 'popular', 'trending', 'views', 'likes'])
    .default('latest'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

// ID Schema
export const idSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
})

// Slug Schema
export const slugSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
})

// Username Schema
export const usernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid username format'),
})

// Type exports
export type PaginationData = z.infer<typeof paginationSchema>
export type SortData = z.infer<typeof sortSchema>
export type IdData = z.infer<typeof idSchema>
export type SlugData = z.infer<typeof slugSchema>
export type UsernameData = z.infer<typeof usernameSchema>