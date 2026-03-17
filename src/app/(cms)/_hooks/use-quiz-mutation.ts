import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import quizApi from '../_api/quiz.api'
import { QuizFormValues, IndependentQuizValues } from '../_utils/zod'

export function useSaveLessonQuizMutation(lessonId: string) {
  return useMutation({
    mutationFn: (body: QuizFormValues) => quizApi.saveLessonQuiz(lessonId, body),
    onSuccess: () => {
      toast.success('Cập nhật bài kiểm tra thành công!')
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi lưu bài kiểm tra.')
    }
  })
}

export function useCreateStandaloneQuizMutation() {
  return useMutation({
    mutationFn: (body: IndependentQuizValues) => quizApi.createStandaloneQuiz(body),
    onSuccess: () => {
      toast.success('Đã tạo bài kiểm tra độc lập thành công!')
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi tạo bài kiểm tra.')
    }
  })
}
