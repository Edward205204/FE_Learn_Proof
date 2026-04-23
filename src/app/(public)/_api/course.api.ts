import http from '@/utils/http'
import { CourseDetailResponse } from '@/schemas/course.schema'

export interface SearchSuggestion {
  id: string
  title: string
  slug: string
  thumbnail: string | null
  price: number
}

export const courseApi = {
  getCourseDetail: (slug: string) => http.get<CourseDetailResponse>(`/courses/${slug}`),
  getSearchSuggestions: (q: string) => http.get<SearchSuggestion[]>(`/courses/search/suggestions?q=${q}`)
}
