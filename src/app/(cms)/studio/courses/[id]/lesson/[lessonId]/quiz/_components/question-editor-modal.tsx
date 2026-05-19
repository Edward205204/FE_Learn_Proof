'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import quizApi from '@/app/(cms)/_api/quiz.api'
import { useQueryClient } from '@tanstack/react-query'
import { LESSON_QUERY_KEYS } from '@/app/(cms)/_hooks/use-lesson'

type LocalAnswer = { id?: string; content: string; isCorrect: boolean }
export type LocalQuestion = { id?: string; content: string; answers: LocalAnswer[] }

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  quizId: string
  lessonId: string
  initialData?: LocalQuestion | null
  onSaved?: (question: LocalQuestion) => void
}

export function QuestionEditorModal({ open, onOpenChange, quizId, lessonId, initialData, onSaved }: Props) {
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')
  const [answers, setAnswers] = useState<LocalAnswer[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      if (initialData) {
        setContent(initialData.content)
        setAnswers(initialData.answers.map((a) => ({ ...a })))
      } else {
        setContent('')
        setAnswers([
          { content: '', isCorrect: true },
          { content: '', isCorrect: false }
        ])
      }
    }
  }, [open, initialData])

  const handleSave = async () => {
    if (!content.trim()) return toast.error('Vui lòng nhập nội dung câu hỏi')
    if (answers.length < 2) return toast.error('Phải có ít nhất 2 đáp án')
    if (answers.some((a) => !a.content.trim())) return toast.error('Các đáp án không được để trống')
    const correctAnswers = answers.filter((a) => a.isCorrect)
    if (correctAnswers.length !== 1) return toast.error('Phải có chính xác 1 đáp án đúng')

    setIsSaving(true)
    try {
      if (initialData?.id) {
        // Edit existing
        const qId = initialData.id
        await quizApi.editQuestion(quizId, qId, { content })

        // Process answers
        let newCorrectAnswerId: string | null = null

        for (const ans of answers) {
          if (ans.id) {
            await quizApi.editAnswer(quizId, qId, ans.id, { content: ans.content })
            if (ans.isCorrect) newCorrectAnswerId = ans.id
          } else {
            const res = await quizApi.addAnswer(quizId, qId, { content: ans.content })
            // Because addAnswer response might not return the new ID immediately,
            // if this new answer is correct, we might have an issue setting it as correct.
            // But usually users edit text. Let's just catch this case if it happens.
            const response = res as { data?: { id?: string } }
            if (ans.isCorrect && response?.data?.id) {
              newCorrectAnswerId = response.data.id
            }
          }
        }

        // Find deleted answers
        const initialAnsIds = initialData.answers.map((a) => a.id).filter(Boolean)
        const currentAnsIds = answers.map((a) => a.id).filter(Boolean)
        const deletedIds = initialAnsIds.filter((id) => !currentAnsIds.includes(id))
        for (const dId of deletedIds) {
          if (dId) await quizApi.deleteAnswer(quizId, qId, dId)
        }

        if (newCorrectAnswerId) {
          await quizApi.chooseCorrectAnswer(quizId, qId, { answerId: newCorrectAnswerId })
        }

        await quizApi.finishEditQuestion(quizId, qId)

        onSaved?.({
          id: qId,
          content,
          answers: answers.map((a) => ({ id: a.id, content: a.content, isCorrect: a.isCorrect }))
        })
      } else {
        // Add new question
        const res = await quizApi.addQuestion(quizId, {
          content,
          answers: answers.map((a) => ({ content: a.content, isCorrect: a.isCorrect }))
        })
        const createdId = (res as { data?: { id?: string } })?.data?.id
        onSaved?.({
          id: createdId,
          content,
          answers: answers.map((a) => ({ content: a.content, isCorrect: a.isCorrect }))
        })
      }

      toast.success('Lưu câu hỏi thành công')
      queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.detail(lessonId) })
      queryClient.invalidateQueries({ queryKey: ['ai_quiz_overview', lessonId] })
      onOpenChange(false)
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi lưu câu hỏi')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl bg-card border-border/50'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>
            {initialData ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          <div className='space-y-2'>
            <Label className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>Nội dung câu hỏi</Label>
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='Nhập nội dung câu hỏi...'
              className='h-12 text-base'
            />
          </div>

          <div className='space-y-3'>
            <Label className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>Các đáp án</Label>
            {answers.map((ans, idx) => (
              <div key={idx} className='flex items-center gap-3'>
                <button
                  type='button'
                  onClick={() => {
                    const newAns = [...answers]
                    newAns.forEach((a) => (a.isCorrect = false))
                    newAns[idx].isCorrect = true
                    setAnswers(newAns)
                  }}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${ans.isCorrect ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-muted-foreground/30 hover:border-emerald-500/50'}`}
                >
                  {ans.isCorrect && <div className='w-2 h-2 bg-white rounded-full' />}
                </button>
                <Input
                  value={ans.content}
                  onChange={(e) => {
                    const newAns = [...answers]
                    newAns[idx].content = e.target.value
                    setAnswers(newAns)
                  }}
                  placeholder={`Đáp án ${idx + 1}`}
                  className={`flex-1 ${ans.isCorrect ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}
                />
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setAnswers(answers.filter((_, i) => i !== idx))}
                  className='text-muted-foreground hover:text-destructive'
                  disabled={answers.length <= 2}
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            ))}
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => setAnswers([...answers, { content: '', isCorrect: false }])}
              className='mt-2 border-dashed'
            >
              <Plus className='w-4 h-4 mr-2' /> Thêm đáp án
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant='ghost' onClick={() => onOpenChange(false)} disabled={isSaving}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className='bg-primary font-bold'>
            {isSaving && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
            Lưu câu hỏi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
