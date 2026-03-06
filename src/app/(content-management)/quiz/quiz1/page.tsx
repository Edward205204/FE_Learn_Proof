'use client'

import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Trash2, Plus, Play, Eye, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { QuizFormValues, quizSchema } from '../../_utils/zod'
import http from '@/utils/http'
import { AnswerList } from '../../_components/answer-List'

interface LessonData {
  id: string
  title: string
  courseName: string
}

// Hardcoded lesson ID for the quiz1 route — replace with dynamic param if needed
const LESSON_ID = 'quiz1'

export default function QuizEditorT1() {
  // TODO: Thay bằng API call thực tế khi có backend
  const mockLesson: LessonData = {
    id: LESSON_ID,
    title: 'Quiz 1 - Bài kiểm tra thử',
    courseName: 'Khoá học mẫu'
  }

  const [lessonData] = useState<LessonData>(mockLesson)

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      lessonId: mockLesson.id,
      questions: [
        {
          questionText: '',
          type: 'multiple_choice',
          answers: [
            { text: '', isCorrect: true },
            { text: '', isCorrect: false }
          ]
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions'
  })

  const handleAddQuestion = () => {
    append({
      questionText: '',
      type: 'multiple_choice',
      answers: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    })
  }

  const onSubmit = async (data: QuizFormValues) => {
    try {
      await http.post(`/lessons/${data.lessonId}/quiz`, data)
      toast.success('Cập nhật bài kiểm tra thành công!')
    } catch (error) {
      // Error đã được handle bởi interceptor của bạn
    }
  }

  return (
    <div className='flex min-h-screen bg-background'>
      {/* Sidebar - Tương tự ảnh mẫu */}
      <aside className='w-64 border-r bg-sidebar p-6'>
        <h2 className='text-lg font-bold text-primary mb-6'>Quiz Builder</h2>
        <nav className='space-y-2'>
          <Button variant='ghost' className='w-full justify-start'>
            <Lock className='mr-2 h-4 w-4' /> Course Content
          </Button>
          <Button variant='secondary' className='w-full justify-start text-primary'>
            <Play className='mr-2 h-4 w-4' /> Quiz Editor
          </Button>
        </nav>

        <div className='mt-auto pt-10'>
          <Card className='bg-muted/50 border-none'>
            <CardContent className='p-4 text-xs space-y-2'>
              <p className='font-bold flex items-center'>
                <Lock className='h-3 w-3 mr-1' /> EDITOR INFO
              </p>
              <p className='text-muted-foreground'>Meta fields locked</p>
              <p className='text-muted-foreground'>Syncing with: {lessonData.title}</p>
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 p-8'>
        <div className='max-w-4xl mx-auto'>
          <header className='flex justify-between items-center mb-8'>
            <div>
              <p className='text-sm text-muted-foreground uppercase tracking-wider'>
                Courses / Unit 12 / PB12-T1 Editor
              </p>
              <h1 className='text-3xl font-extrabold tracking-tight'>Edit Quiz: {lessonData.title}</h1>
              <p className='text-muted-foreground italic'>Inherited from: {lessonData.courseName}</p>
            </div>
            <Button variant='outline'>
              <Eye className='mr-2 h-4 w-4' /> Preview Quiz
            </Button>
          </header>

          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {fields.map((field, index) => (
              <Card
                key={field.id}
                className='relative overflow-hidden border-2 focus-within:border-primary transition-all'
              >
                <div className='absolute left-0 top-0 bottom-0 w-1 bg-primary' />
                <CardContent className='p-6'>
                  <div className='flex justify-between items-start mb-4'>
                    <span className='bg-primary text-primary-foreground h-8 w-8 rounded-md flex items-center justify-center font-bold'>
                      {index + 1}
                    </span>
                    <Button variant='ghost' size='icon' onClick={() => remove(index)} className='text-destructive'>
                      <Trash2 className='h-5 w-5' />
                    </Button>
                  </div>

                  <div className='space-y-4'>
                    <div>
                      <label className='text-xs font-bold uppercase text-muted-foreground mb-1 block'>
                        Question Text
                      </label>
                      <Input
                        {...form.register(`questions.${index}.questionText`)}
                        placeholder='Nhập câu hỏi tại đây...'
                        className='text-lg py-6'
                      />
                    </div>

                    <div className='space-y-3'>
                      <label className='text-xs font-bold uppercase text-muted-foreground block'>Answers</label>
                      {/* Render mảng đáp án tại đây - dùng useFieldArray cấp 2 hoặc map thủ công */}
                      <AnswerList questionIndex={index} form={form} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              type='button'
              variant='outline'
              className='w-full py-10 border-dashed border-2 hover:bg-accent/50'
              onClick={() =>
                append({ questionText: '', type: 'multiple_choice', answers: [{ text: '', isCorrect: false }] })
              }
            >
              <Plus className='mr-2 h-5 w-5' /> Add New Question
            </Button>

            <div className='sticky bottom-6 bg-card border p-4 rounded-xl shadow-lg flex justify-between items-center mt-10'>
              <div>
                <p className='font-bold'>Finish Editing</p>
                <p className='text-sm text-muted-foreground'>
                  Make sure all questions have at least one correct answer marked.
                </p>
              </div>
              <div className='flex gap-3'>
                <Button variant='secondary' type='button'>
                  Discard Changes
                </Button>
                <Button type='submit'>Publish Quiz Update</Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
