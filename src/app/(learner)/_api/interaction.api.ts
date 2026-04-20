import http from '@/utils/http'

export type InteractionUser = {
  id: string
  fullName: string
  avatar: string | null
}

export type LessonReply = {
  id: string
  content: string
  discussionId: string
  userId: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  user?: InteractionUser
}

export type LessonComment = {
  id: string
  lessonId: string
  courseId: string
  userId: string
  content: string
  isPinned: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  user?: InteractionUser
  replies?: LessonReply[]
}

export type LessonCommentsResponse = {
  data: LessonComment[]
  page: number
  limit: number
  total: number
  totalPages: number
}

type PaginationParams = {
  page?: number
  limit?: number
}

type ContentPayload = {
  content: string
}

const learnerInteractionApi = {
  getLessonComments: (courseId: string, lessonId: string, params: PaginationParams = {}) =>
    http.get<LessonCommentsResponse>(`/courses/${courseId}/lessons/${lessonId}/comments`, { params }),
  createComment: (courseId: string, lessonId: string, payload: ContentPayload) =>
    http.post<LessonComment>(`/courses/${courseId}/lessons/${lessonId}/comments`, payload),
  createReply: (commentId: string, payload: ContentPayload) =>
    http.post<LessonReply>(`/comments/${commentId}/replies`, payload)
}

export default learnerInteractionApi
