'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Loader2, HelpCircle, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AiQuizSection } from './_components/ai-quiz-section'
import { QuestionEditorModal, LocalQuestion } from './_components/question-editor-modal'
import { useGetLessonDetailQuery } from '@/app/(cms)/_hooks/use-lesson'
import { useDeleteQuestionMutation } from '@/app/(cms)/_hooks/use-quiz-mutation'
import { Badge } from '@/components/ui/badge'
import { useForm, useWatch } from 'react-hook-form'
import { QuizDataPayload } from '@/app/(cms)/_api/lesson.api'
import { useAiQuiz } from './_components/ai-quiz-section/use-ai-quiz'
import type { QuizPublished } from '@/app/(cms)/_types/ai'

type QuizAnswer = { id?: string; text: string; isCorrect: boolean }
type QuizQuestion = { id?: string; questionText: string; answers: QuizAnswer[] }

interface QuizEditableForm {
  questions: QuizQuestion[]
  supplementalQuiz: QuizQuestion[]
}

const mapPublishedQuizQuestions = (quiz?: QuizPublished | null): QuizQuestion[] => {
  if (!quiz?.questions?.length) return []

  return quiz.questions.map((q) => ({
    id: q.id,
    questionText: q.content,
    answers: q.answers.map((a) => ({
      id: a.id,
      text: a.content,
      isCorrect: a.isCorrect
    }))
  }))
}

