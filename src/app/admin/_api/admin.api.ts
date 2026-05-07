import http from '@/utils/http'
import type {
  AdminGetUsersQuery,
  AdminGetUsersResponse,
  AdminUserDetail,
  AdminGetCoursesQuery,
  AdminGetCoursesResponse,
  AdminGetAuditLogsQuery,
  AdminGetAuditLogsResponse,
  SystemSetting,
  AdminDashboardOverview,
  AdminRevenueItem,
  AdminTopCourseItem,
  AdminHardLessonItem
} from '@/app/admin/_utils/zod'

const adminApi = {
  // Users
  getUsers: (params: AdminGetUsersQuery) => http.get<AdminGetUsersResponse>('/admin/users', { params }),

  getUserById: (id: string) => http.get<AdminUserDetail>(`/admin/users/${id}`),

  updateUserRole: (id: string, role: string) => http.patch(`/admin/users/${id}/role`, { role }),

  // Courses
  getCourses: (params: AdminGetCoursesQuery) => http.get<AdminGetCoursesResponse>('/admin/courses', { params }),

  getCourseById: (id: string) => http.get<unknown>(`/admin/courses/${id}`),

  updateCourseStatus: (id: string, status: string) => http.patch(`/admin/courses/${id}/status`, { status }),

  // Audit Logs
  getAuditLogs: (params: AdminGetAuditLogsQuery) =>
    http.get<AdminGetAuditLogsResponse>('/admin/audit-logs', { params }),

  // Settings
  getSettings: () => http.get<SystemSetting[]>('/admin/settings'),

  updateSetting: (key: string, value: unknown) => http.patch('/admin/settings', { key, value }),

  // Dashboard
  getDashboardOverview: () => http.get<AdminDashboardOverview>('/dashboard/overview'),

  getDashboardRevenue: (params?: { fromDate?: string; toDate?: string }) =>
    http.get<AdminRevenueItem[]>('/dashboard/revenue', { params }),

  getDashboardTopCourses: (month: string) =>
    http.get<AdminTopCourseItem[]>('/dashboard/top-courses', { params: { month } }),

  getDashboardHardLessons: () => http.get<AdminHardLessonItem[]>('/dashboard/hard-lessons')
}

export default adminApi
