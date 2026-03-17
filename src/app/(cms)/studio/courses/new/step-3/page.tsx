'use client'

import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, Check } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { PATH } from '@/constants/path'
import { publishCourseSchema, type PublishCourseBody } from '@/app/(cms)/_utils/zod'
import { CourseStepper } from '@/app/(cms)/_components/course-stepper'
import { usePublishCourseMutation } from '@/app/(cms)/_hooks/use-course-mutation'
import { clearDraftCourseId, getDraftCourseId } from '@/app/(cms)/_utils/course-workflow'
import { CourseStep3PricingFields } from '@/app/(cms)/_components/course-step3-pricing-fields'

export default function CreateCourseStep3Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = getDraftCourseId(searchParams)

  useEffect(() => {
    if (!courseId) router.replace(PATH.COURSE_NEW_STEP1)
  }, [courseId, router])

  const publishMutation = usePublishCourseMutation(courseId ?? '')

  const { control, setValue, handleSubmit } = useForm<PublishCourseBody>({
    resolver: zodResolver(publishCourseSchema),
    defaultValues: {
      isFree: false,
      price: 299000,
      originalPrice: null
    }
  })

  const isFree = useWatch({ control, name: 'isFree' }) ?? false

  const onSubmit = async (data: PublishCourseBody) => {
    if (!courseId) return
    const payload: PublishCourseBody = {
      isFree: data.isFree,
      price: data.isFree ? 0 : data.price,
      originalPrice: data.isFree ? null : data.originalPrice
    }
    await publishMutation.mutateAsync(payload)
    clearDraftCourseId()
    router.push(PATH.COURSE_NEW_FINISH)
  }

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-8'>
      <div className='space-y-2'>
        <button
          type='button'
          onClick={() => router.push(`${PATH.COURSE_NEW_STEP2}${courseId ? `?courseId=${courseId}` : ''}`)}
          className='flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors'
        >
          <ChevronLeft className='w-4 h-4 mr-1' />
          Quay lại bước trước
        </button>
        <h1 className='text-3xl font-bold tracking-tight'>Tạo khóa học mới</h1>
        <p className='text-muted-foreground'>Thiết lập giá và trạng thái xuất bản cho khóa học.</p>
      </div>

      <CourseStepper currentStep={3} />

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <CourseStep3PricingFields
          control={control}
          setValue={setValue}
          isFree={isFree}
          priceLabel='Giá gốc (VNĐ)'
          description='Cấu hình cách tính phí cho khóa học này.'
        />

        <div className='flex border-t justify-between pt-6'>
          <Button
            variant='outline'
            type='button'
            onClick={() => router.push(`${PATH.COURSE_NEW_STEP2}${courseId ? `?courseId=${courseId}` : ''}`)}
          >
            <ChevronLeft className='w-4 h-4 mr-1' />
            Quay lại
          </Button>

          <div className='flex gap-3'>
            <Button variant='outline' type='button'>
              Lưu bản nháp
            </Button>
            <Button type='submit' disabled={publishMutation.isPending || !courseId}>
              <Check className='w-4 h-4 mr-1' />
              Hoàn tất
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
