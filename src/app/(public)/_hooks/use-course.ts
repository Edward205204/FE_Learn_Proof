import { useQuery } from '@tanstack/react-query'
import { courseApi } from '../_api/course.api'

export function useCourseDetailQuery(slug: string) {
  return useQuery({
    queryKey: ['course-detail', slug],
    queryFn: async () => {
      const res = await courseApi.getCourseDetail(slug)
      return res.data
    },
    enabled: !!slug
  })
}
