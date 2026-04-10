import { AxiosError } from 'axios'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import enrollmentApi from '../_api/enrollment.api'
import { toast } from 'sonner'
export type BaseErrorResponse = { message: string | { message: string }[]; statusCode: number }

export const ENROLLMENT_QUERY_KEYS = {
  all: ['enrollments'] as const,
  me: () => [...ENROLLMENT_QUERY_KEYS.all, 'me'] as const,
  status: (courseId: string) => [...ENROLLMENT_QUERY_KEYS.all, 'status', courseId] as const
}

export function useGetMyEnrollmentsQuery() {
  return useQuery({
    queryKey: ENROLLMENT_QUERY_KEYS.me(),
    queryFn: () => enrollmentApi.getMyEnrollments().then((res) => res.data)
  })
}

export function useGetEnrollmentStatusQuery(courseId: string) {
  return useQuery({
    queryKey: ENROLLMENT_QUERY_KEYS.status(courseId),
    queryFn: () => enrollmentApi.getEnrollmentStatus(courseId).then((res) => res.data),
    enabled: Boolean(courseId)
  })
}

export function useCreateEnrollmentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (courseId: string) => enrollmentApi.createEnrollment(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENROLLMENT_QUERY_KEYS.me() })
      toast.success('Đăng ký khóa học thành công!')
    },
    onError: (error: AxiosError<BaseErrorResponse>) => {
      const data = error.response?.data
      let message = 'Có lỗi xảy ra khi đăng ký khóa học.'
      if (data?.message) {
        message = Array.isArray(data.message) ? data.message.map((e) => e.message).join(', ') : data.message
      }
      toast.error(message)
    }
  })
}

export function useMarkCourseCompletedMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (courseId: string) => enrollmentApi.markCourseCompleted(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENROLLMENT_QUERY_KEYS.me() })
      toast.success('Chúc mừng! Bạn đã hoàn thành khóa học.')
    }
  })
}
