import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import lessonApi, { CreateLessonBody, UpdateLessonBody } from '../_api/lesson.api'
import type { BaseErrorResponse } from '@/app/(learner)/_hooks/use-enrollment'

// ─── Query Keys ────────────────────────────────────────────────────────────────

export const LESSON_QUERY_KEYS = {
  all: ['lessons'] as const,
  detail: (lessonId: string) => ['lessons', lessonId] as const
}

// ─── GET /lesson/:lessonId ─────────────────────────────────────────────────────

export function useGetLessonDetailQuery(lessonId: string) {
  return useQuery({
    queryKey: LESSON_QUERY_KEYS.detail(lessonId),
    queryFn: () => lessonApi.getLessonDetail(lessonId).then((res) => res.data),
    enabled: !!lessonId
  })
}

// ─── POST /lesson ──────────────────────────────────────────────────────────────

export function useCreateLessonMutation(courseId?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateLessonBody) => lessonApi.createLesson(body),
    onSuccess: () => {
      // Invalidate course detail để danh sách bài giảng trong Studio refresh
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: ['courses', 'manager', courseId] })
      }
      toast.success('Tạo bài giảng thành công!')
    },
    onError: (error: AxiosError<BaseErrorResponse>) => {
      const data = error.response?.data
      let message = 'Có lỗi xảy ra khi tạo bài giảng.'
      if (data?.message) {
        message = Array.isArray(data.message)
          ? data.message.map((e) => e.message).join(', ')
          : data.message
      }
      toast.error(message)
    }
  })
}

// ─── PATCH /lesson/:lessonId ───────────────────────────────────────────────────

export function useUpdateLessonMutation(lessonId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateLessonBody) => lessonApi.updateLesson(lessonId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.detail(lessonId) })
      toast.success('Cập nhật bài giảng thành công!')
    },
    onError: (error: AxiosError<BaseErrorResponse>) => {
      const data = error.response?.data
      let message = 'Có lỗi xảy ra khi cập nhật bài giảng.'
      if (data?.message) {
        message = Array.isArray(data.message)
          ? data.message.map((e) => e.message).join(', ')
          : data.message
      }
      toast.error(message)
    }
  })
}

// ─── DELETE /lesson/:lessonId ──────────────────────────────────────────────────

export function useDeleteLessonMutation(courseId?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (lessonId: string) => lessonApi.deleteLesson(lessonId),
    onSuccess: () => {
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: ['courses', 'manager', courseId] })
      }
      toast.success('Đã xóa bài giảng!')
    },
    onError: (error: AxiosError<BaseErrorResponse>) => {
      const data = error.response?.data
      let message = 'Có lỗi xảy ra khi xóa bài giảng.'
      if (data?.message) {
        message = Array.isArray(data.message)
          ? data.message.map((e) => e.message).join(', ')
          : data.message
      }
      toast.error(message)
    }
  })
}
