import { z } from 'zod'

// --- Enums (căn chỉnh với BE Prisma schema) ---
export const CourseLevelEnum = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
export const CourseStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
export const QuestionTypeEnum = z.enum(['multiple_choice', 'single_choice'])
export const LessonTypeEnum = z.enum(['VIDEO', 'TEXT', 'QUIZ'])

// lấy category
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  _count: z.object({ courses: z.number().int() })
})

export type Category = z.infer<typeof CategorySchema>
//

// --- Schema tạo khóa học - Bước 1 ---
export const createCourseStep1Schema = z.object({
  title: z.string().min(1, 'Tiêu đề khóa học là bắt buộc').max(100, 'Tiêu đề không được vượt quá 100 ký tự'),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  level: CourseLevelEnum,
  shortDesc: z.string().min(1, 'Mô tả ngắn là bắt buộc').max(250, 'Mô tả ngắn không được vượt quá 250 ký tự'),
  fullDesc: z.string(),
  thumbnail: z.string().url('Thumbnail phải là URL hợp lệ').nullable().optional()
})

export const updateCourseBaseInfoSchema = createCourseStep1Schema.extend({
  isFree: z.boolean(),
  price: z.number().min(0, 'Giá không hợp lệ'),
  originalPrice: z.number().min(0, 'Giá gốc không hợp lệ').nullable()
})
export type UpdateCourseBaseInfo = z.infer<typeof updateCourseBaseInfoSchema>

export const CreateCourseSt1ResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  categoryId: z.string(),
  level: CourseLevelEnum,
  shortDesc: z.string(),
  fullDesc: z.string(),
  thumbnail: z.string().nullable(),
  expectedDays: z.number().int().nullable(),
  status: CourseStatusEnum,
  isFree: z.boolean(),
  price: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  category: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string()
  })
})
export type CreateCourseStep1Res = z.infer<typeof CreateCourseSt1ResponseSchema>
export type CreateCourseStep1 = z.infer<typeof createCourseStep1Schema>
// ---

// --- Schema tạo khóa học - Bước 2: khung chương ---
export const ChapterFrameItemSchema = z.object({
  title: z.string().min(1, 'Tên chương là bắt buộc').max(100, 'Tên chương không được vượt quá 100 ký tự'),
  order: z.number().int().min(1, 'Số thứ tự chương phải >= 1')
})

export const updateCourseChaptersFrameSchema = z
  .object({
    chapterList: z.array(ChapterFrameItemSchema).min(1, 'Phải có ít nhất 1 chương')
  })
  .superRefine((data, ctx) => {
    const orders = data.chapterList.map((c) => c.order)
    const hasDuplicate = orders.some((val, i) => orders.indexOf(val) !== i)
    if (hasDuplicate) {
      ctx.addIssue({
        code: 'custom',
        message: 'Số thứ tự các chương không được trùng nhau',
        path: ['chapterList']
      })
    }
  })

export type UpdateCourseChaptersFrameBody = z.infer<typeof updateCourseChaptersFrameSchema>

// --- Schema tạo khóa học - Bước 3: publish ---
export const publishCourseSchema = z
  .object({
    isFree: z.boolean(),
    price: z.number().min(0, 'Giá không hợp lệ'),
    originalPrice: z.number().min(0, 'Giá gốc không hợp lệ').nullable()
  })
  .superRefine((data, ctx) => {
    if (!data.isFree) {
      if (data.price <= 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Khóa học có phí phải có giá lớn hơn 0',
          path: ['price']
        })
      }
      if (data.price > 100000000) {
        ctx.addIssue({
          code: 'custom',
          message: 'Giá bán tối đa là 100.000.000 VNĐ',
          path: ['price']
        })
      }
      if (data.originalPrice !== null) {
        if (data.originalPrice <= 0) {
          ctx.addIssue({
            code: 'custom',
            message: 'Giá gốc phải lớn hơn 0',
            path: ['originalPrice']
          })
        }
        if (data.originalPrice > 100000000) {
          ctx.addIssue({
            code: 'custom',
            message: 'Giá gốc tối đa là 100.000.000 VNĐ',
            path: ['originalPrice']
          })
        }
      }
    }

    if (data.originalPrice !== null && data.price > data.originalPrice) {
      ctx.addIssue({
        code: 'custom',
        message: 'Giá sau khi giảm (giá bán) không được cao hơn giá gốc',
        path: ['price']
      })
    }
  })

export type PublishCourseBody = z.infer<typeof publishCourseSchema>

// --- Base info cho workflow edit (BE: CreateCourseFullResponseSchema) ---
// NOTE: BE trả Date nhưng qua JSON sẽ là string, nên FE dùng z.string() cho createdAt/updatedAt
export const CourseChapterBaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  order: z.number().int(),
  courseId: z.string()
})

export const CourseBaseInfoSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  categoryId: z.string(),
  level: CourseLevelEnum,
  shortDesc: z.string(),
  fullDesc: z.string(),
  thumbnail: z.string().nullable(),
  expectedDays: z.number().int().nullable(),
  status: CourseStatusEnum,
  isFree: z.boolean(),
  price: z.number(),
  originalPrice: z.number().nullable(),
  isCompleted: z.boolean(),
  publishedLessonsCount: z.number().int(),
  totalPlannedLessons: z.number().int().nullable(),
  creatorId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  chapters: z.array(CourseChapterBaseSchema)
})

export type CourseBaseInfo = z.infer<typeof CourseBaseInfoSchema>

