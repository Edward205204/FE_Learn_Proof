import http from '@/utils/http'
import type { HomeSectionsResponse, CategoryWithCount } from '@/schemas/course.schema'

const homeApi = {
  getHomeSections: () => http.get<HomeSectionsResponse>('/courses/home-sections'),

  getCategories: () => http.get<CategoryWithCount[]>('/categories'),
}

export default homeApi