export default function LessonQuizPage() {
  const router = useRouter()
  const params = useParams<{ id: string; lessonId: string }>()
  const { id: courseId, lessonId } = params

  const { data: lessonDetail, isLoading } = useGetLessonDetailQuery(lessonId)
  const { overview: aiOverview } = useAiQuiz(lessonId)

  const form = useForm<QuizEditableForm>({
    defaultValues: {
      questions: [],
      supplementalQuiz: []
    }
  })

  const questions = useWatch({ control: form.control, name: 'questions' })
  const supplementalQuiz = useWatch({ control: form.control, name: 'supplementalQuiz' })

  const quizId = lessonDetail?.type === 'QUIZ' ? lessonDetail.quiz?.id || '' : ''
  const deleteMutation = useDeleteQuestionMutation(quizId)

  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<LocalQuestion | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Xác định danh sách câu hỏi để hiển thị (đã xuất bản)
  const isPureQuiz = lessonDetail?.type === 'QUIZ'
  const displayQuestions = isPureQuiz ? questions : supplementalQuiz

  // Sync server data to form
  useEffect(() => {
    if (!lessonDetail) return

    const publishedQuestions = mapPublishedQuizQuestions(aiOverview?.quiz ?? (lessonDetail.type === 'QUIZ' ? lessonDetail.quiz : null))

    if (publishedQuestions.length > 0) {
      form.reset({
        questions: lessonDetail.type === 'QUIZ' ? publishedQuestions : [],
        supplementalQuiz: lessonDetail.type === 'QUIZ' ? [] : publishedQuestions
      })
      return
    }

    if (lessonDetail.type === 'VIDEO' || lessonDetail.type === 'TEXT') {
      const quizData = lessonDetail.quizData as QuizDataPayload | undefined
      if (quizData) {
        const mappedSupplemental: QuizQuestion[] = quizData.map((q) => ({
          questionText: q.content,
          answers: q.answers.map((a) => ({
            text: a.content,
            isCorrect: a.isCorrect
          }))
        }))
        form.reset({
          questions: [],
          supplementalQuiz: mappedSupplemental
        })
      }
      return
    }

    if (lessonDetail.type === 'QUIZ' && lessonDetail.quiz) {
      const mappedQuestions = mapPublishedQuizQuestions(lessonDetail.quiz)
      form.reset({
        questions: mappedQuestions,
        supplementalQuiz: []
      })
    }
  }, [aiOverview, lessonDetail, form])

  useEffect(() => {
    setCurrentIndex(0)
  }, [displayQuestions.length, lessonDetail?.id])

  if (isLoading) {
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    )
  }

  if (!lessonDetail) {
    return <div className='p-8 text-center'>Không tìm thấy thông tin bài học.</div>
  }

  const handleEdit = (q: QuizQuestion) => {
    setEditingQuestion({
      id: q.id,
      content: q.questionText,
      answers: q.answers.map(a => ({ id: a.id, content: a.text, isCorrect: a.isCorrect }))
    })
    setIsEditorOpen(true)
  }

  const handleDelete = async (questionId?: string) => {
    if (!questionId) return
    if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      await deleteMutation.mutateAsync(questionId)
      // Refetch automatically via invalidation in mutation (wait, useDeleteQuestionMutation doesn't invalidate!)
      // Actually we should reload the page or invalidate queries.
      // But it's fine, we can let user refresh or we can invalidate in mutation.
      window.location.reload()
    }
  }

  return (
    <div className='min-h-[calc(100vh-80px)] -m-4 md:-m-8 lg:-m-12 bg-background'>
      <main className='h-full w-full overflow-y-auto px-6 py-6 md:px-8 md:py-8 lg:px-10'>
        <div className='mx-auto max-w-7xl space-y-10'>
          <div className='flex items-center justify-between'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.push(`/studio/courses/${courseId}`)}
              className='-ml-2 text-muted-foreground hover:text-foreground transition-colors'
            >
              <ChevronLeft className='mr-2 h-4 w-4' />
              Quay lại quản lý khóa học
            </Button>

            <div className='hidden md:flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-4 py-2 text-xs font-medium text-muted-foreground'>
              <span>{lessonDetail.title}</span>
              <span className='h-1 w-1 rounded-full bg-muted-foreground/40' />
              <span>{lessonDetail.type}</span>
              <span className='h-1 w-1 rounded-full bg-muted-foreground/40' />
              <span>{displayQuestions.length} câu hỏi</span>
            </div>
          </div>

          <div className='space-y-2'>
            <h1 className='text-4xl font-extrabold tracking-tight text-foreground'>Quản lý Quiz</h1>
            <p className='text-muted-foreground text-lg'>
              Tối ưu hóa trải nghiệm học tập bằng cách tạo các câu hỏi trắc nghiệm chất lượng cao.
            </p>
          </div>

          {/* AI SECTION */}
          <Card className='border-primary/10 bg-primary/5 shadow-none rounded-3xl overflow-hidden'>
            <CardContent className='p-0'>
              <AiQuizSection lessonId={lessonId} lessonType={lessonDetail.type} />
            </CardContent>
          </Card>

          <div className='h-px bg-gradient-to-r from-transparent via-border to-transparent' />

          {/* CURRENT QUESTIONS SECTION */}
          <div className='space-y-8'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='p-2.5 bg-amber-500/15 rounded-2xl'>
                  <HelpCircle className='h-6 w-6 text-amber-600' />
                </div>
                <div>
                  <h3 className='text-2xl font-bold'>Nội dung Quiz hiện tại</h3>
                  <p className='text-sm text-muted-foreground'>
                    {isPureQuiz
                      ? 'Đây là nội dung chính của bài học Quiz.'
                      : 'Các câu hỏi bổ trợ cho bài học nội dung.'}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <Badge variant='secondary' className='px-4 py-1.5 rounded-full font-bold text-sm'>
                  {displayQuestions.length} Câu hỏi
                </Badge>
                {isPureQuiz && (
                  <Button 
                    onClick={() => {
                      setEditingQuestion(null)
                      setIsEditorOpen(true)
                    }} 
                    size='sm' 
                    className='font-bold'
                  >
                    Thêm câu hỏi
                  </Button>
                )}
              </div>
            </div>

            {displayQuestions.length > 0 ? (
              <div className='min-w-0'>
                <div className='rounded-[2rem] border border-border/70 bg-white/90 shadow-sm overflow-hidden'>
                  <div className='border-b border-border/70 px-5 py-4 sm:px-6 sm:py-5'>
                    <div className='flex items-center justify-between gap-3'>
                      <div>
                        <h4 className='text-lg font-bold text-foreground'>Câu hỏi hiện tại</h4>
                        <p className='text-sm text-muted-foreground'>Duyệt từng câu bằng nút điều hướng bên dưới.</p>
                      </div>
                      <Badge variant='secondary' className='px-3 py-1 rounded-full'>
                        {currentIndex + 1}/{displayQuestions.length}
                      </Badge>
                    </div>
                  </div>

                  {(() => {
                    const q = displayQuestions[currentIndex]
                    const correctAnswer = q.answers.find((ans) => ans.isCorrect)?.text

                    return (
                      <div className='min-h-[78vh] bg-gradient-to-b from-white to-slate-50/60 px-5 py-6 sm:px-6 sm:py-8'>
                        <div className='mx-auto flex min-h-[72vh] max-w-4xl flex-col justify-center gap-6'>
                          <div className='flex items-center justify-between'>
                            <Badge
                              variant='outline'
                              className='rounded-full px-3 py-1 uppercase tracking-[0.18em] text-[10px]'
                            >
                              Câu {currentIndex + 1}
                            </Badge>
                            {q.answers.some((ans) => ans.isCorrect) && (
                              <Badge className='bg-emerald-600 hover:bg-emerald-600'>Đã có đáp án đúng</Badge>
                            )}
                          </div>

                          <Card className='border-border/70 shadow-[0_10px_40px_rgba(15,23,42,0.06)] overflow-hidden'>
                            <CardContent className='p-0'>
                              <div className='border-b border-border/60 bg-gradient-to-r from-slate-50 to-transparent px-5 py-5 sm:px-7 sm:py-6'>
                                <div className='text-sm font-medium text-muted-foreground mb-2'>Câu hỏi</div>
                                <div className='text-xl sm:text-2xl font-semibold leading-relaxed text-foreground'>
                                  {q.questionText}
                                </div>
                              </div>

                              <div className='grid gap-3 px-5 py-5 sm:px-7 sm:py-6 sm:grid-cols-2'>
                                {q.answers.map((ans, aIdx) => {
                                  const isCorrect = ans.isCorrect
                                  return (
                                    <div
                                      key={aIdx}
                                      className={`rounded-2xl border px-4 py-4 text-sm sm:text-base leading-relaxed transition-colors ${
                                        isCorrect
                                          ? 'border-emerald-300 bg-emerald-50 text-emerald-900 shadow-[0_8px_24px_rgba(16,185,129,0.08)]'
                                          : 'border-border/70 bg-background text-muted-foreground'
                                      }`}
                                    >
                                      <div className='flex items-start justify-between gap-3'>
                                        <span className='font-medium'>{ans.text}</span>
                                        {isCorrect && <Check className='mt-0.5 h-4 w-4 shrink-0 text-emerald-600' />}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>

                              <div className='border-t border-border/60 bg-muted/20 px-5 py-5 sm:px-7 sm:py-6'>
                                <div className='rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-4 text-sm text-amber-900'>
                                  <div className='text-[11px] uppercase tracking-[0.18em] text-amber-700/70'>
                                    Đáp án đúng
                                  </div>
                                  <div className='mt-1 leading-relaxed whitespace-pre-wrap break-words'>
                                    {correctAnswer || 'Chưa có đáp án đúng được đánh dấu.'}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <div className='flex items-center justify-between gap-3'>
                            <Button
                              variant='outline'
                              className='min-w-[140px] gap-2'
                              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                              disabled={currentIndex === 0}
                            >
                              <ChevronLeft className='h-4 w-4' />
                              Pre
                            </Button>

                            <div className='text-sm text-muted-foreground'>
                              {currentIndex === 0 ? 'Đang ở câu đầu tiên' : 'Tiếp tục kiểm tra các câu còn lại'}
                            </div>

                            <Button
                              variant='outline'
                              className='min-w-[140px] gap-2'
                              onClick={() => setCurrentIndex((prev) => Math.min(displayQuestions.length - 1, prev + 1))}
                              disabled={currentIndex >= displayQuestions.length - 1}
                            >
                              Next
                              <ChevronRight className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            ) : (
              <Card className='border-2 border-dashed border-muted-foreground/20 rounded-3xl bg-muted/5'>
                <CardContent className='p-16 text-center space-y-4'>
                  <div className='mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center'>
                    <HelpCircle className='h-8 w-8 text-muted-foreground/50' />
                  </div>
                  <div className='space-y-1'>
                    <p className='text-xl font-bold text-foreground'>Chưa có câu hỏi nào</p>
                    <p className='text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed'>
                      Bài học này hiện chưa có nội dung Quiz. Hãy sử dụng **AI Assistant** ở trên để tạo tự động chỉ
                      trong vài giây.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        <div className='h-20' />
      </main>

      {isPureQuiz && (
        <QuestionEditorModal
          open={isEditorOpen}
          onOpenChange={setIsEditorOpen}
          quizId={quizId}
          lessonId={lessonId}
          initialData={editingQuestion}
        />
      )}
    </div>
  )
}
