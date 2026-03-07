'use client'

import { useFieldArray, useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Plus, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { independentQuizSchema, IndependentQuizValues } from '../../_utils/zod'
import { QuizSidebar } from '../../_components/quiz-sidebar'
import { QuestionCard } from '../../_components/question-card'
import { useCreateStandaloneQuizMutation } from '../../_hooks/use-quiz-mutation'

interface QuizMeta {
  title: string
  courseName: string
}

const MOCK_META: QuizMeta = {
  title: 'Professional Business Practices - Bài kiểm tra cuối kỳ',
  courseName: 'Khoá học mẫu'
}

const DEFAULT_QUESTION = {
  questionText: '',
  type: 'multiple_choice' as const,
  answers: [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]
}

export default function StandaloneQuizEditorPage() {
  const [meta] = useState<QuizMeta>(MOCK_META)
  const { mutate: createQuiz, isPending } = useCreateStandaloneQuizMutation()

  const form = useForm<IndependentQuizValues>({
    resolver: zodResolver(independentQuizSchema),
    defaultValues: {
      title: meta.title,
      shortDescription: '',
      description: '',
      passingScore: 80,
      issueCertificate: true,
      unlockNextCourse: false,
      questions: [DEFAULT_QUESTION]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions'
  })

  const onSubmit = (data: IndependentQuizValues) => {
    createQuiz(data)
  }

  return (
    <div className='flex min-h-screen bg-background'>
      <QuizSidebar title='Quiz Builder' infoLines={['Quiz độc lập (không gắn bài học)', `Đang soạn: ${meta.title}`]} />

      <main className='flex-1 p-8'>
        <div className='max-w-4xl mx-auto'>
          <header className='flex justify-between items-center mb-8'>
            <div>
              <p className='text-sm text-muted-foreground uppercase tracking-wider'>
                Khóa học / Chương 12 / Trình soạn Quiz độc lập
              </p>
              <h1 className='text-3xl font-extrabold tracking-tight'>Soạn Quiz: {meta.title}</h1>
              <p className='text-muted-foreground italic'>Thuộc khóa học: {meta.courseName}</p>
            </div>
            <Button variant='outline'>
              <Eye className='mr-2 h-4 w-4' /> Xem trước
            </Button>
          </header>

          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Phần 1: Thông tin Quiz */}
            <Card className='border shadow-sm'>
              <CardContent className='p-6 space-y-4'>
                <div className='flex items-center gap-2 text-primary font-bold'>
                  <div className='p-1 bg-primary/10 rounded text-xs font-bold w-5 h-5 flex items-center justify-center'>
                    i
                  </div>
                  Thông tin bài kiểm tra
                </div>
                <div className='space-y-4'>
                  <div>
                    <label className='text-xs font-bold uppercase text-muted-foreground mb-1 block'>
                      Tiêu đề bài kiểm tra
                    </label>
                    <Input {...form.register('title')} className='bg-muted/30' />
                  </div>
                  <div>
                    <label className='text-xs font-bold uppercase text-muted-foreground mb-1 block'>Mô tả ngắn</label>
                    <Input {...form.register('shortDescription')} className='bg-muted/30' />
                  </div>
                  <div>
                    <label className='text-xs font-bold uppercase text-muted-foreground mb-1 block'>
                      Mô tả chi tiết (Ngữ cảnh AI)
                    </label>
                    <Textarea {...form.register('description')} className='bg-muted/30 min-h-[100px]' />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phần 2: Tiêu chí đạt */}
            <Card className='border shadow-sm'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-2 text-primary font-bold mb-4'>
                  <div className='p-1 bg-primary/10 rounded text-xs'>⚙</div>
                  Tiêu chí đạt bài kiểm tra
                </div>
                <div className='flex gap-8 items-end'>
                  <div className='w-36'>
                    <label className='text-xs font-bold uppercase text-muted-foreground mb-1 block'>
                      Điểm tối thiểu (%)
                    </label>
                    <div className='flex items-center gap-2'>
                      <Input
                        type='number'
                        min={0}
                        max={100}
                        {...form.register('passingScore', { valueAsNumber: true })}
                        className='text-center'
                      />
                      <span className='font-bold'>%</span>
                    </div>
                  </div>

                  <div className='flex-1 grid grid-cols-2 gap-4'>
                    <div className='flex items-center space-x-2 border rounded-md p-3 bg-muted/20'>
                      <Controller
                        control={form.control}
                        name='issueCertificate'
                        render={({ field }) => (
                          <Checkbox id='cert' checked={field.value} onCheckedChange={field.onChange} />
                        )}
                      />
                      <label htmlFor='cert' className='text-sm font-medium leading-none cursor-pointer'>
                        Cấp chứng chỉ
                      </label>
                    </div>

                    <div className='flex items-center space-x-2 border rounded-md p-3 bg-muted/20'>
                      <Controller
                        control={form.control}
                        name='unlockNextCourse'
                        render={({ field }) => (
                          <Checkbox id='unlock' checked={field.value} onCheckedChange={field.onChange} />
                        )}
                      />
                      <label htmlFor='unlock' className='text-sm font-medium leading-none cursor-pointer'>
                        Mở khóa khóa học tiếp theo
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phần 3: Ngân hàng câu hỏi */}
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <h2 className='text-xl font-bold'>Ngân hàng câu hỏi ({fields.length})</h2>
              </div>

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
            </div>

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
                  {isPending ? 'Đang lưu...' : 'Xuất bản bài kiểm tra'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
