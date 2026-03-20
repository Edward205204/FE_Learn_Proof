'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import interactionApi from '../_api/interaction.api'

export const DISCUSSIONS_QUERY_KEY = 'cms-discussions'
export const REVIEWS_QUERY_KEY = 'cms-reviews'

export function useDiscussionsQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: [DISCUSSIONS_QUERY_KEY, page, limit],
    queryFn: () => interactionApi.getAllComments({ page, limit }).then((res) => res.data)
  })
}

export function useReviewsQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: [REVIEWS_QUERY_KEY, page, limit],
    queryFn: () => interactionApi.getAllReviews({ page, limit }).then((res) => res.data)
  })
}

export function useReplyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      interactionApi.replyToComment(commentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DISCUSSIONS_QUERY_KEY] })
    }
  })
}

export function usePinMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId, isPinned }: { commentId: string; isPinned: boolean }) =>
      interactionApi.pinComment(commentId, isPinned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DISCUSSIONS_QUERY_KEY] })
    }
  })
}
