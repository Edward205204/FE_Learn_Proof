import http from '@/utils/http'

export interface EnrollmentCourse {
  id: string
  enrolledAt: string
  completedAt: string | null
  lastCaughtUpAt: string | null
  totalLessons: number
  completedLessons: number
  progressPercent: number
  course: {
    id: string
    title: string
    thumbnail: string | null
    slug: string
    isFree: boolean
    level: string
    creator: {
      fullName: string
      avatar: string | null
    }
    category: {
      name: string
      slug: string
    } | null
  }
}

const enrollmentApi = {
  createEnrollment: (courseId: string) => http.post('/enrollment', { courseId }),

  getMyEnrollments: () => http.get<EnrollmentCourse[]>('/enrollment/me'),

  getEnrollmentStatus: (courseId: string) => http.get<boolean>(`/enrollment/${courseId}/status`),

  markCourseCompleted: (courseId: string) => http.post(`/enrollment/${courseId}/complete`)
}

export default enrollmentApi
