import http from '@/utils/http'
import { Course } from '../_types/content'
import type {
  Category,
  CreateCourseStep1Res,
  GetMyCoursesManagerQuery,
  GetMyCoursesManagerResponse,
  CreateCourseStep1,
  CourseBaseInfo,
  PublishCourseBody,
  UpdateCourseChaptersFrameBody,
  ManagerCourseDetail,
  ReorderChapterPayload,
  ReorderLessonPayload
} from '../_utils/zod'

export type InstructorCourseStats = {
  status: string
  _count: { id: number }
}[]

export type InstructorTopCourse = {
  id: string
  title: string
  thumbnail: string | null
  status: string
  avgRating: number
  totalReviews: number
  _count: { enrollments: number }
}

export type InstructorRecentReview = {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: { fullName: string; avatar: string | null }
  course: { title: string }
}

export type InstructorDashboard = {
  courseStats: InstructorCourseStats
  totalRevenue: number
  totalTransactions: number
  totalStudents: number
  topCourses: InstructorTopCourse[]
  recentReviews: InstructorRecentReview[]
  revenueChart: { month: string; revenue: number }[]
}

const courseApi = {
  getCategories: () => http.get<Category[]>('/courses/categories'),

  getMyCoursesManager: (params: GetMyCoursesManagerQuery) =>
    http.get<GetMyCoursesManagerResponse>('/courses/manager/my-courses', {
      params: {
        status: params.status ?? 'ALL',
        page: Number(params.page) || 1,
        limit: Number(params.limit) || 10
      }
    }),

  getCourseById: (courseId: string) => http.get<Course>(`/courses/${courseId}`),

  getManagerCourseDetail: (courseId: string) =>
    http.get<ManagerCourseDetail>(`/courses/manager/course-detail/${courseId}`),

  getCourseBaseInfo: (courseId: string) => http.get<CourseBaseInfo>(`/courses/base-info/${courseId}`),

  createCourseStep1: (body: CreateCourseStep1) => http.post<CreateCourseStep1Res>('/courses/create-course/st1', body),

  updateCourseBaseInfo: (courseId: string, body: CreateCourseStep1) =>
    http.patch(`/courses/base-info/${courseId}`, body),

  updateCourseChaptersFrame: (courseId: string, body: UpdateCourseChaptersFrameBody) =>
    http.patch(`/courses/${courseId}/chapters-frame`, body),

  publishCourse: (courseId: string, body: PublishCourseBody) => http.patch(`/courses/${courseId}/publish`, body),

  completeCourse: (courseId: string) => http.patch(`/courses/${courseId}/complete`),

  updateCourseStatus: (courseId: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') =>
    http.patch(`/courses/${courseId}/status`, { status }),

  deleteCourse: (courseId: string) => http.delete(`/courses/${courseId}`),

  reorderChapter: (body: ReorderChapterPayload) => http.patch('/courses/reorder/chapters', body),

  reorderLesson: (body: ReorderLessonPayload) => http.patch('/lesson/reorder', body),

  renameChapter: (chapterId: string, title: string) =>
    http.patch<{ id: string; title: string; order: number; courseId: string }>(`/courses/chapters/${chapterId}`, {
      title
    }),

  deleteChapter: (courseId: string, chapterId: string) =>
    http.delete(`/courses/${courseId}/delete/chapter/${chapterId}`),

  getDashboard: (range?: string) => http.get<InstructorDashboard>('/courses/manager/dashboard', { params: { range } })
}

export default courseApi
