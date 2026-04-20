export const PATH = {
  STUDIO_COURSES: '/studio/courses',
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ONBOARDING: '/onboarding',
  ROADMAP: '/onboarding/survey/finish',

  // Public SSR
  COURSES: '/courses',

  // Protected — mọi role
  PROFILE: '/profile',
  CART: '/cart',
  CHECKOUT: '/checkout',
  CHECKOUT_SUCCESS: '/checkout/success',
  MY_COURSES: '/courses/list',
  SETTINGS: '/settings',
  PAYMENT_HISTORY: '/payment-history',

  // CONTENT_MANAGER + ADMIN
  CREATE_LESSON: '/studio/courses/:id/lesson/new',
  LESSON_TEXT_EDIT: '/studio/courses/:courseId/lesson/:lessonId/edit',
  COURSE_EDIT_STEP1: '/studio/courses/:id/edit/step-1',
  COURSE_NEW_STEP1: '/studio/courses/new/step-1',
  COURSE_NEW_STEP2: '/studio/courses/new/step-2',
  COURSE_NEW_STEP3: '/studio/courses/new/step-3',
  COURSE_NEW_FINISH: '/studio/courses/new/finish',
  FEEDBACK_LIST: '/studio/feedbacks',
  QUIZ_LESSON: '/studio/quiz/quiz1',
  QUIZ_STANDALONE: '/studio/quiz/quiz2',

  // ADMIN only
  ADMIN: '/admin'
}
