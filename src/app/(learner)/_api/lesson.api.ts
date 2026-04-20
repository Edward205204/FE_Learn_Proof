import http from '@/utils/http'

type LearnerQuiz = {
  id: string
  lessonId: string
  questions: {
    id: string
    content: string
    answers: { id: string; content: string }[]
  }[]
} | null

export type LearnerLessonDetail =
  | {
      id: string
      title: string
      shortDesc: string | null
      type: 'VIDEO'
      order: number
      chapterId: string
      duration: number | null
      videoUrl: string
    }
  | {
      id: string
      title: string
      shortDesc: string | null
      type: 'TEXT'
      order: number
      chapterId: string
      textContent: string
    }
  | {
      id: string
      title: string
      shortDesc: string | null
      type: 'QUIZ'
      order: number
      chapterId: string
      quiz: LearnerQuiz
    }

const learnerLessonApi = {
  getLessonForLearner: (lessonId: string) => http.get<LearnerLessonDetail>(`/lesson/${lessonId}/learn`),
  markLessonComplete: (lessonId: string, courseId: string) => http.post(`/lesson/${lessonId}/complete`, { courseId })
}

export default learnerLessonApi
