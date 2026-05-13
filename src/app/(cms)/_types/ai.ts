export interface QuizDraft {
  id: string
  lessonId: string
  aiJobId: string
  status: 'DRAFT_AI' | 'PUBLISHED' | 'REJECTED'
  validatedOutput: {
    questions: QuizDraftQuestion[]
  } | null
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
}

export interface GenerateAiResponse {
  jobId: string
}
