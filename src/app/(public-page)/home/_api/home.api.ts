import http from '@/utils/http'
import type { CategoryWithCount } from '@/schemas/course.schema'
import { config } from '@/constants/config'

const homeApi = {
  getHomeSections: () => fetch(`${config.BE_URL}/courses/home-sections`),

  getCategories: () => http.get<CategoryWithCount[]>('/categories')
}

export default homeApi
