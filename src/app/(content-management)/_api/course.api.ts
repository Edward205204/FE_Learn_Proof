import http from '@/utils/http'
import { Course, Chapter, Lesson } from '../_types/content'
import { CreateCourseStep1Values, CreateCourseStep3Values } from '../_utils/zod'

const courseApi = {
  getCourses: () => http.get<Course[]>('/courses/my'),

  getCourseById: (courseId: string) => http.get<Course>(`/courses/${courseId}`),

  createCourse: (body: CreateCourseStep1Values & CreateCourseStep3Values) =>
    http.post<Course>('/courses', body),

  updateCourse: (courseId: string, body: Partial<CreateCourseStep1Values & CreateCourseStep3Values>) =>
    http.patch<Course>(`/courses/${courseId}`, body),

  deleteCourse: (courseId: string) => http.delete(`/courses/${courseId}`),

  getChapters: (courseId: string) => http.get<Chapter[]>(`/courses/${courseId}/chapters`),

  createChapter: (courseId: string, body: { title: string }) =>
    http.post<Chapter>(`/courses/${courseId}/chapters`, body),

  updateChapter: (courseId: string, chapterId: string, body: { title: string }) =>
    http.patch<Chapter>(`/courses/${courseId}/chapters/${chapterId}`, body),

  deleteChapter: (courseId: string, chapterId: string) =>
    http.delete(`/courses/${courseId}/chapters/${chapterId}`),

  reorderChapters: (courseId: string, body: { orderedIds: string[] }) =>
    http.patch(`/courses/${courseId}/chapters/reorder`, body),

  createLesson: (chapterId: string, body: { title: string }) =>
    http.post<Lesson>(`/chapters/${chapterId}/lessons`, body),

  updateLesson: (lessonId: string, body: { title: string }) =>
    http.patch<Lesson>(`/lessons/${lessonId}`, body),

  deleteLesson: (lessonId: string) => http.delete(`/lessons/${lessonId}`)
}

export default courseApi
