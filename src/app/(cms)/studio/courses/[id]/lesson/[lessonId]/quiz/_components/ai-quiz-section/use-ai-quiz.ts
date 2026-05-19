import { useEffect, useMemo, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import quizApi from '@/app/(cms)/_api/quiz.api'
import { AiOutputLanguage, QuizAiOverview } from '@/app/(cms)/_types/ai'

type BaseErrorResponse = {
  message?: string | { message: string }[]
  statusCode?: number
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

  const draft = useMemo(
    () => overviewQuery.data?.drafts.find((item) => item.status === 'DRAFT_AI') ?? null,
    [overviewQuery.data?.drafts]
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

  const generateMutation = useMutation({
    mutationFn: () => quizApi.generateAi(lessonId, outputLanguage),
    onSuccess: async () => {
      toast.info('Đang sinh câu hỏi bằng AI. Vui lòng chờ...')
      await queryClient.invalidateQueries({ queryKey: ['ai_quiz_overview', lessonId] })
    },
    onError: (error: AxiosError<BaseErrorResponse>) => {
      const status = error.response?.status
      if (status === 409) {
        toast.warning('Đang có bản nháp AI hoặc job sinh quiz chưa xử lý xong.')
      } else {
        toast.error('Không thể yêu cầu sinh câu hỏi.')
      }
    }
  })

  const publishMutation = useMutation({
    mutationFn: (draftId: string) => quizApi.publishDraft(draftId),
    onSuccess: async () => {
      toast.success('Đã xuất bản Quiz thành công!')
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
    onSuccess: async () => {
      toast.success('Đã từ chối bản nháp AI.')
      await queryClient.invalidateQueries({ queryKey: ['ai_quiz_overview', lessonId] })
    },
    onError: () => {
      toast.error('Không thể từ chối bản nháp.')
    }
  })

  const acceptQuestionMutation = useMutation({
    mutationFn: ({ draftId, questionIndex }: { draftId: string; questionIndex: number }) =>
      quizApi.acceptDraftQuestion(draftId, questionIndex),
    onSuccess: async () => {
      toast.success('Đã duyệt câu hỏi và thêm vào quiz.')
      await queryClient.invalidateQueries({ queryKey: ['ai_quiz_overview', lessonId] })
      await queryClient.invalidateQueries({ queryKey: ['lessons', lessonId] })
    },
    onError: () => {
      toast.error('Không thể duyệt câu hỏi.')
    }
  })

  const rejectQuestionMutation = useMutation({
    mutationFn: ({ draftId, questionIndex }: { draftId: string; questionIndex: number }) =>
      quizApi.rejectDraftQuestion(draftId, questionIndex),
    onSuccess: async () => {
      toast.success('Đã loại bỏ câu hỏi khỏi bản nháp.')
      await queryClient.invalidateQueries({ queryKey: ['ai_quiz_overview', lessonId] })
    },
    onError: () => {
      toast.error('Không thể từ chối câu hỏi.')
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

  const handleAcceptQuestion = async (draftId: string, questionIndex: number) => {
    await acceptQuestionMutation.mutateAsync({ draftId, questionIndex })
  }

  const handleRejectQuestion = async (draftId: string, questionIndex: number) => {
    await rejectQuestionMutation.mutateAsync({ draftId, questionIndex })
  }

  return {
    overview: overviewQuery.data ?? null,
    draft,
    activeJob,
    isGenerating: generateMutation.isPending || activeJob?.status === 'QUEUED' || activeJob?.status === 'PROCESSING',
    isSubmitting:
      publishMutation.isPending ||
      rejectMutation.isPending ||
      acceptQuestionMutation.isPending ||
      rejectQuestionMutation.isPending,
    handleGenerate,
    handlePublish,
    handleReject,
    handleAcceptQuestion,
    handleRejectQuestion,
    refreshDraft: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ai_quiz_overview', lessonId] })
    }
  }
}
