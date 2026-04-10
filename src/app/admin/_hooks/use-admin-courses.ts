import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import adminCoursesApi, { GetCoursesParams } from '../_api/admin-courses.api'

export function useAdminCourses(params: GetCoursesParams) {
  return useQuery({
    queryKey: ['admin-courses', params],
    queryFn: async () => {
      const res = await adminCoursesApi.getCourses(params)
      return res.data
    }
  })
}

export function useUpdateCourseStatusMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminCoursesApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] })
      toast.success('Cập nhật trạng thái khóa học thành công!')
    },
    onError: () => {
      toast.error('Lỗi khi cập nhật trạng thái.')
    }
  })
}

export function useUpdateCourseBanMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isBanned }: { id: string; isBanned: boolean }) => adminCoursesApi.updateBanStatus(id, isBanned),
    onSuccess: (data: unknown, { isBanned }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] })
      toast.success(isBanned ? 'Đã khóa khóa học này!' : 'Đã mở khóa khóa học!')
    },
    onError: () => {
      toast.error('Lỗi khi thực hiện thao tác.')
    }
  })
}
