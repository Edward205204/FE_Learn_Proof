import http from '@/utils/http'

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

export type LessonDetail = VideoLessonDetail | TextLessonDetail | QuizLessonDetail

export type QuizQuestionPayload = {
  content: string
  answers: { content: string; isCorrect: boolean }[]
}

export type QuizDataPayload = QuizQuestionPayload[]

export type CreateVideoLessonBody = {
  type: 'VIDEO'
  title: string
  chapterId: string
  videoId: string
  shortDesc?: string
  duration?: number
  quizData?: QuizDataPayload
}

export type CreateTextLessonBody = {
  type: 'TEXT'
  title: string
  chapterId: string
  textContent: string
  shortDesc?: string
  quizData?: QuizDataPayload
}

export type CreateQuizLessonBody = {
  type: 'QUIZ'
  title: string
  chapterId: string
  shortDesc?: string
  quizData: QuizDataPayload
}

export type CreateLessonBody = CreateVideoLessonBody | CreateTextLessonBody | CreateQuizLessonBody

export type UpdateLessonBody = {
  type: 'VIDEO' | 'TEXT' | 'QUIZ'
  title?: string
  shortDesc?: string
  duration?: number
  textContent?: string
}

const lessonApi = {
  createLesson: (body: CreateLessonBody) => http.post<LessonCreatedResponse>('/lesson', body),

  getLessonDetail: (lessonId: string) => http.get<LessonDetail>(`/lesson/${lessonId}`),

  updateLesson: (lessonId: string, body: UpdateLessonBody) =>
    http.patch<LessonCreatedResponse>(`/lesson/${lessonId}`, body),

  deleteLesson: (lessonId: string) => http.delete(`/lesson/${lessonId}`)
}

export default lessonApi
