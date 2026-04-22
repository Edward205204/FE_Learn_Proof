import http from '@/utils/http'
import type {
  AdminGetUsersQuery,
  AdminGetUsersResponse,
  AdminUserDetail,
  AdminGetCoursesQuery,
  AdminGetCoursesResponse,
  AdminGetAuditLogsQuery,
  AdminGetAuditLogsResponse,
  SystemSetting
} from '@/app/admin/_utils/zod'

const adminApi = {
  // Users
  getUsers: (params: AdminGetUsersQuery) =>
    http.get<AdminGetUsersResponse>('/admin/users', { params }),
  
  getUserById: (id: string) =>
    http.get<AdminUserDetail>(`/admin/users/${id}`),
  
  updateUserRole: (id: string, role: string) =>
    http.patch(`/admin/users/${id}/role`, { role }),
  
  updateUserBanStatus: (id: string, isBanned: boolean) =>
    http.patch(`/admin/users/${id}/ban`, { isBanned }),

  // Courses
  getCourses: (params: AdminGetCoursesQuery) =>
    http.get<AdminGetCoursesResponse>('/admin/courses', { params }),
  
  getCourseById: (id: string) =>
    http.get<unknown>(`/admin/courses/${id}`),
  
  updateCourseStatus: (id: string, status: string) =>
    http.patch(`/admin/courses/${id}/status`, { status }),
  
  updateCourseBanStatus: (id: string, isBanned: boolean) =>
    http.patch(`/admin/courses/${id}/ban`, { isBanned }),

  // Audit Logs
  getAuditLogs: (params: AdminGetAuditLogsQuery) =>
    http.get<AdminGetAuditLogsResponse>('/admin/audit-logs', { params }),

  // Settings
  getSettings: () =>
    http.get<SystemSetting[]>('/admin/settings'),
  
  updateSetting: (key: string, value: unknown) =>
    http.patch('/admin/settings', { key, value })
}

export default adminApi
