'use client'

import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Plus, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuizFormValues, quizSchema } from '../../_utils/zod'
import { QuizSidebar } from '../../_components/quiz-sidebar'
import { QuestionCard } from '../../_components/question-card'
import { useSaveLessonQuizMutation } from '../../_hooks/use-quiz-mutation'

interface LessonData {
  id: string
  title: string
  courseName: string
}

// TODO: Thay LESSON_ID bằng dynamic route param khi tích hợp: /quiz/[lessonId]
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
    <div className='flex min-h-screen bg-background'>
      <QuizSidebar
        title='Quiz Builder'
        infoLines={['Các trường meta đã bị khóa', `Đang đồng bộ với: ${lessonData.title}`]}
      />

      <main className='flex-1 p-8'>
        <div className='max-w-4xl mx-auto'>
          <header className='flex justify-between items-center mb-8'>
            <div>
              <p className='text-sm text-muted-foreground uppercase tracking-wider'>
                Khóa học / Chương 12 / Trình soạn bài kiểm tra
              </p>
              <h1 className='text-3xl font-extrabold tracking-tight'>Chỉnh sửa Quiz: {lessonData.title}</h1>
              <p className='text-muted-foreground italic'>Thuộc khóa học: {lessonData.courseName}</p>
            </div>
            <Button variant='outline'>
              <Eye className='mr-2 h-4 w-4' /> Xem trước
            </Button>
          </header>

          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {fields.map((field, index) => (
              <QuestionCard key={field.id} index={index} form={form} onRemove={remove} showAnswers />
            ))}

            <Button
              type='button'
              variant='outline'
              className='w-full py-10 border-dashed border-2 hover:bg-accent/50'
              onClick={() => append(DEFAULT_QUESTION)}
            >
              <Plus className='mr-2 h-5 w-5' /> Thêm câu hỏi mới
            </Button>

            <div className='sticky bottom-6 bg-card border p-4 rounded-xl shadow-lg flex justify-between items-center mt-10'>
              <div>
                <p className='font-bold'>Hoàn tất chỉnh sửa</p>
                <p className='text-sm text-muted-foreground'>Đảm bảo mỗi câu hỏi có ít nhất một đáp án đúng.</p>
              </div>
              <div className='flex gap-3'>
                <Button variant='secondary' type='button' onClick={() => form.reset()} disabled={isPending}>
                  Hủy thay đổi
                </Button>
                <Button type='submit' disabled={isPending}>
                  {isPending ? 'Đang lưu...' : 'Lưu bài kiểm tra'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
