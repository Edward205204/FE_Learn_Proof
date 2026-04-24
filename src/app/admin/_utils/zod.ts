import { z } from 'zod'

// --- Enums ---
export const RoleEnum = z.enum(['LEARNER', 'CONTENT_MANAGER', 'ADMIN'])
export const CourseStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
export const CourseLevelEnum = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
export const AuthProviderEnum = z.enum(['LOCAL', 'GOOGLE'])

export type AdminRole = z.infer<typeof RoleEnum>
export type AdminCourseStatus = z.infer<typeof CourseStatusEnum>
export type AdminCourseLevel = z.infer<typeof CourseLevelEnum>

// --- Users ---
export const AdminUserItemSchema = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string(),
  avatar: z.string().nullable(),
  role: RoleEnum,
  provider: AuthProviderEnum,
  createdAt: z.string(),
  _count: z.object({
    coursesCreated: z.number().int(),
    enrollments: z.number().int()
  })
})

export const AdminGetUsersResponseSchema = z.object({
  items: z.array(AdminUserItemSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number()
  })
})

export type AdminUserItem = z.infer<typeof AdminUserItemSchema>
export type AdminGetUsersResponse = z.infer<typeof AdminGetUsersResponseSchema>

export const AdminUserDetailResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string(),
  avatar: z.string().nullable(),
  bio: z.string().nullable(),
  headline: z.string().nullable(),
  website: z.string().nullable(),
  role: RoleEnum,
  createdAt: z.string(),
  updatedAt: z.string()
})

export type AdminUserDetail = z.infer<typeof AdminUserDetailResponseSchema>

// --- Courses ---
export const AdminCourseItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  thumbnail: z.string().nullable(),
  status: CourseStatusEnum,
  price: z.number(),
  isFree: z.boolean(),
  level: CourseLevelEnum,
  createdAt: z.string(),
  creator: z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string()
  }),
  _count: z.object({
    enrollments: z.number().int(),
    chapters: z.number().int()
  })
})

export const AdminGetCoursesResponseSchema = z.object({
  items: z.array(AdminCourseItemSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number()
  })
})

export type AdminCourseItem = z.infer<typeof AdminCourseItemSchema>
export type AdminGetCoursesResponse = z.infer<typeof AdminGetCoursesResponseSchema>

// --- Audit Logs ---
export const AdminAuditLogItemSchema = z.object({
  id: z.string(),
  action: z.string(),
  entity: z.string(),
  entityId: z.string(),
  details: z.any().nullable(),
  createdAt: z.string(),
  admin: z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string()
  })
})

export const AdminGetAuditLogsResponseSchema = z.object({
  items: z.array(AdminAuditLogItemSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number()
  })
})

export type AdminAuditLogItem = z.infer<typeof AdminAuditLogItemSchema>
export type AdminGetAuditLogsResponse = z.infer<typeof AdminGetAuditLogsResponseSchema>

// --- Settings ---
export const SystemSettingSchema = z.object({
  key: z.string(),
  value: z.any(),
  updatedAt: z.string()
})

export type SystemSetting = z.infer<typeof SystemSettingSchema>

// --- Queries ---
export const AdminGetUsersQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  role: RoleEnum.optional(),
  search: z.string().optional()
})

export type AdminGetUsersQuery = z.infer<typeof AdminGetUsersQuerySchema>

export const AdminGetCoursesQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  status: CourseStatusEnum.optional(),
  search: z.string().optional()
})

export type AdminGetCoursesQuery = z.infer<typeof AdminGetCoursesQuerySchema>

export const AdminGetAuditLogsQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  adminId: z.string().optional(),
  action: z.string().optional(),
  entity: z.string().optional()
})

export type AdminGetAuditLogsQuery = z.infer<typeof AdminGetAuditLogsQuerySchema>
// --- Dashboard ---
export const AdminDashboardOverviewSchema = z.object({
  totalUsers: z.number(),
  totalCourses: z.number(),
  totalPublishedCourses: z.number(),
  totalEnrollments: z.number(),
  totalTransactions: z.number(),
  totalRevenue: z.number()
})

export type AdminDashboardOverview = z.infer<typeof AdminDashboardOverviewSchema>
