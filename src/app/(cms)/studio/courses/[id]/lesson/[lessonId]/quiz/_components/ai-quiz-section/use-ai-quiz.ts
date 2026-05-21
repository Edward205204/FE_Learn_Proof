import { useEffect, useMemo, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import quizApi from '@/app/(cms)/_api/quiz.api'
import { LESSON_QUERY_KEYS } from '@/app/(cms)/_hooks/use-lesson'
import {
  AiOutputLanguage,
  QuizAiOverview,
  QuizDraft,
  QuizDraftQuestion,
  RejectDraftQuestionResponse,
  ReviewDraftQuestionResponse,
  normalizeQuizDraftQuestions
} from '@/app/(cms)/_types/ai'

type BaseErrorResponse = {
  message?: string | { message: string }[]
  statusCode?: number
}

type DraftQuestionPayload = {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

type LessonDetailCache = {
  type?: string
  quiz?: {
    id: string
    lessonId: string
    questions?: {
      id: string
      content: string
      isEdit: boolean
      answers: {
        id: string
        content: string
        isCorrect: boolean
      }[]
    }[]
  } | null
  quizData?: {
    content: string
    answers: {
      content: string
      isCorrect: boolean
    }[]
  }[]
}

const updateDraftQuestionList = (
  draft: QuizDraft,
  questionIndex: number, // originalIndex trong mảng gốc validatedOutput.questions
  emptyStatus: Extract<QuizDraft['status'], 'PUBLISHED' | 'REJECTED'>,
  serverQuestions?: QuizDraftQuestion[],
  serverStatus?: QuizDraft['status']
) => {
  const currentQuestions = normalizeQuizDraftQuestions(draft.validatedOutput || draft.rawOutput)
  // Dùng originalIndex để filter đúng câu (tránh lỗi khi filter index đã shift)
  const nextQuestions = serverQuestions ?? currentQuestions.filter((q) => (q.originalIndex ?? -1) !== questionIndex)
  return {
    ...draft,
    status: serverStatus ?? (nextQuestions.length === 0 ? emptyStatus : draft.status),
    validatedOutput: { questions: nextQuestions }
  }
}

export function useAiQuiz(lessonId: string, outputLanguage: AiOutputLanguage = 'vi') {
  const queryClient = useQueryClient()
  const failedJobToastRef = useRef<string | null>(null)
  const overviewQuery = useQuery({
    queryKey: ['ai_quiz_overview', lessonId],
    queryFn: async () => {
      try {
        return await quizApi.getOverview(lessonId).then((res) => res.data as QuizAiOverview)
      } catch (error) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 404) {
          const draftsRes = await quizApi.getDrafts(lessonId)
          return {
            lessonId,
            quiz: null,
            drafts: draftsRes.data,
            activeJob: null
          } satisfies QuizAiOverview
        }
        throw error
      }
    },
    enabled: !!lessonId,
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data) return false
      if (data.activeJob?.status === 'FAILED') return false
      if (data.drafts.some((item) => item.status === 'DRAFT_AI')) return false
      if (!data.activeJob) return false
      return 3000
    }
  })

  // Tìm draft ĐANG hoạt động: status DRAFT_AI, bất kể còn câu PENDING hay không.
  // Điều kiện length > 0 bị bỏ để tránh hiện nút Generate khi server vẫn còn draft
  // (dẫn đến lỗi 409 khi user nhấn Generate).
  const draft = useMemo(
    () => overviewQuery.data?.drafts.find((item) => item.status === 'DRAFT_AI') ?? null,
    [overviewQuery.data?.drafts]
  )

  // Chỉ hiện bảng duyệt câu hỏi khi draft còn câu PENDING để review
  const draftWithPendingQuestions = useMemo(
    () =>
      draft && normalizeQuizDraftQuestions(draft.validatedOutput || draft.rawOutput).length > 0 ? draft : null,
    [draft]
  )

  const activeJob = overviewQuery.data?.activeJob ?? null

  useEffect(() => {
    if (activeJob?.status !== 'FAILED') {
      failedJobToastRef.current = null
      return
    }

    if (failedJobToastRef.current === activeJob.id) return
    failedJobToastRef.current = activeJob.id

    toast.error(activeJob.error || 'Không thể sinh câu hỏi AI. Vui lòng thử lại.')
  }, [activeJob])

  /**
   * Sau khi accept/reject từng câu, nếu hết câu PENDING thì tự publish draft
   * để server chuyển status sang PUBLISHED → cho phép generate lại.
   */
  const autoFinalizeDraftIfEmpty = async (draftId: string) => {
    const overview = queryClient.getQueryData<QuizAiOverview>(['ai_quiz_overview', lessonId])
    const targetDraft = overview?.drafts.find((d) => d.id === draftId && d.status === 'DRAFT_AI')
    if (!targetDraft) return

    const remaining = normalizeQuizDraftQuestions(targetDraft.validatedOutput || targetDraft.rawOutput)
    if (remaining.length > 0) return

    try {
      await quizApi.publishDraft(draftId)
      await queryClient.invalidateQueries({ queryKey: ['ai_quiz_overview', lessonId] })
      await queryClient.invalidateQueries({ queryKey: ['lessons', lessonId] })
    } catch {
      // Server có thể đã tự chuyển status — không cần báo lỗi, chỉ refetch
      await queryClient.invalidateQueries({ queryKey: ['ai_quiz_overview', lessonId] })
    }
  }

  const generateMutation = useMutation({
    mutationFn: () => quizApi.generateAi(lessonId, outputLanguage),
    onSuccess: async () => {
      toast.info('Đang sinh câu hỏi bằng AI. Vui lòng chờ...')
      await queryClient.invalidateQueries({ queryKey: ['ai_quiz_overview', lessonId] })
    },
    onError: async (error: AxiosError<BaseErrorResponse>) => {
      const status = error.response?.status
      if (status === 409) {
        toast.warning('Đang có bản nháp AI hoặc job sinh quiz chưa xử lý xong.')
        // Refetch để sync lại state thực từ server — tránh UI hiện "Chưa có bản nháp" khi thực ra vẫn còn draft
        await queryClient.invalidateQueries({ queryKey: ['ai_quiz_overview', lessonId] })
      } else {
        toast.error('Không thể yêu cầu sinh câu hỏi.')
      }
    }
  })

  const publishMutation = useMutation({
    mutationFn: (draftId: string) => quizApi.publishDraft(draftId),
    onSuccess: async (_, draftId) => {
      toast.success('Đã xuất bản Quiz thành công!')
      queryClient.setQueryData(['ai_quiz_overview', lessonId], (current: QuizAiOverview | undefined) => {
        if (!current) return current

        return {
          ...current,
          drafts: current.drafts.map((draft) =>
            draft.id === draftId
              ? {
                  ...draft,
                  status: 'PUBLISHED',
                  validatedOutput: { questions: [] }
                }
              : draft
          )
        }
      })
      await queryClient.invalidateQueries({ queryKey: ['ai_quiz_overview', lessonId] })
      await queryClient.invalidateQueries({ queryKey: ['lessons', lessonId] })
    },
    onError: () => {
      toast.error('Không thể xuất bản Quiz.')
    }
  })

  const rejectMutation = useMutation({
    mutationFn: ({ draftId, reviewNote }: { draftId: string; reviewNote?: string }) =>
      quizApi.rejectDraft(draftId, { reviewNote }),
    onSuccess: async (_, { draftId }) => {
      toast.success('Đã từ chối bản nháp AI.')
      queryClient.setQueryData(['ai_quiz_overview', lessonId], (current: QuizAiOverview | undefined) => {
        if (!current) return current

        return {
          ...current,
          drafts: current.drafts.map((draft) =>
            draft.id === draftId
              ? {
                  ...draft,
                  status: 'REJECTED',
                  validatedOutput: { questions: [] }
                }
              : draft
          )
        }
      })
      await queryClient.invalidateQueries({ queryKey: ['ai_quiz_overview', lessonId] })
    },
    onError: () => {
      toast.error('Không thể từ chối bản nháp.')
    }
  })

  const acceptQuestionMutation = useMutation({
    mutationFn: ({
      draftId,
      questionIndex,
      body
    }: {
      draftId: string
      questionIndex: number
      body: DraftQuestionPayload
    }) => quizApi.acceptDraftQuestion(draftId, questionIndex, body),
    onSuccess: async (response, variables) => {
      const { draftId, questionIndex, body } = variables
      const result = response.data as ReviewDraftQuestionResponse
      toast.success('Đã duyệt câu hỏi và thêm vào quiz.')
      queryClient.setQueryData(['ai_quiz_overview', lessonId], (current: QuizAiOverview | undefined) => {
        if (!current) return current

        const nextDrafts = current.drafts.map((draft) =>
          draft.id === draftId
            ? updateDraftQuestionList(draft, questionIndex, 'PUBLISHED', result.remainingQuestions, result.draftStatus)
            : draft
        )

        const currentQuiz = current.quiz ?? {
          id: result.quizId ?? '',
          lessonId,
          questions: []
        }
        const nextQuizQuestions = currentQuiz.questions ?? []
        const questionExists = nextQuizQuestions.some((q) => q.id === result.questionId)

        return {
          ...current,
          drafts: nextDrafts,
          quiz: questionExists
            ? currentQuiz
            : {
                ...currentQuiz,
                id: result.quizId ?? currentQuiz.id,
                questions: [
                  ...nextQuizQuestions,
                  {
                    id: result.questionId,
                    content: body.question,
                    isEdit: false,
                    answers: body.options.map((content, index) => ({
                      id: `optimistic-${result.questionId}-${index}`,
                      content,
                      isCorrect: index === body.correctIndex
                    }))
                  }
                ]
              }
        }
      })

      queryClient.setQueryData(LESSON_QUERY_KEYS.detail(lessonId), (current: LessonDetailCache | undefined) => {
        if (!current) return current

        const nextAnswerContent = body.options.map((content, index) => ({
          id: `optimistic-${result.questionId}-${index}`,
          content,
          isCorrect: index === body.correctIndex
        }))

        if (current.type === 'QUIZ') {
          const prevQuiz = current.quiz ?? { id: result.quizId ?? '', lessonId, questions: [] }
          const prevQuestions = Array.isArray(prevQuiz.questions) ? prevQuiz.questions : []
          const questionExists = prevQuestions.some((question) => question.id === result.questionId)
          const nextQuiz = {
            ...prevQuiz,
            id: result.quizId ?? prevQuiz.id,
            lessonId,
            questions: questionExists
              ? prevQuestions
              : [
                  ...prevQuestions,
                  {
                    id: result.questionId,
                    content: body.question,
                    isEdit: false,
                    answers: nextAnswerContent
                  }
                ]
          }

          return {
            ...current,
            quiz: nextQuiz
          }
        }

        const prevQuizData = Array.isArray(current.quizData) ? current.quizData : []
        const nextQuizData = prevQuizData.concat({
          content: body.question,
          answers: body.options.map((content, index) => ({
            content,
            isCorrect: index === body.correctIndex
          }))
        })

        return {
          ...current,
          quizData: nextQuizData
        }
      })

      await queryClient.invalidateQueries({ queryKey: ['ai_quiz_overview', lessonId] })
      await queryClient.invalidateQueries({ queryKey: ['lessons', lessonId] })

      // Auto-publish draft khi hết câu PENDING → server chuyển status, cho phép gen lại
      await autoFinalizeDraftIfEmpty(draftId)
    },
    onError: async () => {
      toast.error('Không thể duyệt câu hỏi.')
      await queryClient.invalidateQueries({ queryKey: ['ai_quiz_overview', lessonId] })
    }
  })

  const rejectQuestionMutation = useMutation({
    mutationFn: ({
      draftId,
      questionIndex,
      body
    }: {
      draftId: string
      questionIndex: number
      body: DraftQuestionPayload
    }) => quizApi.rejectDraftQuestion(draftId, questionIndex, body),
    onSuccess: async (response, variables) => {
      const { draftId, questionIndex } = variables
      const result = response.data as RejectDraftQuestionResponse
      toast.success('Đã xóa câu hỏi khỏi bản nháp.')
      queryClient.setQueryData(['ai_quiz_overview', lessonId], (current: QuizAiOverview | undefined) => {
        if (!current) return current

        return {
          ...current,
          drafts: current.drafts.map((draft) =>
            draft.id === draftId
              ? updateDraftQuestionList(draft, questionIndex, 'REJECTED', result.remainingQuestions, result.draftStatus)
              : draft
          )
        }
      })
      await queryClient.invalidateQueries({ queryKey: ['ai_quiz_overview', lessonId] })

      // Auto-publish draft khi hết câu PENDING → server chuyển status, cho phép gen lại
      await autoFinalizeDraftIfEmpty(draftId)
    },
    onError: async () => {
      toast.error('Không thể từ chối câu hỏi.')
      await queryClient.invalidateQueries({ queryKey: ['ai_quiz_overview', lessonId] })
    }
  })

  const updateQuestionMutation = useMutation({
    mutationFn: ({
      draftId,
      questionIndex,
      body
    }: {
      draftId: string
      questionIndex: number
      body: { question: string; options: string[]; correctIndex: number; explanation: string }
    }) => quizApi.updateDraftQuestion(draftId, questionIndex, body),
    onSuccess: async () => {
      toast.success('Đã cập nhật câu hỏi AI.')
      await queryClient.invalidateQueries({ queryKey: ['ai_quiz_overview', lessonId] })
      await queryClient.invalidateQueries({ queryKey: ['lessons', lessonId] })
    },
    onError: () => {
      toast.error('Không thể cập nhật câu hỏi AI.')
    }
  })

  const handleGenerate = async () => {
    await generateMutation.mutateAsync()
  }

  const handlePublish = async (draftId: string) => {
    await publishMutation.mutateAsync(draftId)
  }

  const handleReject = async (draftId: string, reviewNote: string) => {
    await rejectMutation.mutateAsync({ draftId, reviewNote })
  }

  const handleAcceptQuestion = async (draftId: string, questionIndex: number, body: DraftQuestionPayload) => {
    await acceptQuestionMutation.mutateAsync({ draftId, questionIndex, body })
  }

  const handleRejectQuestion = async (draftId: string, questionIndex: number, body: DraftQuestionPayload) => {
    await rejectQuestionMutation.mutateAsync({ draftId, questionIndex, body })
  }

  const handleUpdateQuestion = async (
    draftId: string,
    questionIndex: number,
    body: { question: string; options: string[]; correctIndex: number; explanation: string }
  ) => {
    await updateQuestionMutation.mutateAsync({ draftId, questionIndex, body })
  }

  return {
    overview: overviewQuery.data ?? null,
    draft,
    draftWithPendingQuestions,
    activeJob,
    isGenerating: generateMutation.isPending || activeJob?.status === 'QUEUED' || activeJob?.status === 'PROCESSING',
    isSubmitting:
      publishMutation.isPending ||
      rejectMutation.isPending ||
      acceptQuestionMutation.isPending ||
      rejectQuestionMutation.isPending ||
      updateQuestionMutation.isPending,
    handleGenerate,
    handlePublish,
    handleReject,
    handleAcceptQuestion,
    handleRejectQuestion,
    handleUpdateQuestion,
    refreshDraft: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ai_quiz_overview', lessonId] })
    }
  }
}
