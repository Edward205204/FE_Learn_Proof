export type LessonType = 'video' | 'reading' | 'quiz'

export interface Material {
  title: string
  size: string
  url: string
}

export interface QuizQuestion {
  id: string
  text: string
  options: { id: string; text: string }[]
  correctOptionId: string
}

// --- Lesson variants ---

export interface VideoLesson {
  id: string
  type: 'video'
  title: string
  videoUrl: string
  lastPosition: number
  description: string
  materials: Material[]
}

export interface ReadingLesson {
  id: string
  type: 'reading'
  title: string
  content: string
  estimatedMinutes: number
  materials?: Material[]
}

export interface QuizLesson {
  id: string
  type: 'quiz'
  title: string
  isFinalExam: boolean
  questions: QuizQuestion[]
}

export type LessonData = VideoLesson | ReadingLesson | QuizLesson

// --- Sidebar lesson item (lighter shape) ---
export interface SidebarLesson {
  id: string
  title: string
  duration: string
  isCompleted: boolean
  isLocked: boolean
  type: 'video' | 'reading' | 'quiz'
}

export interface SidebarChapter {
  id: string
  title: string
  lessons: SidebarLesson[]
}
