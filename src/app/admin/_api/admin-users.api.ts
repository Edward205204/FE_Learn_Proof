import http from '@/utils/http'
import {
  AdminGetUsersResponse,
  GetUsersQuery,
  AdminUserDetailResponse,
  UpdateUserRoleBody,
  UpdateBanStatusBody,
  AdminUpdateUserResponse
} from '../_types/admin'

const adminUsersApi = {
  /** Lấy danh sách người dùng (có phân trang, lọc, search) */
  getUsers: (query: GetUsersQuery) => {
    return http.get<AdminGetUsersResponse>('/admin/users', { params: query })
  },

  /** Lấy chi tiết thông tin một người dùng */
  getUserDetail: (id: string) => {
    return http.get<AdminUserDetailResponse>(`/admin/users/${id}`)
  },

  /** Cập nhật vai trò (Role) của người dùng */
  updateUserRole: (id: string, body: UpdateUserRoleBody) => {
    return http.patch<AdminUpdateUserResponse>(`/admin/users/${id}/role`, body)
  },

  /** Cập nhật trạng thái khóa/mở khóa tài khoản */
  updateBanStatus: (id: string, body: UpdateBanStatusBody) => {
    return http.patch<AdminUpdateUserResponse>(`/admin/users/${id}/ban`, body)
  }
}

export default adminUsersApi