// --- Schema chi tiết khóa học cho Studio (Manager) ---
export const ManagerLessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  order: z.number(),
  type: LessonTypeEnum,
  duration: z.number().int()
})

export const ManagerChapterSchema = z.object({
  id: z.string(),
  title: z.string(),
  order: z.number(),
  lessons: z.array(ManagerLessonSchema)
})

export const ManagerCourseDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  shortDesc: z.string(),
  fullDesc: z.string(),
  thumbnail: z.string().nullable(),
  level: CourseLevelEnum,
  status: CourseStatusEnum,
  isFree: z.boolean(),
  price: z.number(),
  originalPrice: z.number().nullable(),
  isCompleted: z.boolean(),
  publishedLessonsCount: z.number().int(),
  totalPlannedLessons: z.number().int().nullable(),
  expectedDays: z.number().int().nullable(),
  // BE dùng Date, nhưng ra JSON là string
  createdAt: z.string(),
  updatedAt: z.string(),
  category: z.object({
    name: z.string(),
    slug: z.string()
  }),
  chapters: z.array(ManagerChapterSchema)
})

export type ManagerCourseDetail = z.infer<typeof ManagerCourseDetailSchema>

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
  isPinned: z.boolean().default(false),
  createdAt: z.union([z.string(), z.date()]).optional()
})

export type InteractionValues = z.infer<typeof interactionSchema>

// ── Content-Management: Manager courses ──
export const ManagerFilterStatusEnum = z.enum(['ALL', 'DRAFT', 'PUBLISHED', 'ARCHIVED'])

export const GetMyCoursesManagerQuerySchema = z.object({
  status: ManagerFilterStatusEnum.default('ALL'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).default(20)
})

export const ManagerCourseItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  isCompleted: z.boolean(),
  thumbnail: z.string().nullable(),
  price: z.number(),
  originalPrice: z.number().nullable(),
  isFree: z.boolean(),
  level: CourseLevelEnum,
  shortDesc: z.string(),
  status: CourseStatusEnum,
  createdAt: z.string(),
  updatedAt: z.string(),
  overallAnalytics: z
    .object({
      avgRating: z.number(),
      totalStudents: z.number(),
      avgInterestScore: z.number()
    })
    .nullable()
})

export const PaginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

export const GetMyCoursesManagerResponseSchema = z.object({
  items: z.array(ManagerCourseItemSchema),
  meta: PaginationMetaSchema
})

export type GetMyCoursesManagerQuery = z.infer<typeof GetMyCoursesManagerQuerySchema>
export type GetMyCoursesManagerResponse = z.infer<typeof GetMyCoursesManagerResponseSchema>
export type ManagerCourseItem = z.infer<typeof ManagerCourseItemSchema>
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>
export type CourseStatus = z.infer<typeof CourseStatusEnum>
export type CourseLevel = z.infer<typeof CourseLevelEnum>
export type ManagerFilterStatus = z.infer<typeof ManagerFilterStatusEnum>

// --- Reorder payloads (khớp BE ReorderLessonBodySchema / ReorderChapterBodySchema) ---
export interface ReorderChapterPayload {
  courseId: string
  chapterId: string
  prevChapterId: string | null
  nextChapterId: string | null
}

export interface ReorderLessonPayload {
  courseId: string
  lessonId: string
  targetChapterId: string
  prevLessonId: string | null
  nextLessonId: string | null
}

// --- Discussion (Q&A) schemas — map từ BE GetAllCommentsResponseSchema ---
export const DiscussionUserSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  avatar: z.string().nullable()
})

export const DiscussionReplySchema = z.object({
  id: z.string(),
  content: z.string(),
  discussionId: z.string(),
  userId: z.string(),
  isDeleted: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  user: DiscussionUserSchema.optional()
})

export const DiscussionItemSchema = z.object({
  id: z.string(),
  lessonId: z.string(),
  courseId: z.string(),
  userId: z.string(),
  content: z.string(),
  isPinned: z.boolean(),
  isDeleted: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  user: DiscussionUserSchema.optional(),
  replies: z.array(DiscussionReplySchema).optional(),
  lesson: z
    .object({
      id: z.string(),
      title: z.string(),
      chapter: z.object({
        course: z.object({
          id: z.string(),
          title: z.string()
        })
      })
    })
    .optional()
})

export const GetDiscussionsResponseSchema = z.object({
  data: z.array(DiscussionItemSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number()
})

export type DiscussionUser = z.infer<typeof DiscussionUserSchema>
export type DiscussionReply = z.infer<typeof DiscussionReplySchema>
export type DiscussionItem = z.infer<typeof DiscussionItemSchema>
export type GetDiscussionsResponse = z.infer<typeof GetDiscussionsResponseSchema>

// --- Review schemas ---
export const ReviewItemSchema = z.object({
  id: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable(),
  instructorReply: z.string().nullable(),
  instructorReplyAt: z.coerce.date().nullable(),
  userId: z.string(),
  courseId: z.string(),
  createdAt: z.coerce.date(),
  user: DiscussionUserSchema.optional(),
  course: z
    .object({
      id: z.string(),
      title: z.string()
    })
    .optional()
})

export const GetReviewsResponseSchema = z.object({
  data: z.array(ReviewItemSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number()
})

export type ReviewItem = z.infer<typeof ReviewItemSchema>
export type GetReviewsResponse = z.infer<typeof GetReviewsResponseSchema>
