import type { ReadonlyURLSearchParams } from 'next/navigation'
import { COURSE_DRAFT_ID_KEY } from '../_constants/course-workflow'

export function getDraftCourseId(searchParams: ReadonlyURLSearchParams) {
  return searchParams.get('courseId') ?? sessionStorage.getItem(COURSE_DRAFT_ID_KEY)
}

export function persistDraftCourseId(courseId: string) {
  sessionStorage.setItem(COURSE_DRAFT_ID_KEY, courseId)
}

export function clearDraftCourseId() {
  sessionStorage.removeItem(COURSE_DRAFT_ID_KEY)
}

