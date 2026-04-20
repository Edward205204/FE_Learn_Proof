import http from '@/utils/http'

export type LessonLearnerResponse = {
  id: string
  title: string
  shortDesc: string | null
  type: 'VIDEO' | 'TEXT' | 'QUIZ'
  order: number
  chapterId: string
  // Video fields
  videoUrl?: string
  duration?: number | null
  // Text fields
  textContent?: string
  // Quiz fields
  quiz?: {
    id: string
    questions: {
      id: string
      content: string
      answers: { id: string; content: string }[]
    }[]
  } | null
}

const lessonApi = {
  getLessonForLearner: (lessonId: string) => http.get<LessonLearnerResponse>(`/lesson/${lessonId}/learn`),

  markLessonComplete: (lessonId: string, courseId: string) =>
    http.post(`/lesson/${lessonId}/complete`, { courseId })
}

export default lessonApi
