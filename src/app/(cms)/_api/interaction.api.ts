import http from '@/utils/http'
import type { GetDiscussionsResponse } from '../_utils/zod'

export type GetDiscussionsParams = {
  page?: number
  limit?: number
}

export type ReplyPayload = {
  content: string
}

const interactionApi = {
  getAllComments: (params: GetDiscussionsParams = {}) =>
    http.get<GetDiscussionsResponse>('/comments', { params }),

  replyToComment: (commentId: string, payload: ReplyPayload) =>
    http.post(`/comments/${commentId}/replies`, payload),

  pinComment: (commentId: string, isPinned: boolean) =>
    http.patch(`/comments/${commentId}/pin`, { isPinned }),
}

export default interactionApi
