'use client'

import { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { ChevronLeft, Plus, Video, FileText, HelpCircle, ArrowRight, Save, LayoutTemplate } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { ProfessionalEditor } from '@/components/common/professional-editor'
import { QuestionCard } from '../../../../../_components/question-card'
import { useCreateLessonMutation } from '@/app/(cms)/_hooks/use-lesson'
import { toast } from 'sonner'
import type { CreateLessonBody, QuizDataPayload } from '@/app/(cms)/_api/lesson.api'

const answerRowSchema = z.object({
  text: z.string().min(1, 'Nhập đáp án'),
  isCorrect: z.boolean()
})

const questionBlockSchema = z
  .object({
    questionText: z.string().min(5, 'Câu hỏi phải có ít nhất 5 ký tự'),
    answers: z.array(answerRowSchema).min(2, 'Mỗi câu hỏi phải có ít nhất 2 đáp án')
  })
  .superRefine((q, ctx) => {
    const correctCount = q.answers.filter((a) => a.isCorrect).length
    if (correctCount !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Mỗi câu hỏi phải có đúng một đáp án đúng',
        path: ['answers']
      })
    }
  })

const lessonSchema = z
  .object({
    title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
    shortDescription: z.string().min(1, 'Vui lòng nhập mô tả'),
    type: z.enum(['video', 'text', 'quiz'], {
      message: 'Loại bài học không hợp lệ'
    }),
    videoUrl: z.string().optional(),
    content: z.string().optional(),
    /** Bài trắc nghiệm thuần (type QUIZ) — map → POST /lesson `quizData` */
    questions: z.array(questionBlockSchema),
    /** Tùy chọn cho VIDEO/TEXT — cùng payload `quizData`, khớp VideoLessonStrategy / TextLessonStrategy */
    supplementalQuiz: z.array(questionBlockSchema)
  })
  .superRefine((data, ctx) => {
    if (data.type === 'video' && (!data.videoUrl || data.videoUrl.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vui lòng nhập đường dẫn Video',
        path: ['videoUrl']
      })
    }

    if (data.type === 'text' && (!data.content || data.content.trim() === '' || data.content === '<p></p>')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vui lòng nhập nội dung bài học',
        path: ['content']
      })
    }

    if (data.type === 'quiz' && data.questions.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Phải có ít nhất một câu hỏi',
        path: ['questions']
      })
    }
  })

type LessonForm = z.infer<typeof lessonSchema>

const DEFAULT_QUESTION: LessonForm['questions'][number] = {
  questionText: '',
  answers: [
    { text: '', isCorrect: true },
    { text: '', isCorrect: false }
  ]
}

function mapBlocksToQuizData(rows: LessonForm['questions']): QuizDataPayload {
  return rows.map((q) => ({
    content: q.questionText.trim(),
    answers: q.answers.map((a) => ({
      content: a.text.trim(),
      isCorrect: a.isCorrect
    }))
  }))
}

/* ---------------- PAGE ---------------- */

