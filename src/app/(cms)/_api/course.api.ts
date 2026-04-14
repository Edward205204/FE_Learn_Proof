import http from '@/utils/http'
import { Course } from '../_types/content'
import type {
  Categories,
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

const courseApi = {
  getCategories: () => http.get<Categories[]>('/courses/categories'),

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

  updateCourseStatus: (courseId: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') =>
    http.patch(`/courses/${courseId}/status`, { status }),

  deleteCourse: (courseId: string) => http.delete(`/courses/${courseId}`),

  reorderChapter: (body: ReorderChapterPayload) => http.patch('/courses/reorder/chapters', body),

  reorderLesson: (body: ReorderLessonPayload) => http.patch('/courses/reorder/lessons', body),

  renameChapter: (chapterId: string, title: string) =>
    http.patch<{ id: string; title: string; order: number; courseId: string }>(`/courses/chapters/${chapterId}`, {
      title
    }),

  deleteChapter: (courseId: string, chapterId: string) =>
    http.delete(`/courses/${courseId}/delete/chapter/${chapterId}`)
}

export default courseApi
