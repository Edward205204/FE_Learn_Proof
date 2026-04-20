import http from '@/utils/http'

export type LessonProgress = {
  isCompleted: boolean
  lastAccess: string // ISO date
}

export type LessonWithProgress = {
  id: string
  title: string
  type: 'VIDEO' | 'TEXT' | 'QUIZ'
  order: number
  duration: number | null
  progress: LessonProgress[] // mảng này sẽ có độ dài 0 hoặc 1 (do đã filter theo userId ở BE)
}

export type ChapterWithProgress = {
  id: string
  title: string
  order: number
  lessons: LessonWithProgress[]
}

const learnerCourseApi = {
  /**
   * GET /courses/:courseId/progress
   * Lấy danh sách toàn bộ chương và bài giảng của khóa học,
   * KÈM THEO trạng thái hoàn thành (progress) của Học Viên đang đăng nhập.
   * (Dùng để hiển thị danh sách bài học Sidebar bên trái trong phòng học)
   */
  getCourseProgress: (courseId: string) => http.get<ChapterWithProgress[]>(`/courses/${courseId}/progress`),
  submitReview: (courseId: string, data: { rating: number; comment: string }) =>
    http.post(`/courses/${courseId}/reviews`, data),

  updateReview: (courseId: string, data: { rating: number; comment: string }) =>
    http.patch(`/courses/${courseId}/reviews`, data),

  deleteReview: (courseId: string) => http.delete(`/courses/${courseId}/reviews`)
}

export default learnerCourseApi
