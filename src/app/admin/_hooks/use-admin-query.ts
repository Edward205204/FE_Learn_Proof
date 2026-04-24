import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { toast } from 'sonner'
import adminApi from '@/app/admin/_api/admin.api'
import type { AdminGetUsersQuery, AdminGetCoursesQuery, AdminGetAuditLogsQuery } from '@/app/admin/_utils/zod'

export const ADMIN_QUERY_KEYS = {
  users: (params: AdminGetUsersQuery) => ['admin', 'users', params] as const,
  courses: (params: AdminGetCoursesQuery) => ['admin', 'courses', params] as const,
  logs: (params: AdminGetAuditLogsQuery) => ['admin', 'logs', params] as const,
  settings: ['admin', 'settings'] as const
}

export function useAdminUsersQuery(params: AdminGetUsersQuery) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.users(params),
    queryFn: () => adminApi.getUsers(params).then((res) => res.data),
    placeholderData: keepPreviousData
  })
}

export function useAdminUpdateUserRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => adminApi.updateUserRole(id, role),
    onSuccess: () => {
      toast.success('Cập nhật quyền người dùng thành công')
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    }
  })
}

export function useAdminCoursesQuery(params: AdminGetCoursesQuery) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.courses(params),
    queryFn: () => adminApi.getCourses(params).then((res) => res.data),
    placeholderData: keepPreviousData
  })
}

export function useAdminUpdateCourseStatusMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminApi.updateCourseStatus(id, status),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái khóa học thành công')
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] })
    }
  })
}

export function useAdminAuditLogsQuery(params: AdminGetAuditLogsQuery) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.logs(params),
    queryFn: () => adminApi.getAuditLogs(params).then((res) => res.data),
    placeholderData: keepPreviousData
  })
}

export function useAdminSettingsQuery() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.settings,
    queryFn: () => adminApi.getSettings().then((res) => res.data)
  })
}

export function useAdminUpdateSettingMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: unknown }) => adminApi.updateSetting(key, value),
    onSuccess: () => {
      toast.success('Cập nhật cài đặt hệ thống thành công')
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.settings })
    }
  })
}
