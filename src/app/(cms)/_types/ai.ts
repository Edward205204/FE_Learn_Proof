export interface QuizDraft {
  id: string
  lessonId: string
  aiJobId: string
  status: 'DRAFT_AI' | 'PUBLISHED' | 'REJECTED'
  aiJob?: {
    id: string
    type: 'QUIZ_GENERATION'
    status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
    lessonId: string
    requestedBy: string
    model: string | null
    tokenInput: number | null
    tokenOutput: number | null
    latencyMs: number | null
    retries: number
    error: string | null
    createdAt: string
    updatedAt: string
  }
  validatedOutput: QuizDraftQuestion[] | { questions: QuizDraftQuestion[] } | null
  rawOutput: unknown
  reviewerId: string | null
  reviewNote: string | null
  promptVersion: string | null
  createdAt: string
  updatedAt: string
}

export interface QuizDraftQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  reviewStatus?: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  quizQuestionId?: string | null
  reviewedAt?: string | null
}

export type AiOutputLanguage = 'vi' | 'en'

export interface QuizPublishedAnswer {
  id: string
  content: string
  isCorrect: boolean
}

export interface QuizPublishedQuestion {
  id: string
  content: string
  isEdit?: boolean
  answers: QuizPublishedAnswer[]
}

export interface QuizPublished {
  id: string
  lessonId: string
  questions: QuizPublishedQuestion[]
}

export interface GenerateAiResponse {
  jobId: string
}

export interface ReviewDraftQuestionResponse {
  quizId: string | null
  questionId: string
  alreadySynced: boolean
}

export interface QuizAiOverview {
  lessonId: string
  quiz: QuizPublished | null
  drafts: QuizDraft[]
  activeJob: QuizDraft['aiJob'] | null
}

export function normalizeQuizDraftQuestions(
  payload: QuizDraft['validatedOutput'] | QuizDraft['rawOutput'],
): QuizDraftQuestion[] {
  if (!payload) return []
  if (Array.isArray(payload)) return payload as QuizDraftQuestion[]
  if (typeof payload === 'object' && payload && 'questions' in payload) {
    const questions = (payload as { questions?: QuizDraftQuestion[] }).questions
    return Array.isArray(questions) ? questions : []
  }
  return []
}
