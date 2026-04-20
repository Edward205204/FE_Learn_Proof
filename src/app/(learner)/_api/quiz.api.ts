import http from '@/utils/http'

type SubmitItem = {
  questionId: string
  answerId: string
}

export type QuizSubmitResult = {
  totalQuestions: number
  correctCount: number
  score: string
  resultId: string
}

const learnerQuizApi = {
  submitQuiz: (quizId: string, submission: SubmitItem[]) =>
    http.post<QuizSubmitResult>(`/quiz/${quizId}/submit`, { submission })
}

export default learnerQuizApi
