export const PATH = {
  STUDIO_COURSES: '/studio/courses',
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ONBOARDING: '/onboarding',
  ONBOARDING_STEP1: '/survey/step-1',
  ONBOARDING_STEP2: '/survey/step-2',
  ONBOARDING_STEP3: '/survey/step-3',
  ONBOARDING_STEP4: '/survey/step-4',
  ONBOARDING_STEP5: '/survey/step-5',
  ONBOARDING_STEP6: '/survey/finish',

  // Public SSR
  COURSES: '/courses',

  // Protected — mọi role
  PROFILE: '/profile',
  MY_COURSES: '/courses/list',
  SETTINGS: '/settings',
  PAYMENT_HISTORY: '/payment-history',

  // CONTENT_MANAGER + ADMIN
  CREATE_LESSON: '/studio/courses/:id/lesson/new',
  COURSE_EDIT_STEP1: '/studio/courses/:id/edit/step-1',
  COURSE_NEW_STEP1: '/studio/courses/new/step-1',
  COURSE_NEW_STEP2: '/studio/courses/new/step-2',
  COURSE_NEW_STEP3: '/studio/courses/new/step-3',
  COURSE_NEW_FINISH: '/studio/courses/new/finish',
  FEEDBACK_LIST: '/studio/feedbacks',
  QUIZ_LESSON: '/studio/quiz/quiz1',
  QUIZ_STANDALONE: '/studio/quiz/quiz2',

  COURSE_EDIT_STEP2: '/studio/courses/:id/edit/step-2',
  COURSE_EDIT_STEP3: '/studio/courses/:id/edit/step-3',

  // ADMIN only
  ADMIN: '/admin'
}
