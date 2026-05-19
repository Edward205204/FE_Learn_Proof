import { useMemo, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  // AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Pencil,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  WandSparkles,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
// import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { QuizDraft, normalizeQuizDraftQuestions } from '@/app/(cms)/_types/ai'
import { DraftQuestionEditorModal } from './draft-question-editor-modal'

type DraftQuestionPayload = {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface Props {
  draft: QuizDraft | null
  onPublish: (id: string) => void
  onReject: (id: string, note: string) => void
  onAcceptQuestion: (draftId: string, questionIndex: number, body: DraftQuestionPayload) => void | Promise<void>
  onRejectQuestion: (draftId: string, questionIndex: number, body: DraftQuestionPayload) => void | Promise<void>
  onUpdateQuestion: (draftId: string, questionIndex: number, body: DraftQuestionPayload) => void
  isSubmitting: boolean
}

export function DraftPreviewModal({
  draft,
  onPublish,
  onReject,
  onAcceptQuestion,
  onRejectQuestion,
  onUpdateQuestion,
  isSubmitting
}: Props) {
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [reviewNote, setReviewNote] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null)
  const [showRejectConfirm, setShowRejectConfirm] = useState(false)
  const questions = useMemo(() => normalizeQuizDraftQuestions(draft?.validatedOutput || draft?.rawOutput), [draft])

  if (!draft) return null

  // const statusLabel = draft.aiJob?.status ?? draft.status
  // const promptVersion = draft.promptVersion || 'v1'

  const handleReject = () => {
    if (!showRejectInput) {
      setShowRejectInput(true)
      return
    }
    onReject(draft.id, reviewNote)
  }

  const handleEdit = () => {
    if (!currentQuestion) return
    setEditingQuestionIndex(currentQuestionIndex)
    setIsEditOpen(true)
  }

  const currentQuestionIndex = Math.min(currentIndex, Math.max(0, questions.length - 1))
  const currentQuestion = questions[currentQuestionIndex]
  const canGoPrev = currentQuestionIndex > 0
  const canGoNext = currentQuestionIndex < questions.length - 1

  const handleRejectQuestion = () => {
    setShowRejectConfirm(true)
  }

  const confirmRejectQuestion = async () => {
    if (!currentQuestion) return

    const removedIndex = currentQuestionIndex
    const nextIndex = questions.length <= 1 ? 0 : removedIndex < questions.length - 1 ? removedIndex : removedIndex - 1
    // Dùng originalIndex (vị trí trong mảng gốc chưa filter) để gọi API đúng
    const apiIndex = currentQuestion.originalIndex ?? currentQuestionIndex

    try {
      await onRejectQuestion(draft.id, apiIndex, {
        question: currentQuestion.question,
        options: currentQuestion.options,
        correctIndex: currentQuestion.correctIndex,
        explanation: currentQuestion.explanation
      })
      setCurrentIndex(nextIndex)
      setShowRejectConfirm(false)
    } catch {
      // Mutation handlers already show toast and refetch the draft.
      setShowRejectConfirm(false)
    }
  }

  const handleAcceptQuestion = async () => {
    if (!currentQuestion) return

    const removedIndex = currentQuestionIndex
    const nextIndex = questions.length <= 1 ? 0 : removedIndex < questions.length - 1 ? removedIndex : removedIndex - 1
    // Dùng originalIndex (vị trí trong mảng gốc chưa filter) để gọi API đúng
    const apiIndex = currentQuestion.originalIndex ?? currentQuestionIndex

    try {
      await onAcceptQuestion(draft.id, apiIndex, {
        question: currentQuestion.question,
        options: currentQuestion.options,
        correctIndex: currentQuestion.correctIndex,
        explanation: currentQuestion.explanation
      })
      setCurrentIndex(nextIndex)
    } catch {
      // Mutation handlers already show toast and refetch the draft.
    }
  }

  return (
    <section
      id='quiz-review-workspace'
      className='mt-6 rounded-[2.5rem] border border-emerald-500/15 bg-gradient-to-b from-background to-emerald-50/40 shadow-[0_24px_80px_rgba(15,23,42,0.08)] overflow-hidden'
    >
      <div className='border-b border-border/60 bg-background/80 backdrop-blur-xl px-6 py-5 sm:px-8 sm:py-6'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
          <div className='space-y-3'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge className='bg-emerald-600 hover:bg-emerald-600 gap-1.5'>
                <Sparkles className='h-3.5 w-3.5' />
                Bản nháp AI
              </Badge>
              <Badge variant='secondary' className='gap-1.5'>
                <Clock3 className='h-3.5 w-3.5' />
                {formatDistanceToNow(new Date(draft.createdAt), { addSuffix: true, locale: vi })}
              </Badge>
              {/* <Badge variant='outline' className='uppercase tracking-[0.18em] text-[10px]'>
                {statusLabel}
              </Badge>
              <Badge variant='outline' className='uppercase tracking-[0.18em] text-[10px]'>
                {promptVersion}
              </Badge> */}
            </div>

            <div className='space-y-1.5'>
              <h3 className='text-2xl font-black tracking-tight text-foreground'>Bảng duyệt câu hỏi AI</h3>
              {/* <p className='max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed'>
                Duyệt trực tiếp theo danh sách, xem nhanh đáp án đúng, và kiểm tra giải thích trước khi publish hoặc
                reject. Vùng danh sách có scroll riêng nên số lượng câu hỏi nhiều vẫn không vỡ layout.
              </p> */}
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <Button
              variant='outline'
              className='gap-2 border-emerald-200 bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100/80'
              onClick={() => onPublish(draft.id)}
              disabled={isSubmitting || questions.length === 0}
            >
              <ThumbsUp className='h-4 w-4' />
              Duyệt bộ câu hỏi
            </Button>
            <Button
              variant='outline'
              className='gap-2 border-rose-200 bg-rose-50/70 text-rose-700 hover:bg-rose-100/80'
              onClick={handleReject}
              disabled={isSubmitting}
            >
              <ThumbsDown className='h-4 w-4' />
              {showRejectInput ? 'Gửi từ chối' : 'Từ chối'}
            </Button>
          </div>
        </div>
      </div>

      <div className='grid gap-0 lg:grid-cols-[320px_minmax(0,1fr)]'>
        <aside className='border-b border-border/60 bg-muted/25 p-5 sm:p-6 lg:border-b-0 lg:border-r lg:sticky lg:top-0 lg:h-[78vh] lg:overflow-y-auto'>
          <div className='space-y-4'>
            <Card className='border-emerald-500/15 bg-white/90 shadow-sm'>
              <CardContent className='p-4 space-y-3'>
                <div className='flex items-center gap-2 text-sm font-semibold text-foreground'>
                  <WandSparkles className='h-4 w-4 text-emerald-600' />
                  Tóm tắt nhanh
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='rounded-2xl bg-emerald-50 px-3 py-3'>
                    <div className='text-[11px] uppercase tracking-[0.18em] text-emerald-700/70'>Câu hỏi</div>
                    <div className='mt-1 text-2xl font-black text-emerald-700'>{questions.length}</div>
                  </div>
                  <div className='rounded-2xl bg-amber-50 px-3 py-3'>
                    <div className='text-[11px] uppercase tracking-[0.18em] text-amber-700/70'>Còn lại</div>
                    <div className='mt-1 text-2xl font-black text-amber-700'>{questions.length}</div>
                  </div>
                  {/* <div className='rounded-2xl bg-slate-100 px-3 py-3'>
                    <div className='text-[11px] uppercase tracking-[0.18em] text-slate-600'>Prompt</div>
                    <div className='mt-1 text-2xl font-black text-slate-800'>{promptVersion}</div>
                  </div> */}
                </div>
                {/* <div className='rounded-2xl border border-dashed border-border bg-background px-3 py-3 text-sm text-muted-foreground'>
                  <span className='font-semibold text-foreground'>Mẹo duyệt:</span> hãy ưu tiên kiểm tra độ rõ của câu
                  hỏi, độ nhiễu của phương án và phần giải thích.
                </div> */}
              </CardContent>
            </Card>

            {/* <Card className='border-border/70 bg-white/90 shadow-sm'>
              <CardContent className='p-4 space-y-3'>
                <div className='flex items-center gap-2 text-sm font-semibold text-foreground'>
                  <AlertCircle className='h-4 w-4 text-amber-600' />
                  Ghi chú từ chối
                </div>
                {!showRejectInput ? (
                  <div className='text-sm text-muted-foreground leading-relaxed'>
                    Nếu nội dung chưa đạt, bấm <span className='font-semibold text-foreground'>Từ chối</span> để mở ô
                    góp ý. Ghi chú sẽ giúp lần sinh sau tốt hơn.
                  </div>
                ) : (
                  <Textarea
                    placeholder='Nhập lý do hoặc góp ý để AI cải thiện...'
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    className='min-h-[160px] resize-none bg-background'
                  />
                )}
              </CardContent>
            </Card> */}
          </div>
        </aside>

        <div className='min-w-0 p-5 sm:p-6 lg:p-6'>
          <div className='rounded-[2rem] border border-border/70 bg-white/90 shadow-sm overflow-hidden'>
            <div className='border-b border-border/70 px-5 py-4 sm:px-6 sm:py-5'>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <h4 className='text-lg font-bold text-foreground'>Câu hỏi đang duyệt</h4>
                  <p className='text-sm text-muted-foreground'>Duyệt từng câu bằng nút điều hướng bên cạnh.</p>
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='gap-1.5'
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    disabled={!canGoPrev || isSubmitting}
                  >
                    <ChevronLeft className='h-4 w-4' />
                    Trước
                  </Button>
                  <Badge variant='secondary' className='px-3 py-1 rounded-full'>
                    {currentQuestionIndex + 1}/{questions.length}
                  </Badge>
                  <Button
                    variant='outline'
                    size='sm'
                    className='gap-1.5'
                    onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                    disabled={!canGoNext || isSubmitting}
                  >
                    Tiếp theo
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>

            <div className='bg-gradient-to-b from-white to-slate-50/60 px-5 py-6 sm:px-6 sm:py-8'>
              {questions.length > 0 && currentQuestion ? (
                <div className='mx-auto flex max-w-4xl flex-col gap-6'>
                  <div className='flex items-center justify-between'>
                    <Badge variant='outline' className='rounded-full px-3 py-1 uppercase tracking-[0.18em] text-[10px]'>
                      Câu {currentQuestionIndex + 1}/{questions.length}
                    </Badge>
                  </div>

                  <Card className='border-border/70 shadow-[0_10px_40px_rgba(15,23,42,0.06)] overflow-hidden'>
                    <CardContent className='p-0'>
                      <div className='border-b border-border/60 bg-gradient-to-r from-slate-50 to-transparent px-5 py-5 sm:px-7 sm:py-6'>
                        <div className='text-sm font-medium text-muted-foreground mb-2'>Câu hỏi</div>
                        <div className='text-xl sm:text-2xl font-semibold leading-relaxed text-foreground'>
                          {currentQuestion.question}
                        </div>
                      </div>

                      <div className='grid gap-3 px-5 py-5 sm:px-7 sm:py-6 sm:grid-cols-2'>
                        {currentQuestion.options.map((opt, oIdx) => {
                          const isCorrect = oIdx === currentQuestion.correctIndex
                          return (
                            <div
                              key={oIdx}
                              className={`rounded-2xl border px-4 py-4 text-sm sm:text-base leading-relaxed transition-colors ${
                                isCorrect
                                  ? 'border-emerald-300 bg-emerald-50 text-emerald-900 shadow-[0_8px_24px_rgba(16,185,129,0.08)]'
                                  : 'border-border/70 bg-background text-muted-foreground'
                              }`}
                            >
                              <div className='flex items-start justify-between gap-3'>
                                <span className='font-medium'>{opt}</span>
                                {isCorrect && <Check className='mt-0.5 h-4 w-4 shrink-0 text-emerald-600' />}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className='border-t border-border/60 bg-muted/20 px-5 py-5 sm:px-7 sm:py-6'>
                        <div className='rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-4 text-sm text-amber-900'>
                          <div className='text-[11px] uppercase tracking-[0.18em] text-amber-700/70'>Giải thích</div>
                          <div className='mt-1 leading-relaxed whitespace-pre-wrap break-words'>
                            {currentQuestion.explanation || 'Không có giải thích đi kèm.'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className='flex flex-col gap-3 rounded-[1.5rem] border border-border/70 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
                    {/* <div className='text-sm text-muted-foreground'>
                      Duyệt câu này để thêm vào quiz hiện có, hoặc để hệ thống tạo quiz mới nếu chưa có. Từ chối sẽ xóa
                      câu khỏi bản nháp.
                    </div> */}
                    <div className='flex flex-wrap items-center gap-2'>
                      <Button
                        variant='outline'
                        className='gap-2 border-sky-200 bg-sky-50/70 text-sky-700 hover:bg-sky-100/80'
                        onClick={handleEdit}
                        disabled={isSubmitting || !currentQuestion}
                      >
                        <Pencil className='h-4 w-4' />
                        Chỉnh sửa câu này
                      </Button>
                      <Button
                        variant='outline'
                        className='gap-2 border-emerald-200 bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100/80'
                        onClick={handleAcceptQuestion}
                        disabled={isSubmitting || !currentQuestion}
                      >
                        <Check className='h-4 w-4' />
                        Duyệt câu này
                      </Button>
                      <Button
                        variant='outline'
                        className='gap-2 border-rose-200 bg-rose-50/70 text-rose-700 hover:bg-rose-100/80'
                        onClick={handleRejectQuestion}
                        disabled={isSubmitting || !currentQuestion}
                      >
                        <X className='h-4 w-4' />
                        Từ chối câu này
                      </Button>
                    </div>
                  </div>


                </div>
              ) : (
                <div className='flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-dashed border-border bg-muted/20 py-20 text-center'>
                  <div className='flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm'>
                    <Sparkles className='h-8 w-8 text-muted-foreground' />
                  </div>
                  <div className='space-y-1'>
                    <p className='text-lg font-bold text-foreground'>Không còn câu hỏi đang chờ duyệt</p>
                    <p className='max-w-md text-sm text-muted-foreground'>
                      Các câu đã duyệt đã được chuyển vào quiz hiện tại. Câu bị từ chối đã được xóa khỏi bản nháp.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DraftQuestionEditorModal
          open={isEditOpen}
          onOpenChange={(open) => {
            setIsEditOpen(open)
            if (!open) setEditingQuestionIndex(null)
          }}
          initialData={currentQuestion ?? null}
          onSave={async (body) => {
            // Dùng originalIndex để gọi API đúng vị trí trong mảng gốc
            const targetQuestion = editingQuestionIndex !== null ? questions[editingQuestionIndex] : currentQuestion
            const apiIndex = targetQuestion?.originalIndex ?? editingQuestionIndex ?? currentQuestionIndex
            await onUpdateQuestion(draft.id, apiIndex, body)
          }}
        />

        <Dialog open={showRejectConfirm} onOpenChange={setShowRejectConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Từ chối câu hỏi</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn từ chối và xóa câu hỏi này khỏi bản nháp không? Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectConfirm(false)}>Hủy</Button>
              <Button variant="destructive" onClick={confirmRejectQuestion} disabled={isSubmitting}>
                Từ chối
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
