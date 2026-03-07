export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ'

export interface Category {
  id: string
  name: string
}

export interface Course {
  id: string
  title: string
  shortDescription?: string
  description?: string
  thumbnail?: string
  level: CourseLevel
  status: CourseStatus
  price: number
  discount?: number
  categoryId: string
  category?: Category
  createdAt: string
  updatedAt: string
}

export interface Chapter {
  id: string
  title: string
  courseId: string
  order: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  chapterId: string
  order: number
  type: LessonType
}

export interface Answer {
  id: string
  text: string
  isCorrect: boolean
  questionId: string
}

export interface Question {
  id: string
  questionText: string
  type: 'multiple_choice' | 'single_choice'
  answers: Answer[]
  quizId: string
}

export interface Quiz {
  id: string
  title?: string
  shortDescription?: string
  description?: string
  passingScore?: number
  issueCertificate?: boolean
  unlockNextCourse?: boolean
  lessonId?: string
  questions: Question[]
}

// Dùng để hiển thị UI trang Feedback & Q&A
// Map từ Discussion (Q&A) + Review (đánh giá) của BE
export interface Interaction {
  id: string
  type: 'discussion' | 'review'
  user: {
    name: string
    avatar?: string
    courseName: string
  }
  content: string
  rating?: number
  status?: 'unresolved' | 'resolved'
  lessonUrl?: string
  reply?: string
  isPinned: boolean
}