export default function LessonEditorPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const courseId = params.id
  const chapterId = searchParams.get('chapterId')

  const { mutate: createLesson, isPending } = useCreateLessonMutation(courseId)

  const [step, setStep] = useState<1 | 2>(1)

  const form = useForm<LessonForm>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      shortDescription: '',
      type: 'video',
      questions: [],
      supplementalQuiz: []
    }
  })

  const lessonType = form.watch('type')

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions'
  })

  const {
    fields: supFields,
    append: supAppend,
    remove: supRemove
  } = useFieldArray({
    control: form.control,
    name: 'supplementalQuiz'
  })

  const nextStep = async () => {
    const valid = await form.trigger(['title', 'shortDescription', 'type'])
    if (!valid) return
    if (form.getValues('type') === 'quiz' && form.getValues('questions').length === 0) {
      append(DEFAULT_QUESTION)
    }
    setStep(2)
  }

  const onSubmit = (data: LessonForm) => {
    if (!chapterId) {
      toast.error('Không tìm thấy thông tin Chương để thêm bài học')
      return
    }

    let payload: CreateLessonBody

    if (data.type === 'video') {
      payload = {
        type: 'VIDEO',
        title: data.title,
        chapterId,
        shortDesc: data.shortDescription,
        videoId: data.videoUrl || '',
        ...(data.supplementalQuiz.length > 0 ? { quizData: mapBlocksToQuizData(data.supplementalQuiz) } : {})
      }
    } else if (data.type === 'text') {
      payload = {
        type: 'TEXT',
        title: data.title,
        chapterId,
        shortDesc: data.shortDescription,
        textContent: data.content || '',
        ...(data.supplementalQuiz.length > 0 ? { quizData: mapBlocksToQuizData(data.supplementalQuiz) } : {})
      }
    } else {
      payload = {
        type: 'QUIZ',
        title: data.title,
        chapterId,
        shortDesc: data.shortDescription,
        quizData: mapBlocksToQuizData(data.questions)
      }
    }

    createLesson(payload, {
      onSuccess: () => {
        router.push(`/studio/courses/${courseId}`)
      }
    })
  }
  const isTypeLocked = step === 2

  const typeIcon = {
    video: <Video className='w-5 h-5' />,
    text: <FileText className='w-5 h-5' />,
    quiz: <HelpCircle className='w-5 h-5' />
  }

  return (
    <div className='pb-28 relative space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl'>
      {/* NATIVE HEADER (Tương đồng CoursePageShell) */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
        <div className='space-y-2'>
          <button
            type='button'
            onClick={() => router.back()}
            className='flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors -ml-2 mb-2 px-2 py-1 rounded-md'
          >
            <ChevronLeft className='w-4 h-4 mr-1' /> Quay lại quản lý khóa học
          </button>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center ring-2 ring-primary/10 shadow-sm shrink-0'>
              <LayoutTemplate className='w-6 h-6 text-primary' />
            </div>
            <div>
              <h1 className='text-3xl font-extrabold tracking-tight'>Tạo bài học mới</h1>
              <p className='text-muted-foreground text-sm mt-1'>Xây dựng kiến thức giá trị cho khóa học của bạn.</p>
            </div>
          </div>
        </div>

        {/* Stepper Indicator */}
        <div className='flex items-center gap-2 text-xs sm:text-sm font-semibold shrink-0 bg-card p-1.5 rounded-full border border-border/50 shadow-sm'>
          <div
            className={`px-2 sm:px-3 py-1.5 rounded-full flex items-center gap-2 transition-colors ${step === 1 ? 'bg-primary/10 text-primary ring-1 ring-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <span
              className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black ${step === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20'}`}
            >
              1
            </span>
            <span className='hidden sm:inline'>Thông tin chung</span>
          </div>
          <div className='w-4 h-px bg-border/50'></div>
          <div
            className={`px-2 sm:px-3 py-1.5 rounded-full flex items-center gap-2 transition-colors ${step === 2 ? 'bg-primary/10 text-primary ring-1 ring-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <span
              className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black ${step === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20'}`}
            >
              2
            </span>
            <span className='hidden sm:inline'>Nội dung chi tiết</span>
          </div>
        </div>
      </div>

      <main className='max-w-4xl pt-4'>
        {/* STEP 1 */}
        {step === 1 && (
          <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
            <Card className='border-border/50 shadow-lg rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm'>
              <CardContent className='p-6 sm:p-8 space-y-6'>
                <div className='space-y-2'>
                  <label className='text-xs font-bold text-muted-foreground uppercase tracking-wider flex justify-between'>
                    Tiêu đề bài học <span className='text-destructive'>*</span>
                  </label>
                  <Input
                    placeholder='Bí quyết làm chủ kiến thức trong 10 phút...'
                    {...form.register('title')}
                    className='h-14 text-base sm:text-lg font-semibold rounded-2xl bg-background border-border/50 focus-visible:ring-primary/20 transition-all font-sans'
                  />
                  {form.formState.errors.title && (
                    <p className='text-sm text-destructive font-medium flex items-center gap-1.5 mt-2'>
                      <span className='w-1.5 h-1.5 rounded-full bg-destructive inline-block'></span>
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <label className='text-xs font-bold text-muted-foreground uppercase tracking-wider flex justify-between'>
                    Mô tả ngắn gọn <span className='text-destructive'>*</span>
                  </label>
                  <Textarea
                    placeholder='Bài học này sẽ giúp học viên...'
                    {...form.register('shortDescription')}
                    className='min-h-[120px] text-base resize-none rounded-2xl bg-background border-border/50 focus-visible:ring-primary/20 transition-all p-4 font-sans'
                  />
                  {form.formState.errors.shortDescription && (
                    <p className='text-sm text-destructive font-medium flex items-center gap-1.5 mt-2'>
                      <span className='w-1.5 h-1.5 rounded-full bg-destructive inline-block'></span>
                      {form.formState.errors.shortDescription.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <label className='text-xs font-bold text-muted-foreground uppercase tracking-wider'>
                    Định dạng bài học
                  </label>
                  <Select
                    disabled={isTypeLocked}
                    value={lessonType}
                    onValueChange={(value) => form.setValue('type', value as LessonForm['type'])}
                  >
                    <SelectTrigger className='h-14 rounded-2xl bg-background border-border/50 focus-visible:ring-primary/20 px-4 text-base font-semibold'>
                      <SelectValue placeholder='Chọn định dạng' />
                    </SelectTrigger>
                    <SelectContent className='rounded-2xl border-border/50 shadow-xl overflow-hidden'>
                      <SelectItem
                        value='video'
                        className='font-medium py-3 rounded-xl focus:bg-primary/5 focus:text-primary cursor-pointer mx-1 my-1'
                      >
                        <div className='flex items-center gap-3'>
                          <div className='p-1.5 rounded-md bg-rose-500/10 text-rose-600'>
                            <Video className='w-4 h-4' />
                          </div>
                          Video độ nét cao
                        </div>
                      </SelectItem>
                      <SelectItem
                        value='text'
                        className='font-medium py-3 rounded-xl focus:bg-primary/5 focus:text-primary cursor-pointer mx-1 my-1'
                      >
                        <div className='flex items-center gap-3'>
                          <div className='p-1.5 rounded-md bg-blue-500/10 text-blue-600'>
                            <FileText className='w-4 h-4' />
                          </div>
                          Bài đọc văn bản (Blog)
                        </div>
                      </SelectItem>
                      <SelectItem
                        value='quiz'
                        className='font-medium py-3 rounded-xl focus:bg-primary/5 focus:text-primary cursor-pointer mx-1 my-1'
                      >
                        <div className='flex items-center gap-3'>
                          <div className='p-1.5 rounded-md bg-amber-500/10 text-amber-500 dark:text-amber-400'>
                            <HelpCircle className='w-4 h-4' />
                          </div>
                          Bài tập trắc nghiệm
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className='mt-8 flex justify-end pb-8'>
              <Button
                onClick={nextStep}
                size='lg'
                className='h-14 w-full sm:w-auto px-8 rounded-2xl shadow-xl shadow-primary/20 font-bold text-base bg-primary hover:bg-primary/95 transition-transform active:scale-[0.98]'
              >
                Tiếp tục soạn thảo
                <ArrowRight className='w-5 h-5 ml-2' />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8'
          >
            <div className='mb-6'>
              <div className='inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20'>
                {typeIcon[lessonType]}
                Đang soạn: {lessonType === 'video' ? 'Video' : lessonType === 'text' ? 'Bài Đọc' : 'Trắc Nghiệm'}
              </div>
              <h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight'>Nội dung chi tiết</h1>
              <p className='text-muted-foreground mt-2 text-sm sm:text-base'>
                Xây dựng kiến thức giá trị cho học viên của bạn ngay tại đây.
              </p>
            </div>

            {/* VIDEO */}
            {lessonType === 'video' && (
              <Card className='border-border/50 shadow-lg rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm'>
                <CardContent className='p-6 sm:p-8 space-y-8'>
                  <div className='space-y-2'>
                    <label className='text-xs font-bold text-muted-foreground uppercase tracking-wider'>
                      Đường dẫn Video (URL)
                    </label>
                    <Input
                      placeholder='https://youtube.com/... hoặc Vimeo URL'
                      {...form.register('videoUrl')}
                      className='h-14 font-medium rounded-2xl bg-background border-border/50 focus-visible:ring-primary/20 transition-all font-sans'
                    />
                  </div>

                  <div className='space-y-2'>
                    <label className='text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between'>
                      Mô tả chi tiết / HTML
                      <span className='text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground normal-case font-medium'>
                        Tùy chọn
                      </span>
                    </label>
                    <Controller
                      name='content'
                      control={form.control}
                      render={({ field }) => <ProfessionalEditor value={field.value || ''} onChange={field.onChange} />}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* QUIZ bổ sung cho VIDEO — `quizData` tùy chọn (VideoLessonStrategy) */}
            {lessonType === 'video' && (
              <div className='space-y-6 mt-8'>
                <div className='rounded-2xl border border-border/50 bg-muted/20 px-5 py-4'>
                  <h3 className='font-extrabold text-lg tracking-tight'>Bài kiểm tra cuối bài (tùy chọn)</h3>
                  <p className='text-muted-foreground text-sm mt-1'>
                    Thêm trắc nghiệm kèm bài video; quiz được tạo cùng lúc khi lưu bài học.
                  </p>
                </div>
                {supFields.map((field, index) => (
                  <QuestionCard
                    key={field.id}
                    index={index}
                    form={form}
                    onRemove={supRemove}
                    showAnswers
                    namePrefix='supplementalQuiz'
                  />
                ))}
                <Button
                  type='button'
                  variant='outline'
                  className='w-full border-dashed border-2 py-8 rounded-3xl font-bold bg-muted/20'
                  onClick={() => supAppend(DEFAULT_QUESTION)}
                >
                  <Plus className='w-5 h-5 mr-2 text-primary' />
                  Thêm câu hỏi trắc nghiệm
                </Button>
              </div>
            )}

            {/* TEXT */}
            {lessonType === 'text' && (
              <Card className='border-none shadow-none bg-transparent'>
                <div className='space-y-3'>
                  <Controller
                    name='content'
                    control={form.control}
                    render={({ field }) => <ProfessionalEditor value={field.value || ''} onChange={field.onChange} />}
                  />
                  {form.formState.errors.content && (
                    <p className='text-sm text-destructive font-medium flex items-center gap-1.5 mt-2'>
                      <span className='w-1.5 h-1.5 rounded-full bg-destructive inline-block'></span>
                      {form.formState.errors.content.message}
                    </p>
                  )}
                </div>

                <div className='space-y-6 mt-10 pt-8 border-t border-border/40'>
                  <div className='rounded-2xl border border-border/50 bg-muted/20 px-5 py-4'>
                    <h3 className='font-extrabold text-lg tracking-tight'>Bài kiểm tra cuối bài (tùy chọn)</h3>
                    <p className='text-muted-foreground text-sm mt-1'>
                      Quiz kèm bài đọc được tạo cùng lúc khi lưu (tùy chọn).
                    </p>
                  </div>
                  {supFields.map((field, index) => (
                    <QuestionCard
                      key={field.id}
                      index={index}
                      form={form}
                      onRemove={supRemove}
                      showAnswers
                      namePrefix='supplementalQuiz'
                    />
                  ))}
                  <Button
                    type='button'
                    variant='outline'
                    className='w-full border-dashed border-2 py-8 rounded-3xl font-bold bg-muted/20'
                    onClick={() => supAppend(DEFAULT_QUESTION)}
                  >
                    <Plus className='w-5 h-5 mr-2 text-primary' />
                    Thêm câu hỏi trắc nghiệm
                  </Button>
                </div>
              </Card>
            )}

            {/* QUIZ MANAGER */}
            {lessonType === 'quiz' && (
              <div className='space-y-8'>
                <div className='flex items-center justify-between bg-card border border-border/50 p-6 rounded-3xl shadow-sm'>
                  <div>
                    <h3 className='font-extrabold tracking-tight text-xl'>Danh sách câu hỏi</h3>
                    <p className='text-muted-foreground text-sm mt-1'>
                      Thêm các câu hỏi trắc nghiệm để đánh giá học viên.
                    </p>
                  </div>
                  <div className='bg-primary/10 text-primary font-black text-2xl h-14 w-14 rounded-2xl flex items-center justify-center ring-1 ring-primary/20 shadow-sm shrink-0'>
                    {fields.length}
                  </div>
                </div>

                <div className='space-y-6'>
                  {fields.map((field, index) => (
                    <QuestionCard key={field.id} index={index} form={form} onRemove={remove} showAnswers />
                  ))}

                  <Button
                    type='button'
                    variant='outline'
                    className='w-full border-dashed border-2 py-10 rounded-3xl font-bold bg-muted/30 hover:bg-muted/60 transition-all text-muted-foreground hover:text-foreground'
                    onClick={() => append(DEFAULT_QUESTION)}
                  >
                    <Plus className='w-5 h-5 mr-2 text-primary' />
                    Thêm lượt câu hỏi mới
                  </Button>
                </div>
              </div>
            )}

            {/* SPACING CHO FOOTER KHONG BỊ ĐÈ */}
            <div className='h-32 w-full shrink-0'></div>

            {/* FLOATING FOOTER ACTION */}
            <div className='fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none'>
              <div className='pointer-events-auto bg-background/80 backdrop-blur-2xl border border-border/60 shadow-2xl p-2 rounded-2xl flex items-center gap-3 w-full max-w-xl mx-auto ring-1 ring-black/5 dark:ring-white/5'>
                <Button
                  type='button'
                  variant='ghost'
                  onClick={() => setStep(1)}
                  className='h-12 px-4 sm:px-6 rounded-xl font-semibold hover:bg-secondary shrink-0'
                >
                  <ChevronLeft className='w-4 h-4 sm:mr-2' />
                  <span className='hidden sm:inline'>Trở lại</span>
                </Button>
                <Button
                  type='submit'
                  disabled={isPending}
                  className='h-12 px-8 rounded-xl font-bold flex-1 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/95 text-primary-foreground'
                >
                  <Save className='w-4 h-4 mr-2' />
                  {isPending ? 'Đang lưu...' : 'Lưu Bài Học'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
