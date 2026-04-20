import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { toast } from 'sonner'
import courseApi from '../_api/course.api'

import type {
  CreateCourseStep1,
  GetMyCoursesManagerQuery,
  CourseBaseInfo,
  PublishCourseBody,
  UpdateCourseChaptersFrameBody,
  ManagerCourseDetail
} from '../_utils/zod'

export const COURSE_QUERY_KEYS = {
  all: ['courses'] as const,
  manager: (params: GetMyCoursesManagerQuery) => ['courses', 'manager', params] as const,
  detail: (id: string) => ['courses', id] as const,
  detailManager: (id: string) => ['courses', id, 'manager-detail'] as const,
  chapters: (id: string) => ['courses', id, 'chapters'] as const,
  categories: ['categories'] as const
}

export function useGetManagerCourseDetailQuery(courseId: string) {
  return useQuery<ManagerCourseDetail | null>({
    queryKey: COURSE_QUERY_KEYS.detailManager(courseId),
    queryFn: async () => {
      if (!courseId) return null
      const res = await courseApi.getManagerCourseDetail(courseId)
      return res.data
    },
    enabled: Boolean(courseId)
  })
}

export function useGetCourseBaseInfoQuery(courseId: string) {
  return useQuery({
    queryKey: [...COURSE_QUERY_KEYS.detail(courseId), 'base-info'] as const,
    queryFn: () => courseApi.getCourseBaseInfo(courseId).then((res) => res.data as CourseBaseInfo),
    enabled: Boolean(courseId)
  })
}

export function useGetMyCoursesManagerQuery(params: GetMyCoursesManagerQuery) {
  return useQuery({
    queryKey: COURSE_QUERY_KEYS.manager(params),
    queryFn: () => courseApi.getMyCoursesManager(params).then((res) => res.data),
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    retry: 1
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

export function useGetCategoriesQuery() {
  return useQuery({
    queryKey: COURSE_QUERY_KEYS.categories,
    queryFn: () => courseApi.getCategories().then((res) => res.data)
  })
}

export function useCreateCourseStep1Mutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateCourseStep1) => courseApi.createCourseStep1(body),
    onSuccess: (res) => {
      console.log('Tạo khóa học thành công!', res.data)
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.all })
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi tạo khóa học.')
    }
  })
}

export function useUpdateCourseBaseInfoMutation(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateCourseStep1) => courseApi.updateCourseBaseInfo(courseId, body),
    onSuccess: () => {
      toast.success('Đã cập nhật thông tin cơ bản.')
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.detail(courseId) })
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.all })
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin cơ bản.')
    }
  })
}

export function useUpdateCourseChaptersFrameMutation(courseId: string) {
  return useMutation({
    mutationFn: (body: UpdateCourseChaptersFrameBody) => courseApi.updateCourseChaptersFrame(courseId, body),
    onSuccess: () => {
      toast.success('Đã lưu cấu trúc chương.')
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi lưu cấu trúc chương.')
    }
  })
}

export function usePrefetchManagerCourseDetail() {
  const queryClient = useQueryClient()
  return (courseId: string) => {
    queryClient.prefetchQuery({
      queryKey: COURSE_QUERY_KEYS.detailManager(courseId),
      queryFn: () => courseApi.getManagerCourseDetail(courseId).then((res) => res.data),
      staleTime: 60_000
    })
  }
}

export function usePublishCourseMutation(courseId: string) {
  return useMutation({
    mutationFn: (body: PublishCourseBody) => courseApi.publishCourse(courseId, body),
    onSuccess: () => {
      toast.success('Đã xuất bản khóa học.')
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi xuất bản khóa học.')
    }
  })
}

export function useUpdateCourseStatusMutation(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => courseApi.updateCourseStatus(courseId, status),
    onSuccess: () => {
      toast.success('Đã cập nhật trạng thái khóa học.')
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.detail(courseId) })
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái.')
    }
  })
}

export function useRenameChapterMutation(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ chapterId, title }: { chapterId: string; title: string }) =>
      courseApi.renameChapter(chapterId, title),
    onSuccess: () => {
      toast.success('Đã đổi tên chương.')
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.detailManager(courseId) })
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi đổi tên chương.')
    }
  })
}

export function useDeleteChapterMutation(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (chapterId: string) => courseApi.deleteChapter(courseId, chapterId),
    onSuccess: () => {
      toast.success('Đã xóa chương.')
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.detailManager(courseId) })
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.detail(courseId) })
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi xóa chương.')
    }
  })
}
