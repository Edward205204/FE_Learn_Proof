import http from '@/utils/http'
import type { GetDiscussionsResponse } from '../_utils/zod'

export type PaginationParams = {
  page?: number
  limit?: number
}

export type ContentPayload = {
  content: string
}

export type CreateReviewPayload = {
  rating: number
  comment: string
}

const interactionApi = {
  // ==========================================
  // QUẢN LÝ BÌNH LUẬN (COMMENTS)
  // ==========================================

  /**
   * GET /courses/:courseId/lessons/:lessonId/comments
   * Lấy danh sách bình luận của một bài giảng cụ thể
   */
  getLessonComments: (courseId: string, lessonId: string, params: PaginationParams = {}) =>
    http.get(`/courses/${courseId}/lessons/${lessonId}/comments`, { params }),

  /**
   * GET /comments
   * Content Manager: Lấy tất cả bình luận trên toàn hệ thống
   */
  getAllComments: (params: PaginationParams = {}) => http.get<GetDiscussionsResponse>('/comments', { params }),

  /**
   * POST /courses/:courseId/lessons/:lessonId/comments
   * Tạo bình luận mới cho một bài giảng
   */
  createComment: (courseId: string, lessonId: string, payload: ContentPayload) =>
    http.post(`/courses/${courseId}/lessons/${lessonId}/comments`, payload),

  /**
   * PATCH /comments/:id
   * Sửa nội dung bình luận
   */
  updateComment: (commentId: string, payload: ContentPayload) => http.patch(`/comments/${commentId}`, payload),

  /**
   * DELETE /comments/:id
   * Xóa bình luận
   */
  deleteComment: (commentId: string) => http.delete(`/comments/${commentId}`),

  /**
   * PATCH /comments/:id/pin
   * Ghim/Bỏ ghim bình luận (Dành cho Instructor/Manager)
   */
  pinComment: (commentId: string, isPinned: boolean) => http.patch(`/comments/${commentId}/pin`, { isPinned }),

  // ==========================================
  // QUẢN LÝ TRẢ LỜI (REPLIES)
  // ==========================================

  /**
   * POST /comments/:id/replies
   * Trả lời một bình luận cha
   */
  replyToComment: (commentId: string, payload: ContentPayload) => http.post(`/comments/${commentId}/replies`, payload),

  /**
   * PATCH /replies/:id
   * Sửa nội dung trả lời
   */
  updateReply: (replyId: string, payload: ContentPayload) => http.patch(`/replies/${replyId}`, payload),

  /**
   * DELETE /replies/:id
   * Xóa nội dung trả lời
   */
  deleteReply: (replyId: string) => http.delete(`/replies/${replyId}`),

  // ==========================================
  // QUẢN LÝ ĐÁNH GIÁ KHOÁ HỌC (REVIEWS)
  // ==========================================

  /**
   * GET /courses/:courseId/reviews
   * Lấy danh sách đánh giá của khoá học
   */
  getCourseReviews: (courseId: string, params: PaginationParams = {}) =>
    http.get(`/courses/${courseId}/reviews`, { params }),

  /**
   * POST /courses/:courseId/reviews
   * Học viên gửi đánh giá khoá học
   */
  createReview: (courseId: string, payload: CreateReviewPayload) => http.post(`/courses/${courseId}/reviews`, payload),

  /**
   * GET /reviews
   * Content Manager: Lấy tất cả đánh giá của các khoá học của mình
   */
  getAllReviews: (params: PaginationParams = {}) => http.get('/reviews', { params }),

  /**
   * POST /reviews/:id/replies
   * Content Manager: Phản hồi một đánh giá
   */
  replyToReview: (reviewId: string, payload: ContentPayload) => http.post(`/reviews/${reviewId}/replies`, payload),

  /**
   * DELETE /reviews/:id
   * Content Manager: Xoá một đánh giá
   */
  deleteReviewById: (reviewId: string) => http.delete(`/reviews/${reviewId}`)
}

export default interactionApi
