import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import lessonApi from '../_api/lesson.api'
import { LEARNER_COURSE_KEYS } from './use-course'

export const LESSON_KEYS = {
  all: ['lesson'] as const,
  detail: (lessonId: string) => ['lesson', lessonId] as const
}

export function useGetLessonForLearnerQuery(lessonId: string) {
  return useQuery({
    queryKey: LESSON_KEYS.detail(lessonId),
    queryFn: () => lessonApi.getLessonForLearner(lessonId).then((res) => res.data),
    enabled: !!lessonId
  })
}

export function useMarkLessonCompleteMutation(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (lessonId: string) => lessonApi.markLessonComplete(lessonId, courseId),
    onSuccess: () => {
      // Refresh course progress to show checkmarks in sidebar
      queryClient.invalidateQueries({ queryKey: LEARNER_COURSE_KEYS.progress(courseId) })
    }
  })
}
