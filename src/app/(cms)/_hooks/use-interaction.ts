'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import interactionApi from '../_api/interaction.api'
import type { BaseErrorResponse } from '@/app/(learner)/_hooks/use-enrollment'

export const INTERACTION_KEYS = {
  allComments: ['cms-discussions'] as const,
  lessonComments: (courseId: string, lessonId: string) => ['lesson-comments', courseId, lessonId] as const,
  courseReviews: (courseId: string) => ['course-reviews', courseId] as const
}

// ==========================================
// QUẢN LÝ BÌNH LUẬN (COMMENTS)
// ==========================================

export function useLessonCommentsQuery(courseId: string, lessonId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: [...INTERACTION_KEYS.lessonComments(courseId, lessonId), page, limit],
    queryFn: () => interactionApi.getLessonComments(courseId, lessonId, { page, limit }).then((res) => res.data),
    enabled: !!(courseId && lessonId)
  })
}

export function useDiscussionsQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...INTERACTION_KEYS.allComments, page, limit],
    queryFn: () => interactionApi.getAllComments({ page, limit }).then((res) => res.data)
  })
}

export function useCreateCommentMutation(courseId: string, lessonId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => interactionApi.createComment(courseId, lessonId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTERACTION_KEYS.lessonComments(courseId, lessonId) })
      toast.success('Gửi bình luận thành công!')
    },
    onError: () => toast.error('Lỗi khi gửi bình luận')
  })
}

export function useUpdateCommentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      interactionApi.updateComment(commentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTERACTION_KEYS.allComments })
      // Cần invalidate lessonComments nếu dùng chung, tạm thời invalidate tất cả
      toast.success('Cập nhật bình luận thành công!')
    },
    onError: () => toast.error('Lỗi khi cập nhật bình luận')
  })
}

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (commentId: string) => interactionApi.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTERACTION_KEYS.allComments })
      toast.success('Đã xoá bình luận!')
    },
    onError: () => toast.error('Lỗi khi xoá bình luận')
  })
}

export function usePinMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId, isPinned }: { commentId: string; isPinned: boolean }) =>
      interactionApi.pinComment(commentId, isPinned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTERACTION_KEYS.allComments })
    }
  })
}

// ==========================================
// QUẢN LÝ TRẢ LỜI (REPLIES)
// ==========================================

export function useReplyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      interactionApi.replyToComment(commentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTERACTION_KEYS.allComments })
    }
  })
}

export function useUpdateReplyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ replyId, content }: { replyId: string; content: string }) =>
      interactionApi.updateReply(replyId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTERACTION_KEYS.allComments })
      toast.success('Đã cập nhật câu trả lời!')
    }
  })
}

export function useDeleteReplyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (replyId: string) => interactionApi.deleteReply(replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTERACTION_KEYS.allComments })
      toast.success('Đã xoá câu trả lời!')
    }
  })
}

// ==========================================
// QUẢN LÝ ĐÁNH GIÁ (REVIEWS)
// ==========================================

export function useCourseReviewsQuery(courseId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: [...INTERACTION_KEYS.courseReviews(courseId), page, limit],
    queryFn: () => interactionApi.getCourseReviews(courseId, { page, limit }).then((res) => res.data),
    enabled: !!courseId
  })
}

export function useCreateReviewMutation(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { rating: number; comment: string }) => interactionApi.createReview(courseId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTERACTION_KEYS.courseReviews(courseId) })
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] }) // Invalidate để update rating
      toast.success('Cảm ơn bạn đã gửi đánh giá!')
    },
    onError: (error: AxiosError<BaseErrorResponse>) => {
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá.'
      toast.error(typeof msg === 'string' ? msg : 'Lỗi không xác định')
    }
  })
}
