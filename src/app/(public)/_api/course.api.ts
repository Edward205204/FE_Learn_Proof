import http from '@/utils/http'
import { CourseDetailResponse, HomeCourseCard } from '@/schemas/course.schema'

export interface SearchSuggestion {
  id: string
  title: string
  slug: string
  thumbnail: string | null
  price: number
}

export interface GetCoursesParams {
  category?: string
  level?: string
  price?: string
  search?: string
  page?: string
}

export interface Meta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface GetCoursesResponse {
  items: HomeCourseCard[]
  meta: Meta
}

export const courseApi = {
  getCourseDetail: (slug: string) => http.get<CourseDetailResponse>(`/courses/${slug}`),
  getSearchSuggestions: (q: string) => http.get<SearchSuggestion[]>(`/courses/search/suggestions?q=${q}`),
  getCourses: (params: GetCoursesParams) => http.get<GetCoursesResponse>('/courses', { params })
}
