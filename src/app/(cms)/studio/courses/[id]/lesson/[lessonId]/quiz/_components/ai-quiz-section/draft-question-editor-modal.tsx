'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { QuizDraftQuestion } from '@/app/(cms)/_types/ai'

type DraftQuestionPayload = {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: QuizDraftQuestion | null
  onSave: (payload: DraftQuestionPayload) => Promise<void>
}

export function DraftQuestionEditorModal({ open, onOpenChange, initialData, onSave }: Props) {
  const [question, setQuestion] = useState('')
  const [explanation, setExplanation] = useState('')
  const [options, setOptions] = useState<string[]>([])
  const [correctIndex, setCorrectIndex] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!open) return

    if (initialData) {
      setQuestion(initialData.question)
      setExplanation(initialData.explanation)
      setOptions(initialData.options.length >= 4 ? [...initialData.options] : [...initialData.options, ...Array(4 - initialData.options.length).fill('')])
      setCorrectIndex(Math.min(initialData.correctIndex, Math.max(initialData.options.length - 1, 0)))
      return
    }

    setQuestion('')
    setExplanation('')
    setOptions(['', '', '', ''])
    setCorrectIndex(0)
  }, [open, initialData])

  const handleSave = async () => {
    const trimmedQuestion = question.trim()
    const trimmedExplanation = explanation.trim()
    const trimmedOptions = options.map((option) => option.trim())

    if (trimmedQuestion.length < 10) return toast.error('Câu hỏi phải có ít nhất 10 ký tự')
    if (trimmedExplanation.length === 0) return toast.error('Vui lòng nhập phần giải thích')
    if (trimmedOptions.length < 4) return toast.error('Mỗi câu hỏi cần ít nhất 4 phương án')
    if (trimmedOptions.some((option) => !option)) return toast.error('Các phương án không được để trống')
    if (correctIndex < 0 || correctIndex >= trimmedOptions.length) return toast.error('Đáp án đúng không hợp lệ')

    setIsSaving(true)
    try {
      await onSave({
        question: trimmedQuestion,
        explanation: trimmedExplanation,
        options: trimmedOptions,
        correctIndex,
      })
      onOpenChange(false)
    } catch (error) {
      console.error(error)
      toast.error('Không thể lưu câu hỏi AI')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl bg-card border-border/50'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>Chỉnh sửa câu hỏi AI</DialogTitle>
        </DialogHeader>

        <div className='space-y-5 py-4'>
          <div className='space-y-2'>
            <Label className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>Câu hỏi</Label>
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder='Nhập nội dung câu hỏi...' />
          </div>

          <div className='space-y-2'>
            <Label className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>Giải thích</Label>
            <Textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder='Giải thích cho đáp án đúng...'
              className='min-h-[110px] resize-none'
            />
          </div>

          <div className='space-y-3'>
            <div className='flex items-center justify-between gap-3'>
              <Label className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>Phương án</Label>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setOptions((prev) => [...prev, ''])}
                className='gap-2'
              >
                <Plus className='h-4 w-4' />
                Thêm phương án
              </Button>
            </div>

            <div className='space-y-3'>
              {options.map((option, index) => {
                const isCorrect = index === correctIndex
                return (
                  <div key={`${index}-${option}`} className='flex items-center gap-3'>
                    <button
                      type='button'
                      onClick={() => setCorrectIndex(index)}
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${isCorrect ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-muted-foreground/30 hover:border-emerald-500/50'}`}
                    >
                      {isCorrect && <div className='h-2 w-2 rounded-full bg-white' />}
                    </button>
                    <Input
                      value={option}
                      onChange={(e) => {
                        const next = [...options]
                        next[index] = e.target.value
                        setOptions(next)
                      }}
                      placeholder={`Phương án ${index + 1}`}
                      className={`flex-1 ${isCorrect ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => {
                        if (options.length <= 4) return
                        const next = options.filter((_, optIndex) => optIndex !== index)
                        setOptions(next)
                        setCorrectIndex((current) => {
                          if (current === index) return 0
                          if (current > index) return current - 1
                          return current
                        })
                      }}
                      className='text-muted-foreground hover:text-destructive'
                      disabled={options.length <= 4}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='ghost' onClick={() => onOpenChange(false)} disabled={isSaving}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className='bg-primary font-bold'>
            {isSaving && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
