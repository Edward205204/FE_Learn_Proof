import { z } from 'zod'

// --- Enums (căn chỉnh với BE Prisma schema) ---
export const CourseLevelEnum = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
export const CourseStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
export const QuestionTypeEnum = z.enum(['multiple_choice', 'single_choice'])

// --- Schema tạo khóa học - Bước 1 ---
export const createCourseStep1Schema = z.object({
  title: z.string().min(1, 'Tiêu đề khóa học là bắt buộc').max(100, 'Tiêu đề không được vượt quá 100 ký tự'),
  category: z.string().min(1, 'Vui lòng chọn danh mục'),
  level: CourseLevelEnum,
  shortDescription: z.string().max(250, 'Mô tả ngắn không được vượt quá 250 ký tự').optional(),
  description: z.string().optional(),
  thumbnail: z.string().optional()
})

export type CreateCourseStep1Values = z.infer<typeof createCourseStep1Schema>

// --- Schema tạo khóa học - Bước 3: Giá & Trạng thái ---
export const createCourseStep3Schema = z.object({
  isFree: z.boolean(),
  price: z.number().min(0, 'Giá không hợp lệ').optional(),
  discount: z.number().min(0, 'Giá giảm không hợp lệ').optional(),
  status: CourseStatusEnum
})

export type CreateCourseStep3Values = z.infer<typeof createCourseStep3Schema>

// --- Schema Quiz ---
const answerSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, 'Đáp án không được để trống'),
  isCorrect: z.boolean()
})

export const questionSchema = z.object({
  id: z.string().optional(),
  questionText: z.string().min(5, 'Câu hỏi phải có ít nhất 5 ký tự'),
  type: QuestionTypeEnum,
  answers: z
    .array(answerSchema)
    .min(2, 'Phải có ít nhất 2 đáp án')
    .refine((answers) => answers.some((a) => a.isCorrect), {
      message: 'Phải có ít nhất 1 đáp án đúng'
    })
})

export const quizSchema = z.object({
  lessonId: z.string(),
  questions: z.array(questionSchema).min(1, 'Phải có ít nhất 1 câu hỏi')
})

export type QuizFormValues = z.infer<typeof quizSchema>

// Quiz độc lập (standalone — không gắn với lesson cụ thể)
export const independentQuizSchema = quizSchema.extend({
  lessonId: z.string().optional(),
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  passingScore: z.number().min(0, 'Điểm tối thiểu phải >= 0').max(100, 'Điểm tối thiểu phải <= 100'),
  issueCertificate: z.boolean(),
  unlockNextCourse: z.boolean()
})

export type IndependentQuizValues = z.infer<typeof independentQuizSchema>

// --- Schema tương tác (cho UI — map từ Discussion + Review của BE) ---
// type: 'discussion' → Q&A (model Discussion trong BE)
// type: 'review'     → Đánh giá (model Review trong BE)
export const interactionSchema = z.object({
  id: z.string(),
  type: z.enum(['discussion', 'review']),
  user: z.object({
    name: z.string(),
    avatar: z.string().optional(),
    courseName: z.string()
  }),
  content: z.string().min(1, 'Nội dung không được để trống'),
  rating: z.number().min(1).max(5).optional(),
  status: z.enum(['unresolved', 'resolved']).optional(),
  lessonUrl: z.string().optional(),
  reply: z.string().optional(),
  isPinned: z.boolean().default(false)
})

export type InteractionValues = z.infer<typeof interactionSchema>
