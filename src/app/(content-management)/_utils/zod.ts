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

const questionSchema = z.object({
  id: z.string().optional(),
  questionText: z.string().min(5, 'Câu hỏi phải có ít nhất 5 ký tự'),
  type: z.enum(['multiple_choice', 'single_choice']),
  answers: z
    .array(
      z.object({
        id: z.string().optional(),
        text: z.string().min(1, 'Đáp án không được để trống'),
        isCorrect: z.boolean()
      })
    )
    .min(2, 'Phải có ít nhất 2 đáp án')
    .refine((answers) => answers.some((a) => a.isCorrect), {
      message: 'Phải có ít nhất 1 đáp án đúng'
    })
})

export const quizSchema = z.object({
  lessonId: z.string(), // Link cứng với bài học gốc
  questions: z.array(questionSchema).min(1, 'Phải có ít nhất 1 câu hỏi')
})

export type QuizFormValues = z.infer<typeof quizSchema>

export const independentQuizSchema = quizSchema.extend({
  lessonId: z.string().optional(), // Override: quiz độc lập không cần lessonId
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  shortDescription: z.string().optional(),
  description: z.string().optional(), // AI Context
  passingScore: z.number().min(0).max(100),
  issueCertificate: z.boolean(),
  unlockNextCourse: z.boolean(),
})

export type IndependentQuizValues = z.infer<typeof independentQuizSchema>

export const interactionSchema = z.object({
  id: z.string(),
  type: z.enum(['qa', 'review']), // Phân loại theo yêu cầu PB13
  user: z.object({
    name: z.string(),
    avatar: z.string().optional(),
    courseName: z.string()
  }),
  content: z.string().min(1, 'Nội dung không được để trống'),
  rating: z.number().min(1).max(5).optional(), // Chỉ dành cho Review
  status: z.enum(['unresolved', 'resolved']).optional(), // Chỉ dành cho QA
  lessonUrl: z.string(), // Link dẫn đến bài học của đánh giá/hỏi đáp đó
  reply: z.string().optional(),
  isPinned: z.boolean().default(false) // Tính năng ghim bình luận
})

export type InteractionValues = z.infer<typeof interactionSchema>
