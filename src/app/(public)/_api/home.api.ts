import http from '@/utils/http'
import type { CategoryWithCount } from '@/schemas/course.schema'
import { config } from '@/constants/config'

const homeApi = {
  getHomeSections: () =>
    fetch(`${config.BE_URL}/courses/home-sections`, { cache: 'no-store' }),

  getCategories: () => http.get<CategoryWithCount[]>('/courses/categories')
}

export default homeApi
