'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { ChevronLeft, CloudUpload, Sparkles, ArrowRight } from 'lucide-react'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PATH } from '@/constants/path'
import { createCourseStep1Schema, CreateCourseStep1Values } from '@/app/(content-management)/_utils/zod'
import { CourseStepper } from '@/app/(content-management)/_components/course-stepper'

const LEVEL_OPTIONS = [
  { value: 'BEGINNER', label: 'Cơ bản' },
  { value: 'INTERMEDIATE', label: 'Trung cấp' },
  { value: 'ADVANCED', label: 'Nâng cao' }
] as const

export default function CreateCourseStep1Page() {
  const router = useRouter()

  const form = useForm<CreateCourseStep1Values>({
    resolver: zodResolver(createCourseStep1Schema),
    defaultValues: {
      title: '',
      category: '',
      level: 'BEGINNER',
      shortDesc: '',
      fullDesc: '',
      thumbnail: ''
    }
  })

  const shortDescriptionLength = form.watch('shortDesc')?.length ?? 0

  const onNext = (data: CreateCourseStep1Values) => {
    // TODO: Lưu data vào state/context hoặc session storage khi tích hợp multi-step form
    console.log('Bước 1:', data)
    router.push(PATH.COURSE_NEW_STEP2)
  }

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-8'>
      <div className='space-y-2'>
        <button
          type='button'
          onClick={() => router.push(PATH.CONTENT_MANAGEMENT)}
          className='flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors'
        >
          <ChevronLeft className='w-4 h-4 mr-1' />
          Quay lại danh sách khóa học
        </button>
        <h1 className='text-3xl font-bold tracking-tight'>Tạo khóa học mới</h1>
        <p className='text-muted-foreground'>Bắt đầu với những thông tin cơ bản về khóa học của bạn.</p>
      </div>

      <CourseStepper currentStep={1} />

      <Card className='p-8 border-none shadow-sm ring-1 ring-border/50'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onNext)} className='space-y-8'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-semibold'>
                    Tiêu đề khóa học <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Ví dụ: Tiếng Anh thương mại cho người đi làm' {...field} className='h-12' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>Danh mục</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='h-12'>
                          <SelectValue placeholder='Chọn danh mục' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='development'>Lập trình</SelectItem>
                        <SelectItem value='business'>Kinh doanh</SelectItem>
                        <SelectItem value='design'>Thiết kế</SelectItem>
                        <SelectItem value='language'>Ngoại ngữ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='level'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>Trình độ</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='h-12'>
                          <SelectValue placeholder='Chọn trình độ' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LEVEL_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='shortDesc'
              render={({ field }) => (
                <FormItem>
                  <div className='flex justify-between items-end'>
                    <FormLabel className='font-semibold'>Mô tả ngắn</FormLabel>
                    <span className='text-[10px] uppercase font-bold text-muted-foreground tracking-tighter'>
                      {shortDescriptionLength}/250
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder='Mô tả ngắn gọn nội dung và lợi ích khóa học mang lại cho học viên...'
                      className='min-h-[100px] resize-none'
                      maxLength={250}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className='text-xs italic'>
                    Mô tả này xuất hiện trên thẻ khóa học ở trang chợ khóa học.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='bg-blue-50/50 border border-blue-100 rounded-xl p-6 space-y-4'>
              <div className='flex items-center gap-2 text-blue-700 font-semibold'>
                <Sparkles className='w-4 h-4 text-blue-500 fill-blue-500/20' />
                <span className='text-sm'>Ngữ cảnh cho AI Assistant</span>
              </div>
              <p className='text-sm text-blue-600/80 leading-relaxed'>
                Dán đề cương, ghi chú hoặc ý tưởng chi tiết vào đây. AI sẽ dùng thông tin này để tự động tạo nội dung
                chương học, mô tả bài học và câu hỏi quiz ở các bước tiếp theo.
              </p>
              <FormField
                control={form.control}
                name='fullDesc'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder='Ví dụ: Tuần 1: Giới thiệu khái niệm. Tuần 2: Thực hành chuyên sâu... Bao gồm mục tiêu học tập và kiến thức trọng tâm.'
                        className='min-h-[150px] bg-white border-blue-100 focus-visible:ring-blue-200'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='space-y-3'>
              <label className='text-sm font-semibold'>Ảnh bìa khóa học</label>
              <div className='border-2 border-dashed border-muted-foreground/20 rounded-xl p-10 flex flex-col items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer group'>
                <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                  <CloudUpload className='w-6 h-6 text-primary' />
                </div>
                <p className='text-sm font-medium'>
                  <span className='text-primary hover:underline'>Nhấn để tải lên</span> hoặc kéo thả vào đây
                </p>
                <p className='text-xs text-muted-foreground mt-1'>Khuyến nghị: 1280x720px. Tối đa 5MB (JPG, PNG).</p>
              </div>
            </div>

            <div className='pt-6 border-t flex items-center justify-between'>
              <Button
                variant='ghost'
                type='button'
                className='font-semibold text-muted-foreground'
                onClick={() => router.push(PATH.CONTENT_MANAGEMENT)}
              >
                Hủy
              </Button>
              <div className='flex items-center gap-3'>
                <Button variant='outline' type='button' className='font-semibold'>
                  Lưu bản nháp
                </Button>
                <Button type='submit' className='px-6 font-semibold'>
                  Tiếp theo: Chương học
                  <ArrowRight className='w-4 h-4 ml-2' />
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}
