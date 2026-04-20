'use client'

import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { PATH } from '@/constants/path'
import { CreateCourseStep1, createCourseStep1Schema } from '@/app/(cms)/_utils/zod'
import { persistDraftCourseId } from '@/app/(cms)/_utils/course-workflow'
import { CoursePageShell } from '@/app/(cms)/_components/course-page-shell'
import { CourseStep1Fields } from '@/app/(cms)/_components/course-step1-fields'
import { useCreateCourseStep1Mutation, useGetCategoriesQuery } from '@/app/(cms)/_hooks/use-course-mutation'

export default function CreateCourseStep1Page() {
  const router = useRouter()
  const { data: categories } = useGetCategoriesQuery()
  const createCourseMutation = useCreateCourseStep1Mutation()
  const form = useForm<CreateCourseStep1>({
    resolver: zodResolver(createCourseStep1Schema),
    defaultValues: {
      title: '',
      categoryId: '',
      level: 'BEGINNER',
      shortDesc: '',
      fullDesc: '',
      thumbnail: null
      // expectedDays: 0 // tạm thời chưa có
    }
  })

  const shortDescValue = useWatch({ control: form.control, name: 'shortDesc' })
  const shortDescriptionLength = shortDescValue?.length ?? 0

  const onNext = async (data: CreateCourseStep1) => {
    try {
      const res = await createCourseMutation.mutateAsync(data)
      const courseId = res.data.id
      persistDraftCourseId(courseId)
      router.push(`${PATH.COURSE_NEW_STEP2}?courseId=${courseId}`)
    } catch (error: unknown) {
      // Đã bắt lỗi để ko văng màn hình đỏ. Hiện alert để xem chi tiết mã lỗi 400 là gì.
      const errorData = (error as { response?: { data?: unknown } })?.response?.data
      alert('Chi tiết lỗi từ BE:\n' + JSON.stringify(errorData, null, 2))
      console.error(error)
    }
  }

  return (
    <CoursePageShell
      currentStep={1}
      backLabel='Quay lại danh sách khóa học'
      title='Tạo khóa học mới'
      description='Bắt đầu với những thông tin cơ bản về khóa học của bạn.'
      onBack={() => router.push(PATH.STUDIO_COURSES)}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)} className='space-y-8'>
          <CourseStep1Fields
            form={form}
            categories={categories}
            shortDescriptionLength={shortDescriptionLength}
            thumbnailUrl={form.getValues('thumbnail')}
          />

          <div className='pt-6 border-t flex items-center justify-between'>
            <Button
              variant='ghost'
              type='button'
              className='font-semibold text-muted-foreground'
              onClick={() => router.push(PATH.STUDIO_COURSES)}
            >
              Hủy
            </Button>
            <div className='flex items-center gap-3'>
              {/* <Button variant='outline' type='button' className='font-semibold'>
                Lưu bản nháp
              </Button> */}
              <Button type='submit' className='px-6 font-semibold' disabled={createCourseMutation.isPending}>
                Tiếp theo: Chương học
                <ArrowRight className='w-4 h-4 ml-2' />
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </CoursePageShell>
  )
}
