'use client'

import { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfessionalEditor } from "@/components/common/professional-editor"
import { QuestionCard } from '../../../../../_components/question-card'

/* ---------------- SCHEMA ---------------- */

const lessonSchema = z.object({
  title: z.string().min(1, 'Vui lòng nhập tiêu đề'),

  shortDescription: z.string().min(1, 'Vui lòng nhập mô tả'),

  type: z.enum(['video', 'text', 'quiz'], {
    message: 'Loại bài học không hợp lệ'
  }),

  videoUrl: z.string().optional(),
  content: z.string().optional(),

  questions: z.array(
    z.object({
      questionText: z.string().min(1, 'Nhập nội dung câu hỏi'),
      answers: z.array(
        z.object({
          text: z.string().min(1, 'Nhập đáp án'),
          isCorrect: z.boolean()
        })
      )
    })
  )
})

type LessonForm = z.infer<typeof lessonSchema>

/* ---------------- DEFAULT QUESTION ---------------- */

const DEFAULT_QUESTION: LessonForm['questions'][number] = {
  questionText: '',
  answers: [
    { text: '', isCorrect: true },
    { text: '', isCorrect: false }
  ]
}

/* ---------------- PAGE ---------------- */

export default function LessonEditorPage() {
  const [step, setStep] = useState<1 | 2>(1)

  const form = useForm<LessonForm>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      shortDescription: '',
      type: 'video',
      questions: []
    }
  })

  const lessonType = form.watch('type')

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions'
  })

  const nextStep = async () => {
    const valid = await form.trigger(['title', 'shortDescription', 'type'])
    if (!valid) return
    setStep(2)
  }

  const onSubmit = (data: LessonForm) => {
    console.log('SAVE LESSON', data)
  }
  const isTypeLocked = step === 2

  return (
    <div className='max-w-4xl mx-auto p-8'>
      {/* STEP 1 */}

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>B1: Thông tin bài học</CardTitle>
          </CardHeader>

          <CardContent className='space-y-4'>
            <div className='space-y-1'>
              <Input placeholder='Tiêu đề bài học' {...form.register('title')} />

              {form.formState.errors.title && (
                <p className='text-sm text-red-500'>{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className='space-y-1'>
              <Textarea placeholder='Mô tả ngắn' {...form.register('shortDescription')} />

              {form.formState.errors.shortDescription && (
                <p className='text-sm text-red-500'>{form.formState.errors.shortDescription.message}</p>
              )}
            </div>

            <Select
              disabled={isTypeLocked}
              onValueChange={(value) => form.setValue('type', value as LessonForm['type'])}
              defaultValue={form.getValues('type')}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Chọn loại bài học' />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value='video'>Video</SelectItem>
                <SelectItem value='text'>Text</SelectItem>
                <SelectItem value='quiz'>Bài kiểm tra</SelectItem>
              </SelectContent>
            </Select>

            <div className='flex justify-end'>
              <Button onClick={nextStep}>Next</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 2 */}

      {step === 2 && (
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* VIDEO */}

          {/* VIDEO - Thay Textarea bằng ProfessionalEditor nếu cần mô tả chuyên sâu */}
          {lessonType === 'video' && (
            <Card>
              <CardHeader>
                <CardTitle>Nội dung Video</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <Input placeholder='Video URL' {...form.register('videoUrl')} />

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Mô tả bài học (AI Context)</label>
                  <Controller
                    name="content"
                    control={form.control}
                    render={({ field }) => (
                      <ProfessionalEditor value={field.value || ''} onChange={field.onChange} />
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* TEXT - Thay thế hoàn toàn Textarea bằng ProfessionalEditor */}
          {lessonType === 'text' && (
            <Card className="border-none shadow-none bg-transparent">
              <CardHeader className="px-0">
                <CardTitle className="text-xl font-black italic uppercase">Nội dung Text (Bài đọc)</CardTitle>
              </CardHeader>

              <CardContent className="px-0">
                <Controller
                  name="content"
                  control={form.control}
                  render={({ field }) => (
                    <ProfessionalEditor
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-red-500 mt-2">{form.formState.errors.content.message}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* QUIZ MANAGER */}

          <Card>
            <CardHeader>
              <CardTitle>Quản lý bài Test</CardTitle>
            </CardHeader>

            <CardContent className='space-y-6'>
              {fields.map((field, index) => (
                <QuestionCard key={field.id} index={index} form={form} onRemove={remove} showAnswers />
              ))}

              <Button
                type='button'
                variant='outline'
                className='w-full border-dashed border-2 py-6'
                onClick={() => append(DEFAULT_QUESTION)}
              >
                + Thêm câu hỏi
              </Button>
            </CardContent>
          </Card>

          {/* FOOTER */}

          <div className='flex justify-between'>
            <Button type='button' variant='secondary' onClick={() => setStep(1)}>
              Quay lại
            </Button>

            <Button type='submit'>Lưu bài học</Button>
          </div>
        </form>
      )}
    </div>
  )
}
