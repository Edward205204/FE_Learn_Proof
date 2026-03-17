import http from '@/utils/http'
import { Quiz } from '../_types/content'
import { QuizFormValues, IndependentQuizValues } from '../_utils/zod'

const quizApi = {
  getLessonQuiz: (lessonId: string) => http.get<Quiz>(`/lessons/${lessonId}/quiz`),

  saveLessonQuiz: (lessonId: string, body: QuizFormValues) =>
    http.post<Quiz>(`/lessons/${lessonId}/quiz`, body),

  getStandaloneQuiz: (quizId: string) => http.get<Quiz>(`/quizzes/${quizId}`),

  createStandaloneQuiz: (body: IndependentQuizValues) => http.post<Quiz>('/quizzes', body),

  updateStandaloneQuiz: (quizId: string, body: Partial<IndependentQuizValues>) =>
    http.patch<Quiz>(`/quizzes/${quizId}`, body)
}

export default quizApi
