import http from '@/utils/http'

// ─── Response Types (ánh xạ từ BE lesson.response.ts) ────────────────────────

/** Kết quả trả về khi tạo/cập nhật bài giảng */
export type LessonCreatedResponse = {
  id: string
  title: string
  type: 'VIDEO' | 'TEXT' | 'QUIZ'
  order: number
  chapterId: string
}

/** Dataset đầy đủ của Bài giảng Video (CMS view) */
export type VideoLessonDetail = {
  id: string
  title: string
  shortDesc: string | null
  type: 'VIDEO'
  order: number
  chapterId: string
  duration: number | null
  videoUrl: string
}

/** Dataset đầy đủ của Bài giảng Text (CMS view) */
export type TextLessonDetail = {
  id: string
  title: string
  shortDesc: string | null
  type: 'TEXT'
  order: number
  chapterId: string
  textContent: string
}

/** Dataset đầy đủ của Bài giảng Quiz (CMS view — ẩn đáp án đúng phía learner) */
export type QuizLessonDetail = {
  id: string
  title: string
  shortDesc: string | null
  type: 'QUIZ'
  order: number
  chapterId: string
  quiz: {
    id: string
    lessonId: string
    questions: {
      id: string
      content: string
      isEdit: boolean
      answers: { id: string; content: string; isCorrect: boolean }[]
    }[]
  } | null
}

/** Union type cho mọi loại bài giảng */
export type LessonDetail = VideoLessonDetail | TextLessonDetail | QuizLessonDetail

// ─── Request Body Types (ánh xạ từ BE lesson.model.ts) ───────────────────────

type VideoProvider = 'YOUTUBE' | 'BUNNY' | 'SELF_HOSTED'

/** Body tạo bài giảng Video */
export type CreateVideoLessonBody = {
  type: 'VIDEO'
  title: string
  chapterId: string
  videoId: string
  shortDesc?: string
  fullDesc?: string
  duration?: number
}

/** Body tạo bài giảng Text */
export type CreateTextLessonBody = {
  type: 'TEXT'
  title: string
  chapterId: string
  textContent: string
  shortDesc?: string
  fullDesc?: string
}

/** Body tạo bài giảng Quiz */
export type CreateQuizLessonBody = {
  type: 'QUIZ'
  title: string
  chapterId: string
  shortDesc?: string
  fullDesc?: string
  quizData: {
    content: string
    answers: { content: string; isCorrect?: boolean }[]
  }[]
}

export type CreateLessonBody = CreateVideoLessonBody | CreateTextLessonBody | CreateQuizLessonBody

/** Body cập nhật bài giảng (mọi trường đều optional, nhưng phải gửi kèm type) */
export type UpdateLessonBody = {
  type: 'VIDEO' | 'TEXT' | 'QUIZ'
  title?: string
  shortDesc?: string
  fullDesc?: string
  duration?: number
  textContent?: string
}

// ─── API Object ────────────────────────────────────────────────────────────────

const lessonApi = {
  /** POST /lesson — Tạo bài giảng mới (VIDEO, TEXT, hoặc QUIZ) */
  createLesson: (body: CreateLessonBody) => http.post<LessonCreatedResponse>('/lesson', body),

  /** GET /lesson/:lessonId — Lấy chi tiết bài giảng (CMS view, có isCorrect) */
  getLessonDetail: (lessonId: string) => http.get<LessonDetail>(`/lesson/${lessonId}`),

  /** PATCH /lesson/:lessonId — Cập nhật nội dung bài giảng */
  updateLesson: (lessonId: string, body: UpdateLessonBody) =>
    http.patch<LessonCreatedResponse>(`/lesson/${lessonId}`, body),

  /** DELETE /lesson/:lessonId — Xóa bài giảng */
  deleteLesson: (lessonId: string) => http.delete(`/lesson/${lessonId}`)
}

export default lessonApi
