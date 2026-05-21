import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import quizApi from '../_api/quiz.api'
import { LESSON_QUERY_KEYS } from './use-lesson'

// Các hook cũ đã được comment lại do BE không còn hỗ trợ save toàn bộ quiz qua 1 endpoint
// export function useSaveLessonQuizMutation(lessonId: string) { ... }
// export function useCreateStandaloneQuizMutation() { ... }

export function useAddQuestionMutation(quizId: string) {
  return useMutation({
    mutationFn: (body: { content: string; answers: { content: string; isCorrect?: boolean }[] }) =>
      quizApi.addQuestion(quizId, body),
    onSuccess: () => toast.success('Thêm câu hỏi thành công!'),
    onError: () => toast.error('Có lỗi xảy ra khi thêm câu hỏi.')
  })
}

export function useEditQuestionMutation(quizId: string) {
  return useMutation({
    mutationFn: ({ questionId, content }: { questionId: string; content: string }) =>
      quizApi.editQuestion(quizId, questionId, { content }),
    onSuccess: () => toast.success('Cập nhật câu hỏi thành công!'),
    onError: () => toast.error('Có lỗi xảy ra khi cập nhật câu hỏi.')
  })
}

export function useDeleteQuestionMutation(lessonId: string, quizId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (questionId: string) => quizApi.deleteQuestion(quizId, questionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.detail(lessonId) })
      await queryClient.invalidateQueries({ queryKey: ['ai_quiz_overview', lessonId] })
      toast.success('Xóa câu hỏi thành công!')
    },
    onError: () => toast.error('Có lỗi xảy ra khi xóa câu hỏi.')
  })
}

export function useAddAnswerMutation(quizId: string, questionId: string) {
  return useMutation({
    mutationFn: (body: { content: string }) => quizApi.addAnswer(quizId, questionId, body),
    onSuccess: () => toast.success('Thêm đáp án thành công!'),
    onError: () => toast.error('Có lỗi xảy ra khi thêm đáp án.')
  })
}

export function useEditAnswerMutation(quizId: string, questionId: string) {
  return useMutation({
    mutationFn: ({ answerId, content }: { answerId: string; content: string }) =>
      quizApi.editAnswer(quizId, questionId, answerId, { content }),
    onSuccess: () => toast.success('Cập nhật đáp án thành công!'),
    onError: () => toast.error('Có lỗi xảy ra khi cập nhật đáp án.')
  })
}

export function useDeleteAnswerMutation(quizId: string, questionId: string) {
  return useMutation({
    mutationFn: (answerId: string) => quizApi.deleteAnswer(quizId, questionId, answerId),
    onSuccess: () => toast.success('Xóa đáp án thành công!'),
    onError: () => toast.error('Có lỗi xảy ra khi xóa đáp án.')
  })
}

export function useChooseCorrectAnswerMutation(quizId: string, questionId: string) {
  return useMutation({
    mutationFn: (answerId: string) => quizApi.chooseCorrectAnswer(quizId, questionId, { answerId }),
    onSuccess: () => toast.success('Đã chọn đáp án đúng!'),
    onError: () => toast.error('Có lỗi xảy ra khi chọn đáp án đúng.')
  })
}

export function useDeleteQuizMutation() {
  return useMutation({
    mutationFn: (quizId: string) => quizApi.deleteQuiz(quizId),
    onSuccess: () => toast.success('Đã xóa bài kiểm tra!'),
    onError: () => toast.error('Có lỗi xảy ra khi xóa bài kiểm tra.')
  })
}
