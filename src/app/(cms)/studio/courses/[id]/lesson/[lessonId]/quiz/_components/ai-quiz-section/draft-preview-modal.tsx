import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Check, X, AlertCircle } from 'lucide-react'
import { QuizDraft } from '@/app/(cms)/_types/ai'

interface Props {
  draft: QuizDraft | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPublish: (id: string) => void
  onReject: (id: string, note: string) => void
  isSubmitting: boolean
}

export function DraftPreviewModal({ draft, open, onOpenChange, onPublish, onReject, isSubmitting }: Props) {
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [reviewNote, setReviewNote] = useState('')

  if (!draft) return null

  const questions = draft.validatedOutput?.questions || []

  const handleRejectClick = () => {
    if (!showRejectInput) {
      setShowRejectInput(true)
    } else {
      onReject(draft.id, reviewNote)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold flex items-center gap-2'>
            Xem trước Quiz từ AI
            <Badge variant='secondary' className='text-[10px] uppercase'>
              DRAFT_AI
            </Badge>
          </DialogTitle>
          <DialogDescription>Xem lại các câu hỏi do AI tạo ra trước khi xuất bản hoặc từ chối.</DialogDescription>
        </DialogHeader>

        <ScrollArea className='flex-1 pr-4 mt-4'>
          <div className='space-y-6'>
            {questions.length > 0 ? (
              questions.map((q, idx) => (
                <div key={idx} className='p-4 border rounded-xl bg-muted/30 space-y-3'>
                  <h4 className='font-bold text-foreground'>
                    Câu {idx + 1}: {q.question}
                  </h4>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-2.5 text-sm rounded-lg border flex items-center justify-between ${
                          oIdx === q.correctIndex
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-700'
                            : 'bg-background border-border'
                        }`}
                      >
                        {opt}
                        {oIdx === q.correctIndex && <Check className='h-4 w-4 shrink-0' />}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <div className='mt-2 text-xs text-muted-foreground flex items-start gap-2 bg-background/50 p-2 rounded'>
                      <AlertCircle className='h-3.5 w-3.5 shrink-0 mt-0.5' />
                      <p>
                        <span className='font-semibold'>Giải thích:</span> {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className='py-10 text-center text-muted-foreground'>Không có nội dung câu hỏi hợp lệ.</div>
            )}
          </div>
        </ScrollArea>

        <div className='pt-6 border-t'>
          {showRejectInput && (
            <div className='mb-4 space-y-2 animate-in fade-in slide-in-from-top-2'>
              <label className='text-xs font-bold uppercase text-muted-foreground'>Lý do từ chối (tùy chọn)</label>
              <Textarea
                placeholder='Nhập lý do hoặc góp ý để AI cải thiện...'
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                className='min-h-[80px]'
              />
            </div>
          )}

          <DialogFooter className='gap-2 sm:gap-0'>
            <div className='flex items-center gap-2 w-full sm:w-auto'>
              <Button
                variant='outline'
                onClick={() => (showRejectInput ? setShowRejectInput(false) : onOpenChange(false))}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button variant='destructive' className='gap-2' onClick={handleRejectClick} disabled={isSubmitting}>
                <X className='h-4 w-4' />
                Từ chối
              </Button>
            </div>
            <Button
              className='bg-emerald-600 hover:bg-emerald-700 text-white gap-2 ml-auto'
              onClick={() => onPublish(draft.id)}
              disabled={isSubmitting || questions.length === 0}
            >
              <Check className='h-4 w-4' />
              Xuất bản ngay
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
