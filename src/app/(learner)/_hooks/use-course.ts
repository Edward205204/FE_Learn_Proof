import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import learnerCourseApi from '../_api/course.api'
import { toast } from 'sonner'

export const LEARNER_COURSE_KEYS = {
  all: ['learner_course'] as const,
  progress: (courseId: string) => ['learner_course', courseId, 'progress'] as const
}

export function useGetCourseProgressQuery(courseId: string) {
  return useQuery({
    queryKey: LEARNER_COURSE_KEYS.progress(courseId),
    queryFn: () => learnerCourseApi.getCourseProgress(courseId).then((res) => res.data),
    enabled: !!courseId,
    // Ngăn chặn fetch lại liên tục khi user đang học bài
    staleTime: 5 * 60 * 1000
  })
}

export const useSubmitReviewMutation = (courseId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { rating: number; comment: string }) => learnerCourseApi.submitReview(courseId, data),
    onSuccess: () => {
      toast.success('Cảm ơn bạn đã đánh giá khóa học!')
      // Làm mới dữ liệu ở tất cả các trang liên quan
      queryClient.invalidateQueries({ queryKey: ['course-detail'] })
      queryClient.invalidateQueries({ queryKey: ['home-sections'] })
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] })
    },
    onError: () => {
      toast.error('Gửi đánh giá thất bại. Vui lòng thử lại sau.')
    }
  })
}

export const useUpdateReviewMutation = (courseId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { rating: number; comment: string }) => learnerCourseApi.updateReview(courseId, data),
    onSuccess: () => {
      toast.success('Đã cập nhật đánh giá của bạn!')
      queryClient.invalidateQueries({ queryKey: ['course-detail'] })
      queryClient.invalidateQueries({ queryKey: ['home-sections'] })
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] })
    },
    onError: () => {
      toast.error('Cập nhật đánh giá thất bại.')
    }
  })
}

export const useDeleteReviewMutation = (courseId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => learnerCourseApi.deleteReview(courseId),
    onSuccess: () => {
      toast.success('Đã xóa đánh giá của bạn.')
      queryClient.invalidateQueries({ queryKey: ['course-detail'] })
      queryClient.invalidateQueries({ queryKey: ['home-sections'] })
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] })
    },
    onError: () => {
      toast.error('Xóa đánh giá thất bại.')
    }
  })
}
