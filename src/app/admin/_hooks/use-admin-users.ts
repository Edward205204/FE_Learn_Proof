import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import adminUsersApi from '../_api/admin-users.api'
import { GetUsersQuery, UpdateUserRoleBody, UpdateBanStatusBody } from '../_types/admin'
import { toast } from 'sonner'

export const adminQueryKeys = {
  users: (query: GetUsersQuery) => ['admin', 'users', query] as const,
  userDetail: (id: string) => ['admin', 'users', id] as const
}

export function useAdminUsers(query: GetUsersQuery) {
  return useQuery({
    queryKey: adminQueryKeys.users(query),
    queryFn: async () => {
      // Clean up empty params before sending
      const cleanedQuery = { ...query }
      if (cleanedQuery.role === '') delete cleanedQuery.role
      if (cleanedQuery.isBanned === '') delete cleanedQuery.isBanned
      if (cleanedQuery.search === '') delete cleanedQuery.search

      const res = await adminUsersApi.getUsers(cleanedQuery)
      return res.data
    }
  })
}

export function useAdminUserDetail(id: string) {
  return useQuery({
    queryKey: adminQueryKeys.userDetail(id),
    queryFn: async () => {
      const res = await adminUsersApi.getUserDetail(id)
      return res.data
    },
    enabled: !!id
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateUserRoleBody }) => adminUsersApi.updateUserRole(id, body),
    onSuccess: () => {
      toast.success('Cập nhật vai trò người dùng thành công')
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Không thể cập nhật vai trò'
      toast.error(message)
    }
  })
}

export function useUpdateBanStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateBanStatusBody }) => adminUsersApi.updateBanStatus(id, body),
    onSuccess: (_, variables) => {
      const statusText = variables.body.isBanned ? 'Đã khóa' : 'Đã mở khóa'
      toast.success(`${statusText} tài khoản thành công`)
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái'
      toast.error(message)
    }
  })
}
