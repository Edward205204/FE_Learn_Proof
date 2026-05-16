'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Loader2, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { QuizSidebar } from '@/app/(cms)/_components/quiz-sidebar'
import { AiQuizSection } from './_components/ai-quiz-section'
import { QuestionEditorModal, LocalQuestion } from './_components/question-editor-modal'
import { useGetLessonDetailQuery } from '@/app/(cms)/_hooks/use-lesson'
import { useDeleteQuestionMutation } from '@/app/(cms)/_hooks/use-quiz-mutation'
import { Badge } from '@/components/ui/badge'
import { useForm, useWatch } from 'react-hook-form'
import { QuizDataPayload } from '@/app/(cms)/_api/lesson.api'

type QuizAnswer = { id?: string; text: string; isCorrect: boolean }
type QuizQuestion = { id?: string; questionText: string; answers: QuizAnswer[] }

interface QuizEditableForm {
  questions: QuizQuestion[]
  supplementalQuiz: QuizQuestion[]
}

export default function LessonQuizPage() {
  const router = useRouter()
  const params = useParams<{ id: string; lessonId: string }>()
  const { id: courseId, lessonId } = params

  const { data: lessonDetail, isLoading } = useGetLessonDetailQuery(lessonId)

  const form = useForm<QuizEditableForm>({
    defaultValues: {
      questions: [],
      supplementalQuiz: []
    }
  })

  const questions = useWatch({ control: form.control, name: 'questions' })
  const supplementalQuiz = useWatch({ control: form.control, name: 'supplementalQuiz' })

  const quizId = lessonDetail?.quiz?.id || ''
  const deleteMutation = useDeleteQuestionMutation(quizId)

  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<LocalQuestion | null>(null)

  // Sync server data to form
  useEffect(() => {
    if (!lessonDetail) return

    if (lessonDetail.type === 'QUIZ' && lessonDetail.quiz) {
      const mappedQuestions: QuizQuestion[] = lessonDetail.quiz.questions.map((q) => ({
        id: q.id,
        questionText: q.content,
        answers: q.answers.map((a) => ({
          id: a.id,
          text: a.content,
          isCorrect: a.isCorrect
        }))
      }))
      form.reset({
        questions: mappedQuestions,
        supplementalQuiz: []
      })
    } else if (lessonDetail.type === 'VIDEO' || lessonDetail.type === 'TEXT') {
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
    }
  }, [lessonDetail, form])

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

  // Xác định danh sách câu hỏi để hiển thị (đã xuất bản)
  const isPureQuiz = lessonDetail.type === 'QUIZ'
  const displayQuestions = isPureQuiz ? questions : supplementalQuiz

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
    <div className='flex h-full min-h-[calc(100vh-80px)] -m-4 md:-m-8 lg:-m-12 bg-background'>
      {/* Sidebar */}
      <QuizSidebar
        title={lessonDetail.title}
        infoLines={[
          `Loại: ${lessonDetail.type}`,
          `ID: ${lessonId.substring(0, 8)}...`,
          `Câu hỏi: ${displayQuestions.length}`
        ]}
        showBackLink={!isPureQuiz}
        backHref={!isPureQuiz ? `/studio/courses/${courseId}/lesson/${lessonId}/edit` : undefined}
      />

      {/* Main Content */}
      <main className='flex-1 p-6 md:p-10 overflow-y-auto'>
        <div className='max-w-4xl mx-auto space-y-10'>
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
              <div className='grid gap-6'>
                {displayQuestions.map((q, idx) => (
                  <Card
                    key={idx}
                    className='border-border/40 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md rounded-2xl'
                  >
                    <CardContent className='p-6 sm:p-8'>
                      <div className='flex items-start justify-between gap-4 mb-6'>
                        <div className='flex items-start gap-4'>
                          <span className='flex-shrink-0 h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold'>
                            {idx + 1}
                          </span>
                          <div className='text-xl font-semibold leading-snug'>{q.questionText}</div>
                        </div>
                        {isPureQuiz && (
                          <div className='flex gap-2'>
                            <Button variant='outline' size='sm' onClick={() => handleEdit(q)}>
                              Sửa
                            </Button>
                            <Button variant='destructive' size='sm' onClick={() => handleDelete(q.id)}>
                              Xóa
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {q.answers.map((ans, aIdx) => (
                          <div
                            key={aIdx}
                            className={`p-4 rounded-2xl border transition-all ${
                              ans.isCorrect
                                ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-800 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                                : 'bg-muted/10 border-transparent text-muted-foreground'
                            }`}
                          >
                            <div className='flex items-center justify-between gap-3'>
                              <span className='font-medium'>{ans.text}</span>
                              {ans.isCorrect && (
                                <Badge className='bg-emerald-500 hover:bg-emerald-500 text-[10px] h-5 px-2 uppercase tracking-tighter'>
                                  Đúng
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
