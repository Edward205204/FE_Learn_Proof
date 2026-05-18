import http from '@/utils/http'
import type { AiOutputLanguage } from '../_types/ai'

const quizApi = {
  // Tạm thời comment code cũ do không khớp với thiết kế BE
  // getLessonQuiz: (lessonId: string) => http.get<Quiz>(`/lessons/${lessonId}/quiz`),
  // saveLessonQuiz: (lessonId: string, body: QuizFormValues) => http.post<Quiz>(`/lessons/${lessonId}/quiz`, body),
  // getStandaloneQuiz: (quizId: string) => http.get<Quiz>(`/quizzes/${quizId}`),
  // createStandaloneQuiz: (body: IndependentQuizValues) => http.post<Quiz>('/quizzes', body),
  // updateStandaloneQuiz: (quizId: string, body: Partial<IndependentQuizValues>) => http.patch<Quiz>(`/quizzes/${quizId}`, body)

  /**
   * CÁC API THEO ĐÚNG BACKEND (QuizController)
   */
  // Thêm một câu hỏi vào quiz
  addQuestion: (quizId: string, body: { content: string; answers: { content: string; isCorrect?: boolean }[] }) =>
    http.post(`/quiz/${quizId}/questions`, body),

  // Cập nhật nội dung câu hỏi
  editQuestion: (quizId: string, questionId: string, body: { content: string }) =>
    http.patch(`/quiz/${quizId}/questions/${questionId}`, body),

  // Xóa câu hỏi
  deleteQuestion: (quizId: string, questionId: string) => http.delete(`/quiz/${quizId}/questions/${questionId}`),

  // Thêm một đáp án
  addAnswer: (quizId: string, questionId: string, body: { content: string }) =>
    http.post(`/quiz/${quizId}/questions/${questionId}/answers`, body),

  // Cập nhật nội dung đáp án
  editAnswer: (quizId: string, questionId: string, answerId: string, body: { content: string }) =>
    http.patch(`/quiz/${quizId}/questions/${questionId}/answers/${answerId}`, body),

  // Xóa đáp án
  deleteAnswer: (quizId: string, questionId: string, answerId: string) =>
    http.delete(`/quiz/${quizId}/questions/${questionId}/answers/${answerId}`),

  // Chọn/Thay đổi đáp án đúng
  chooseCorrectAnswer: (quizId: string, questionId: string, body: { answerId: string }) =>
    http.patch(`/quiz/${quizId}/questions/${questionId}/correct-answer`, body),

  // Hoàn tất việc sửa câu hỏi
  finishEditQuestion: (quizId: string, questionId: string) =>
    http.patch(`/quiz/${quizId}/questions/${questionId}/finish`),

  // Xóa toàn bộ quiz
  deleteQuiz: (quizId: string) => http.delete(`/quiz/${quizId}`),

  /**
   * AI GENERATION & DRAFTS
   */
  generateAi: (lessonId: string, language: AiOutputLanguage = 'vi') =>
    http.post<{ jobId: string }>(`/quiz/lessons/${lessonId}/generate-ai`, { language }),

  getOverview: (lessonId: string) =>
    http.get<import('../_types/ai').QuizAiOverview>(`/quiz/lessons/${lessonId}/overview`),

  getDrafts: (lessonId: string) => http.get<import('../_types/ai').QuizDraft[]>(`/quiz/lessons/${lessonId}/drafts`),

  publishDraft: (draftId: string) => http.patch<{ success: true }>(`/quiz/drafts/${draftId}/publish`),

  rejectDraft: (draftId: string, body: { reviewNote?: string }) =>
    http.patch<{ success: true }>(`/quiz/drafts/${draftId}/reject`, body)
}

export default quizApi
