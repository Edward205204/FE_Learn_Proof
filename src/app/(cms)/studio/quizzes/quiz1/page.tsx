'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Plus, Trash2, CheckCircle2, Circle, Pencil, Check, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { QuizSidebar } from '@/app/(cms)/_components/quiz-sidebar'
import { useGetLessonDetailQuery, LESSON_QUERY_KEYS } from '@/app/(cms)/_hooks/use-lesson'
import {
  useAddQuestionMutation,
  useEditQuestionMutation,
  useDeleteQuestionMutation,
  useAddAnswerMutation,
  useChooseCorrectAnswerMutation,
  useDeleteQuizMutation
} from '@/app/(cms)/_hooks/use-quiz-mutation'
import type { QuizLessonDetail } from '@/app/(cms)/_api/lesson.api'
import { useQueryClient } from '@tanstack/react-query'

// ─── Types ─────────────────────────────────────────────────────────────────────

type QuizQuestion = {
  id: string
  content: string
  isEdit: boolean
  answers: { id: string; content: string; isCorrect: boolean }[]
}

type QuizAnswer = { id: string; content: string; isCorrect: boolean }

// ─── Add Question Form ──────────────────────────────────────────────────────────

function AddQuestionForm({ quizId, onDone }: { quizId: string; onDone: () => void }) {
  const [content, setContent] = useState('')
  const [answers, setAnswers] = useState([
    { content: '', isCorrect: true },
    { content: '', isCorrect: false }
  ])

  const { mutate: addQuestion, isPending } = useAddQuestionMutation(quizId)

  const setAnswerContent = (idx: number, val: string) => {
    setAnswers((prev) => prev.map((a, i) => (i === idx ? { ...a, content: val } : a)))
  }

  const toggleCorrect = (idx: number) => {
    setAnswers((prev) => prev.map((a, i) => ({ ...a, isCorrect: i === idx })))
  }

  const addAnswerRow = () => {
    setAnswers((prev) => [...prev, { content: '', isCorrect: false }])
  }

  const removeAnswerRow = (idx: number) => {
    if (answers.length <= 2) return
    setAnswers((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = () => {
    if (!content.trim() || answers.some((a) => !a.content.trim())) return
    addQuestion(
      { content, answers },
      {
        onSuccess: () => {
          setContent('')
          setAnswers([
            { content: '', isCorrect: true },
            { content: '', isCorrect: false }
          ])
          onDone()
        }
      }
    )
  }

  return (
    <Card className='border-2 border-primary/30 rounded-2xl shadow-sm bg-primary/5'>
      <CardContent className='p-6 space-y-4'>
        <p className='text-xs font-extrabold text-primary uppercase tracking-wider'>Câu hỏi mới</p>
        <Input
          placeholder='Nhập nội dung câu hỏi...'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className='h-11 font-medium bg-background border-border/50 focus-visible:ring-primary/20 rounded-xl'
        />

        <div className='space-y-2'>
          <p className='text-[11px] font-bold uppercase text-muted-foreground tracking-wider'>
            Đáp án (chọn đáp án đúng bằng cách click vào ô tròn)
          </p>
          {answers.map((ans, idx) => (
            <div key={idx} className='flex items-center gap-2'>
              <button
                type='button'
                onClick={() => toggleCorrect(idx)}
                className='shrink-0 text-muted-foreground hover:text-primary transition-colors'
              >
                {ans.isCorrect ? <CheckCircle2 className='h-5 w-5 text-primary' /> : <Circle className='h-5 w-5' />}
              </button>
              <Input
                placeholder={`Đáp án ${idx + 1}...`}
                value={ans.content}
                onChange={(e) => setAnswerContent(idx, e.target.value)}
                className='h-9 text-sm bg-background border-border/50 focus-visible:ring-primary/20 rounded-xl flex-1'
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-muted-foreground hover:text-destructive shrink-0'
                onClick={() => removeAnswerRow(idx)}
                disabled={answers.length <= 2}
              >
                <X className='h-3.5 w-3.5' />
              </Button>
            </div>
          ))}

          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={addAnswerRow}
            className='text-xs text-muted-foreground hover:text-foreground'
          >
            <Plus className='h-3.5 w-3.5 mr-1' /> Thêm đáp án
          </Button>
        </div>

        <div className='flex justify-end gap-2 pt-2'>
          <Button variant='ghost' size='sm' onClick={onDone} disabled={isPending}>
            Hủy
          </Button>
          <Button size='sm' onClick={handleSubmit} disabled={isPending} className='rounded-xl shadow-sm'>
            {isPending ? <Loader2 className='h-4 w-4 animate-spin mr-1' /> : <Check className='h-4 w-4 mr-1' />}
            Lưu câu hỏi
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Question Card (hiển thị + inline edit) ────────────────────────────────────

function QuestionItem({
  question,
  index,
  quizId,
  lessonId
}: {
  question: QuizQuestion
  index: number
  quizId: string
  lessonId: string
}) {
  const queryClient = useQueryClient()
  const [editingContent, setEditingContent] = useState<string | null>(null)

  const { mutate: editQuestion, isPending: editingQ } = useEditQuestionMutation(quizId)
  const { mutate: deleteQuestion, isPending: deletingQ } = useDeleteQuestionMutation(quizId)
  const { mutate: addAnswer, isPending: addingA } = useAddAnswerMutation(quizId, question.id)
  const { mutate: chooseCorrect, isPending: choosingC } = useChooseCorrectAnswerMutation(quizId, question.id)

  const [newAnswerText, setNewAnswerText] = useState('')
  const [showAddAnswer, setShowAddAnswer] = useState(false)

  const invalidate = () => queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.detail(lessonId) })

  const handleSaveQuestion = () => {
    if (!editingContent?.trim()) return
    editQuestion(
      { questionId: question.id, content: editingContent },
      {
        onSuccess: () => {
          setEditingContent(null)
          invalidate()
        }
      }
    )
  }

  const handleDeleteQuestion = () => {
    deleteQuestion(question.id, { onSuccess: invalidate })
  }

  const handleAddAnswer = () => {
    if (!newAnswerText.trim()) return
    addAnswer(
      { content: newAnswerText },
      {
        onSuccess: () => {
          setNewAnswerText('')
          setShowAddAnswer(false)
          invalidate()
        }
      }
    )
  }

  const handleChooseCorrect = (answerId: string) => {
    chooseCorrect(answerId, { onSuccess: invalidate })
  }

  return (
    <Card className='border border-border/60 shadow-sm rounded-2xl overflow-hidden'>
      <CardContent className='p-0'>
        {/* Question Header */}
        <div className='flex items-start justify-between p-5 pb-3 gap-3'>
          <div className='flex items-start gap-3 flex-1 min-w-0'>
            <span className='mt-0.5 h-6 w-6 rounded-full bg-primary/10 text-primary text-[10px] font-black flex items-center justify-center ring-1 ring-primary/20 shrink-0'>
              {index + 1}
            </span>
            {editingContent !== null ? (
              <div className='flex-1 flex items-center gap-2'>
                <Input
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className='h-9 text-sm font-medium bg-muted/30 border-border/50 focus-visible:ring-primary/20 rounded-xl'
                  autoFocus
                />
                <Button
                  size='icon'
                  variant='ghost'
                  className='h-8 w-8 shrink-0'
                  onClick={handleSaveQuestion}
                  disabled={editingQ}
                >
                  {editingQ ? <Loader2 className='h-4 w-4 animate-spin' /> : <Check className='h-4 w-4 text-primary' />}
                </Button>
                <Button
                  size='icon'
                  variant='ghost'
                  className='h-8 w-8 shrink-0'
                  onClick={() => setEditingContent(null)}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            ) : (
              <p className='font-semibold text-sm flex-1 pt-0.5'>{question.content}</p>
            )}
          </div>

          {editingContent === null && (
            <div className='flex items-center gap-1 shrink-0'>
              {question.isEdit && (
                <Badge
                  variant='outline'
                  className='text-[10px] text-amber-600 border-amber-400 bg-amber-50 dark:bg-amber-950'
                >
                  Đang chỉnh sửa
                </Badge>
              )}
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-muted-foreground hover:text-primary'
                onClick={() => setEditingContent(question.content)}
              >
                <Pencil className='h-3.5 w-3.5' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-muted-foreground hover:text-destructive'
                onClick={handleDeleteQuestion}
                disabled={deletingQ}
              >
                {deletingQ ? <Loader2 className='h-3.5 w-3.5 animate-spin' /> : <Trash2 className='h-3.5 w-3.5' />}
              </Button>
            </div>
          )}
        </div>

        {/* Answers */}
        <div className='px-5 pb-4 space-y-1.5'>
          {question.answers.map((ans: QuizAnswer) => (
            <div
              key={ans.id}
              className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors cursor-pointer group ${
                ans.isCorrect ? 'border-primary/30 bg-primary/5' : 'border-border/40 bg-muted/20 hover:bg-muted/40'
              }`}
              onClick={() => !ans.isCorrect && handleChooseCorrect(ans.id)}
            >
              {ans.isCorrect ? (
                <CheckCircle2 className='h-4 w-4 text-primary shrink-0' />
              ) : choosingC ? (
                <Loader2 className='h-4 w-4 animate-spin text-muted-foreground shrink-0' />
              ) : (
                <Circle className='h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors' />
              )}
              <span className={`text-sm flex-1 ${ans.isCorrect ? 'font-semibold text-primary' : 'text-foreground/80'}`}>
                {ans.content}
              </span>
              {ans.isCorrect && (
                <Badge className='text-[10px] bg-primary/10 text-primary border-primary/20 pointer-events-none'>
                  Đúng
                </Badge>
              )}
            </div>
          ))}

          {/* Add Answer */}
          {showAddAnswer ? (
            <div className='flex items-center gap-2 pt-1'>
              <Input
                placeholder='Nhập đáp án mới...'
                value={newAnswerText}
                onChange={(e) => setNewAnswerText(e.target.value)}
                className='h-9 text-sm bg-background border-border/50 focus-visible:ring-primary/20 rounded-xl flex-1'
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleAddAnswer()}
              />
              <Button
                size='icon'
                variant='ghost'
                className='h-8 w-8 shrink-0'
                onClick={handleAddAnswer}
                disabled={addingA}
              >
                {addingA ? <Loader2 className='h-4 w-4 animate-spin' /> : <Check className='h-4 w-4 text-primary' />}
              </Button>
              <Button
                size='icon'
                variant='ghost'
                className='h-8 w-8 shrink-0'
                onClick={() => {
                  setShowAddAnswer(false)
                  setNewAnswerText('')
                }}
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          ) : (
            <button
              type='button'
              onClick={() => setShowAddAnswer(true)}
              className='flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors mt-1 px-1'
            >
              <Plus className='h-3.5 w-3.5' /> Thêm đáp án
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main Editor ───────────────────────────────────────────────────────────────

function LessonQuizEditorContent() {
  const searchParams = useSearchParams()
  const lessonId = searchParams.get('lessonId') ?? ''

  const { data: lesson, isLoading } = useGetLessonDetailQuery(lessonId)
  const { mutate: deleteQuiz, isPending: deletingQuiz } = useDeleteQuizMutation()

  const [showAddQuestion, setShowAddQuestion] = useState(false)

  if (!lessonId) {
    return (
      <div className='flex flex-col items-center justify-center py-32 text-center'>
        <p className='font-bold text-foreground text-lg'>Không tìm thấy lessonId</p>
        <p className='text-sm text-muted-foreground mt-2'>
          Truy cập trang này thông qua đường dẫn từ trang quản lý Khóa học.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='flex flex-col gap-6 max-w-5xl mx-auto'>
        <div className='flex flex-col md:flex-row min-h-[calc(100vh-14rem)] rounded-3xl overflow-hidden border border-border/60 shadow-md bg-card animate-pulse'>
          <div className='w-64 bg-muted/30 shrink-0' />
          <div className='flex-1 p-10 space-y-4'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='h-32 rounded-2xl bg-muted/20 border border-border/30' />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!lesson || lesson.type !== 'QUIZ') {
    return (
      <div className='flex flex-col items-center justify-center py-32 text-center'>
        <p className='font-bold text-foreground text-lg'>Bài giảng không phải loại Quiz</p>
        <p className='text-sm text-muted-foreground mt-2'>ID: {lessonId}</p>
      </div>
    )
  }

  const quizLesson = lesson as QuizLessonDetail
  const quiz = quizLesson.quiz
  const questions = quiz?.questions ?? []

  return (
    <div className='flex flex-col gap-6 max-w-5xl mx-auto'>
      <div className='flex flex-col md:flex-row min-h-[calc(100vh-14rem)] rounded-3xl overflow-hidden border border-border/60 shadow-md bg-card animate-in fade-in slide-in-from-bottom-4 duration-500'>
        <QuizSidebar
          title='Quiz Builder'
          infoLines={[quizLesson.title, `${questions.length} câu hỏi${quiz ? ` · ID: ${quiz.id.slice(0, 8)}…` : ''}`]}
        />

        <main className='flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto bg-background/50'>
          <div className='max-w-3xl mx-auto space-y-8'>
            {/* Header */}
            <header className='flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 border-b border-border/50 pb-6'>
              <div className='space-y-1.5'>
                <p className='text-[11px] font-bold text-primary uppercase tracking-[0.2em]'>Bài kiểm tra</p>
                <h1 className='text-3xl font-extrabold tracking-tight text-foreground'>{quizLesson.title}</h1>
                {quizLesson.shortDesc && (
                  <p className='text-muted-foreground font-medium text-sm'>{quizLesson.shortDesc}</p>
                )}
              </div>

              {quiz && (
                <Button
                  variant='outline'
                  size='sm'
                  className='text-destructive border-destructive/40 hover:bg-destructive/10 rounded-xl font-semibold shrink-0'
                  onClick={() => deleteQuiz(quiz.id)}
                  disabled={deletingQuiz}
                >
                  {deletingQuiz ? (
                    <Loader2 className='h-4 w-4 animate-spin mr-1.5' />
                  ) : (
                    <Trash2 className='h-4 w-4 mr-1.5' />
                  )}
                  Xóa toàn bộ Quiz
                </Button>
              )}
            </header>

            {/* No quiz yet */}
            {!quiz && (
              <div className='flex flex-col items-center justify-center py-16 bg-muted/10 rounded-3xl border border-dashed border-border/50 text-center px-4'>
                <div className='h-16 w-16 bg-primary/5 rounded-full flex items-center justify-center mb-4 ring-1 ring-primary/10'>
                  <Plus className='h-8 w-8 text-primary/40' />
                </div>
                <p className='font-extrabold text-lg text-foreground'>Chưa có dữ liệu Quiz</p>
                <p className='text-sm text-muted-foreground mt-1 max-w-xs'>
                  Thêm câu hỏi đầu tiên để bắt đầu xây dựng bài kiểm tra.
                </p>
              </div>
            )}

            {/* Question List */}
            {questions.length > 0 && (
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-base font-extrabold flex items-center gap-2'>
                    Ngân hàng câu hỏi
                    <span className='bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-bold'>
                      {questions.length}
                    </span>
                  </h2>
                </div>
                {questions.map((q, idx) => (
                  <QuestionItem key={q.id} question={q} index={idx} quizId={quiz!.id} lessonId={lessonId} />
                ))}
              </div>
            )}

            {/* Add Question */}
            {quiz &&
              (showAddQuestion ? (
                <AddQuestionForm quizId={quiz.id} onDone={() => setShowAddQuestion(false)} />
              ) : (
                <Button
                  type='button'
                  variant='outline'
                  className='w-full py-8 border-dashed border-2 hover:bg-muted/50 hover:border-primary/30 transition-colors rounded-2xl text-muted-foreground hover:text-foreground font-bold'
                  onClick={() => setShowAddQuestion(true)}
                >
                  <Plus className='mr-2 h-5 w-5' /> Thêm câu hỏi mới
                </Button>
              ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function LessonQuizEditorPage() {
  return (
    <Suspense
      fallback={
        <div className='flex h-64 items-center justify-center'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
      }
    >
      <LessonQuizEditorContent />
    </Suspense>
  )
}
