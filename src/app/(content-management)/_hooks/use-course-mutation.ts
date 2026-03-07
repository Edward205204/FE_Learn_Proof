import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import courseApi from '../_api/course.api'
import { CreateCourseStep1Values, CreateCourseStep3Values } from '../_utils/zod'
import { PATH } from '@/constants/path'

export const COURSE_QUERY_KEYS = {
  all: ['courses'] as const,
  detail: (id: string) => ['courses', id] as const,
  chapters: (id: string) => ['courses', id, 'chapters'] as const
}

export function useGetCoursesQuery() {
  return useQuery({
    queryKey: COURSE_QUERY_KEYS.all,
    queryFn: () => courseApi.getCourses().then((res) => res.data)
  })
}

export function useCreateCourseMutation() {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateCourseStep1Values & CreateCourseStep3Values) => courseApi.createCourse(body),
    onSuccess: () => {
      toast.success('Tạo khóa học thành công!')
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.all })
      router.push(PATH.CONTENT_MANAGEMENT)
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi tạo khóa học.')
    }
  })
}

export function useDeleteCourseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (courseId: string) => courseApi.deleteCourse(courseId),
    onSuccess: () => {
      toast.success('Đã xóa khóa học.')
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.all })
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi xóa khóa học.')
    }
  })
}
