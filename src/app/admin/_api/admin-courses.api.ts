import http from '@/utils/http'

export type AdminCourseItem = {
  id: string
  title: string
  slug: string
  thumbnail: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  isBanned: boolean
  price: number
  isFree: boolean
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  createdAt: string
  creator: {
    id: string
    fullName: string
    email: string
  }
  _count: {
    enrollments: number
    chapters: number
  }
}

export type AdminGetCoursesRes = {
  items: AdminCourseItem[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type GetCoursesParams = {
  page?: number
  limit?: number
  status?: string
  isBanned?: string
  search?: string
  sort?: string
}

const adminCoursesApi = {
  getCourses: (params: GetCoursesParams) => http.get<AdminGetCoursesRes>('/admin/courses', { params }),

  updateStatus: (id: string, status: string) => http.patch(`/admin/courses/${id}/status`, { status }),

  updateBanStatus: (id: string, isBanned: boolean) => http.patch(`/admin/courses/${id}/ban`, { isBanned })
}

export default adminCoursesApi
