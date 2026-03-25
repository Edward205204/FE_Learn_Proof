import http from '@/utils/http'
import { CourseDetailResponse } from '@/schemas/course.schema'

export const courseApi = {
  getCourseDetail: (slug: string) => http.get<CourseDetailResponse>(`/courses/${slug}`)
}
