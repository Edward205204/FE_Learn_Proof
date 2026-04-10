'use client'

import { useFieldArray, useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { independentQuizSchema, IndependentQuizValues } from '../../../_utils/zod'
import { QuizSidebar } from '../../../_components/quiz-sidebar'
import { QuestionCard } from '../../../_components/question-card'
import { AlertCircle } from 'lucide-react'

const DEFAULT_QUESTION = {
  questionText: '',
  type: 'multiple_choice' as const,
  answers: [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]
}

export default function StandaloneQuizEditorPage() {
  const form = useForm<IndependentQuizValues>({
    resolver: zodResolver(independentQuizSchema),
    defaultValues: {
      title: 'Professional Business Practices - Bài kiểm tra cuối kỳ',
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

  return (
    <div className='flex flex-col gap-6 max-w-5xl mx-auto'>
      <div className='rounded-lg border border-destructive/50 border-2 bg-destructive/10 p-4 text-destructive flex gap-3'>
        <AlertCircle className='h-5 w-5 shrink-0' />
        <div>
          <h5 className='mb-1 font-bold uppercase tracking-wider leading-none'>Giao diện đã lỗi thời (Deprecated)</h5>
          <div className='text-sm font-medium'>
            Giao diện <strong>Standalone Quiz</strong> này là bản Demo và không còn được kết nối với API thực tế.
            <br />
            Hệ thống hiện tại yêu cầu mọi Quiz đều phải thuộc cấu trúc Bài giảng của một Khóa học.
          </div>
        </div>
      </div>

      <div className='flex flex-col md:flex-row min-h-[calc(100vh-14rem)] rounded-3xl overflow-hidden border border-border/60 shadow-md bg-card animate-in fade-in slide-in-from-bottom-4 duration-500 opacity-50 pointer-events-none'>
        <QuizSidebar
          title='Quiz Builder'
          infoLines={['Quiz độc lập (không gắn bài học)', 'Giao diện không còn hoạt động']}
        />

        <main className='flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto bg-background/50'>
          <div className='max-w-3xl mx-auto'>
            <header className='flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10 border-b border-border/50 pb-6'>
              <div className='space-y-1.5'>
                <p className='text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-2'>Bài kiểm tra</p>
                <h1 className='text-3xl font-extrabold tracking-tight text-foreground'>Soạn Quiz</h1>
                <p className='text-muted-foreground font-medium text-sm'>
                  Professional Business Practices <span className='mx-2 opacity-50'>|</span> Khoá học mẫu
                </p>
              </div>
              <Button variant='outline' type='button' className='shadow-sm rounded-xl font-bold h-10'>
                <Eye className='mr-2 h-4 w-4' /> Xem trước
              </Button>
            </header>

            <form className='space-y-6'>
              {/* Phần 1: Thông tin Quiz */}
              <Card className='border border-border/60 shadow-sm rounded-2xl'>
                <CardContent className='p-6 sm:p-8 space-y-6'>
                  <div className='flex items-center gap-2 text-primary font-bold'>
                    <div className='p-1 bg-primary/10 rounded-md text-[10px] font-extrabold w-6 h-6 flex items-center justify-center ring-1 ring-primary/20'>
                      1
                    </div>
                    Thông tin bài kiểm tra
                  </div>
                  <div className='space-y-5'>
                    <div>
                      <label className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 block'>
                        Tiêu đề bài kiểm tra
                      </label>
                      <Input
                        {...form.register('title')}
                        className='bg-muted/10 border-border/50 focus-visible:ring-primary/20 h-11 rounded-xl'
                      />
                    </div>
                    <div>
                      <label className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 block'>
                        Mô tả ngắn
                      </label>
                      <Input
                        {...form.register('shortDescription')}
                        className='bg-muted/10 border-border/50 focus-visible:ring-primary/20 h-11 rounded-xl'
                      />
                    </div>
                    <div>
                      <label className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 block'>
                        Mô tả chi tiết (Ngữ cảnh AI)
                      </label>
                      <Textarea
                        {...form.register('description')}
                        className='bg-muted/10 border-border/50 focus-visible:ring-primary/20 min-h-[100px] rounded-xl'
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phần 2: Tiêu chí đạt */}
              <Card className='border border-border/60 shadow-sm rounded-2xl'>
                <CardContent className='p-6 sm:p-8'>
                  <div className='flex items-center gap-2 text-primary font-bold mb-6'>
                    <div className='p-1 bg-primary/10 rounded-md text-[10px] font-extrabold w-6 h-6 flex items-center justify-center ring-1 ring-primary/20'>
                      2
                    </div>
                    Tiêu chí vượt qua
                  </div>
                  <div className='flex flex-col sm:flex-row gap-6 sm:items-end'>
                    <div className='w-full sm:w-40'>
                      <label className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 block'>
                        Điểm tối thiểu
                      </label>
                      <div className='relative'>
                        <Input
                          type='number'
                          min={0}
                          max={100}
                          {...form.register('passingScore', { valueAsNumber: true })}
                          className='bg-muted/10 border-border/50 focus-visible:ring-primary/20 h-11 rounded-xl text-center pr-8 font-bold text-lg'
                        />
                        <span className='absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground'>
                          %
                        </span>
                      </div>
                    </div>

                    <div className='flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full'>
                      <label
                        htmlFor='cert'
                        className='flex items-center gap-3 border border-border/50 rounded-xl p-4 bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer group'
                      >
                        <Controller
                          control={form.control}
                          name='issueCertificate'
                          render={({ field }) => (
                            <Checkbox
                              id='cert'
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className='h-5 w-5 rounded-md data-[state=checked]:bg-primary data-[state=checked]:border-primary shadow-sm'
                            />
                          )}
                        />
                        <span className='text-sm font-semibold select-none group-hover:text-primary transition-colors'>
                          Cấp chứng chỉ
                        </span>
                      </label>

                      <label
                        htmlFor='unlock'
                        className='flex items-center gap-3 border border-border/50 rounded-xl p-4 bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer group'
                      >
                        <Controller
                          control={form.control}
                          name='unlockNextCourse'
                          render={({ field }) => (
                            <Checkbox
                              id='unlock'
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className='h-5 w-5 rounded-md data-[state=checked]:bg-primary data-[state=checked]:border-primary shadow-sm'
                            />
                          )}
                        />
                        <span className='text-sm font-semibold select-none group-hover:text-primary transition-colors'>
                          Mở khóa bài tiếp theo
                        </span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phần 3: Ngân hàng câu hỏi */}
              <div className='space-y-6 pt-4'>
                <div className='flex justify-between items-center'>
                  <h2 className='text-xl font-extrabold flex items-center gap-2'>
                    Ngân hàng câu hỏi
                    <span className='bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full'>{fields.length}</span>
                  </h2>
                </div>

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
              </div>

              <div className='sticky bottom-0 -mx-6 md:-mx-10 lg:-mx-12 -mb-6 md:-mb-10 lg:-mb-12 mt-12 p-4 sm:p-6 bg-gradient-to-t from-background/95 to-transparent z-20 pointer-events-none'>
                <div className='max-w-3xl mx-auto flex flex-col sm:flex-row justify-between sm:items-center gap-4 border border-primary/50 bg-background/80 backdrop-blur-xl shadow-xl rounded-2xl p-4 sm:px-6 pointer-events-auto'>
                  <div>
                    <p className='font-bold text-foreground'>Hoàn tất bài kiểm tra</p>
                    <p className='text-sm text-muted-foreground font-medium'>
                      Đảm bảo mỗi câu hỏi có ít nhất một đáp án đúng.
                    </p>
                  </div>
                  <div className='flex items-center gap-3 w-full sm:w-auto'>
                    <Button variant='ghost' type='button' className='flex-1 sm:flex-none' onClick={() => form.reset()}>
                      Hủy
                    </Button>
                    <Button type='button' className='flex-1 sm:flex-none shadow-md font-bold'>
                      Xuất bản bài kiểm tra
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
