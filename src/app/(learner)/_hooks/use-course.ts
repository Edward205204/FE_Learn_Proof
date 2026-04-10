import { useQuery } from '@tanstack/react-query'
import learnerCourseApi from '../_api/course.api'

export const LEARNER_COURSE_KEYS = {
  all: ['learner_course'] as const,
  progress: (courseId: string) => ['learner_course', courseId, 'progress'] as const
}

export function useGetCourseProgressQuery(courseId: string) {
  return useQuery({
    queryKey: LEARNER_COURSE_KEYS.progress(courseId),
    queryFn: () => learnerCourseApi.getCourseProgress(courseId).then((res) => res.data),
    enabled: !!courseId,
    // Ngăn chặn fetch lại liên tục khi user đang học bài
    staleTime: 5 * 60 * 1000
  })
}
