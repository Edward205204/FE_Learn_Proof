export const PATH = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ONBOARDING: '/onboarding',

  // Public SSR
  COURSES: '/courses',

  // Protected — mọi role
  PROFILE: '/profile',
  MY_COURSES: '/my-courses',

  // CONTENT_MANAGER + ADMIN
  CONTENT_MANAGEMENT: '/content-management',
  COURSE_NEW_STEP1: '/content-management/courses/new/step1',
  COURSE_NEW_STEP2: '/content-management/courses/new/step2',
  COURSE_NEW_STEP3: '/content-management/courses/new/step3',
  COURSE_NEW_FINISH: '/content-management/courses/new/finish',
  FEEDBACK_LIST: '/content-management/feedback-list',
  QUIZ_LESSON: '/content-management/quiz/quiz1',
  QUIZ_STANDALONE: '/content-management/quiz/quiz2',

  // ADMIN only
  ADMIN: '/admin'
}
