import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import quizApi from '@/app/(cms)/_api/quiz.api'
import { QuizDraft } from '@/app/(cms)/_types/ai'

export function useAiQuiz(lessonId: string) {
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState<QuizDraft | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchDraft = useCallback(async () => {
    try {
      const response = await quizApi.getDrafts(lessonId)
      // Tìm draft AI đầu tiên chưa được review (status DRAFT_AI)
      const aiDraft = response.data.find((d) => d.status === 'DRAFT_AI')
      setDraft(aiDraft || null)
    } catch (error) {
      console.error('Failed to fetch drafts:', error)
    }
  }, [lessonId])

  useEffect(() => {
    fetchDraft()
  }, [fetchDraft])

  const handleGenerate = async () => {
    if (isGenerating) return

    setIsGenerating(true)
    try {
      await quizApi.generateAi(lessonId)
      toast.info('Đang sinh câu hỏi bằng AI. Vui lòng chờ...')

      // Polling
      let attempts = 0
      const MAX_ATTEMPTS = 20 // 20 * 3s = 60s
      const pollInterval = setInterval(async () => {
        attempts++
        if (attempts >= MAX_ATTEMPTS) {
          clearInterval(pollInterval)
          setIsGenerating(false)
          toast.error('Quá thời gian sinh câu hỏi. Vui lòng thử lại sau.')
          return
        }

        try {
          const res = await quizApi.getDrafts(lessonId)
          const newDraft = res.data.find((d) => d.status === 'DRAFT_AI')
          if (newDraft) {
            clearInterval(pollInterval)
            setDraft(newDraft)
            setIsGenerating(false)
            toast.success('Đã sinh câu hỏi thành công!')
          }
        } catch {
          // Ignore polling errors
        }
      }, 3000)
    } catch (error: unknown) {
      setIsGenerating(false)
      const err = error as { response?: { status?: number } }
      if (err.response?.status === 409) {
        toast.warning('Đang có bản nháp AI chưa được duyệt.')
        fetchDraft()
      } else {
        toast.error('Không thể yêu cầu sinh câu hỏi.')
      }
    }
  }

  const handlePublish = async (draftId: string) => {
    setIsSubmitting(true)
    try {
      await quizApi.publishDraft(draftId)
      toast.success('Đã xuất bản Quiz thành công!')
      setDraft(null)

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['lessons', lessonId] })
    } catch {
      toast.error('Không thể xuất bản Quiz.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async (draftId: string, reviewNote: string) => {
    setIsSubmitting(true)
    try {
      await quizApi.rejectDraft(draftId, { reviewNote })
      toast.success('Đã từ chối bản nháp AI.')
      setDraft(null)

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['ai_drafts', lessonId] })
    } catch {
      toast.error('Không thể từ chối bản nháp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    draft,
    isGenerating,
    isSubmitting,
    handleGenerate,
    handlePublish,
    handleReject,
    refreshDraft: fetchDraft
  }
}
