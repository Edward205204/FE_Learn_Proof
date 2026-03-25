'use client'

import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Plus, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuizFormValues, quizSchema } from '@/app/(cms)/_utils/zod'
import { QuizSidebar } from '@/app/(cms)/_components/quiz-sidebar'
import { QuestionCard } from '@/app/(cms)/_components/question-card'
import { useSaveLessonQuizMutation } from '@/app/(cms)/_hooks/use-quiz-mutation'

interface LessonData {
  id: string
  title: string
  courseName: string
}

const LESSON_ID = 'quiz1'

const MOCK_LESSON: LessonData = {
  id: LESSON_ID,
  title: 'Quiz 1 - Bài kiểm tra thử',
  courseName: 'Khoá học mẫu'
}

const DEFAULT_QUESTION = {
  questionText: '',
  type: 'multiple_choice' as const,
  answers: [
    { text: '', isCorrect: true },
    { text: '', isCorrect: false }
  ]
}

export default function LessonQuizEditorPage() {
  const [lessonData] = useState<LessonData>(MOCK_LESSON)
  const [_isPreviewOpen, setIsPreviewOpen] = useState(false)

  const { mutate: saveQuiz, isPending } = useSaveLessonQuizMutation(lessonData.id)

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      lessonId: lessonData.id,
      questions: [DEFAULT_QUESTION]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions'
  })

  const onSubmit = (data: QuizFormValues) => {
    saveQuiz(data)
  }

  return (
    <div className='flex flex-col md:flex-row min-h-[calc(100vh-8rem)] rounded-3xl overflow-hidden border border-border/60 shadow-md bg-card animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <QuizSidebar
        title='Quiz Builder'
        infoLines={['Các trường meta đã khóa', `Đang đồng bộ: ${lessonData.title}`]}
      />

      <main className='flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto bg-background/50'>
        <div className='max-w-3xl mx-auto'>
          <header className='flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10 border-b border-border/50 pb-6'>
            <div className='space-y-1.5'>
              <p className='text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-2'>
                Chương 12 / Bài kiểm tra
              </p>
              <h1 className='text-3xl font-extrabold tracking-tight text-foreground'>Chỉnh sửa Quiz</h1>
              <p className='text-muted-foreground font-medium text-sm'>
                {lessonData.title} <span className="mx-2 opacity-50">|</span> {lessonData.courseName}
              </p>
            </div>

            <Button variant='outline' type='button' onClick={() => setIsPreviewOpen(true)} className='shadow-sm rounded-xl font-bold h-10'>
              <Eye className='mr-2 h-4 w-4' /> Xem trước
            </Button>
          </header>

          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 pb-32'>
            {fields.map((field, index) => (
              <QuestionCard key={field.id} index={index} form={form} onRemove={remove} showAnswers />
            ))}

            <Button
              type='button'
              variant='outline'
              className='w-full py-8 border-dashed border-2 hover:bg-muted/50 hover:border-primary/30 transition-colors rounded-2xl text-muted-foreground hover:text-foreground font-bold'
              onClick={() => append(DEFAULT_QUESTION)}
            >
              <Plus className='mr-2 h-5 w-5' /> Thêm câu hỏi mới
            </Button>

            <div className='sticky bottom-0 -mx-6 md:-mx-10 lg:-mx-12 -mb-6 md:-mb-10 lg:-mb-12 mt-12 p-4 sm:p-6 bg-gradient-to-t from-background/95 to-transparent z-20 pointer-events-none'>
              <div className='max-w-3xl mx-auto flex flex-col sm:flex-row justify-between sm:items-center gap-4 border border-primary/50 bg-background/80 backdrop-blur-xl shadow-xl rounded-2xl p-4 sm:px-6 pointer-events-auto'>
                <div>
                  <p className='font-bold text-foreground'>Hoàn tất bài kiểm tra</p>
                  <p className='text-sm text-muted-foreground font-medium'>Phải có ít nhất một đáp án đúng cho mỗi câu.</p>
                </div>
                <div className='flex items-center gap-3 w-full sm:w-auto'>
                  <Button variant='ghost' type='button' className='flex-1 sm:flex-none' onClick={() => form.reset()} disabled={isPending}>
                    Hủy
                  </Button>
                  <Button type='submit' className='flex-1 sm:flex-none shadow-md font-bold' disabled={isPending}>
                    {isPending ? 'Đang lưu...' : 'Lưu bài kiểm tra'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
