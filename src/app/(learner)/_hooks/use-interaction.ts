import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import learnerInteractionApi from '../_api/interaction.api'
import type { BaseErrorResponse } from './use-enrollment'

export const LEARNER_INTERACTION_KEYS = {
  all: ['learner-interactions'] as const,
  lessonComments: (courseId: string, lessonId: string) =>
    [...LEARNER_INTERACTION_KEYS.all, 'lesson-comments', courseId, lessonId] as const
}

function getErrorMessage(error: AxiosError<BaseErrorResponse>) {
  const data = error.response?.data
  if (!data?.message) return 'Có lỗi xảy ra. Vui lòng thử lại.'
  return Array.isArray(data.message) ? data.message.map((item) => item.message).join(', ') : data.message
}

export function useLessonCommentsQuery(courseId: string, lessonId: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: [...LEARNER_INTERACTION_KEYS.lessonComments(courseId, lessonId), page, limit],
    queryFn: () => learnerInteractionApi.getLessonComments(courseId, lessonId, { page, limit }).then((res) => res.data),
    enabled: Boolean(courseId && lessonId)
  })
}

export function useCreateLessonCommentMutation(courseId: string, lessonId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (content: string) => learnerInteractionApi.createComment(courseId, lessonId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEARNER_INTERACTION_KEYS.lessonComments(courseId, lessonId) })
      toast.success('Đã gửi thảo luận.')
    },
    onError: (error: AxiosError<BaseErrorResponse>) => {
      toast.error(getErrorMessage(error))
    }
  })
}

export function useCreateLessonReplyMutation(courseId: string, lessonId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      learnerInteractionApi.createReply(commentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEARNER_INTERACTION_KEYS.lessonComments(courseId, lessonId) })
      toast.success('Đã gửi phản hồi.')
    },
    onError: (error: AxiosError<BaseErrorResponse>) => {
      toast.error(getErrorMessage(error))
    }
  })
}
