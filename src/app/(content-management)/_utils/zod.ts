import { z } from 'zod'

export const createCourseSchema = z.object({
  title: z.string().min(1, 'Course title is required').max(100),
  category: z.string().min(1, 'Please select a category'),
  difficulty: z.string(),
  // Đổi short-description thành camelCase để tránh lỗi syntax
  shortDescription: z.string().max(250, 'Description must be under 250 characters').optional(),
  description: z.string().optional(), // Đây là phần AI Context trong ảnh của bạn
  thumbnail: z.string().optional()
})

export type CreateCourseValues = z.infer<typeof createCourseSchema>
