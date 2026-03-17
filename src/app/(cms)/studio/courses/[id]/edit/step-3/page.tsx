'use client'

import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PATH } from '@/constants/path'
import { publishCourseSchema, type PublishCourseBody } from '@/app/(cms)/_utils/zod'
import { CourseStepper } from '@/app/(cms)/_components/course-stepper'
import { CourseStep3PricingFields } from '@/app/(cms)/_components/course-step3-pricing-fields'
import { useGetCourseBaseInfoQuery, usePublishCourseMutation } from '@/app/(cms)/_hooks/use-course-mutation'

export default function EditCourseStep3Page() {
  const router = useRouter()
  const params = useParams<{ courseId: string }>()
  const courseId = params.courseId

  const { data: baseInfo } = useGetCourseBaseInfoQuery(courseId)
  const publishMutation = usePublishCourseMutation(courseId)

  const { control, setValue, handleSubmit, reset } = useForm<PublishCourseBody>({
    resolver: zodResolver(publishCourseSchema),
    defaultValues: {
      isFree: false,
      price: 0,
      originalPrice: null
    }
  })

  useEffect(() => {
    if (!baseInfo) return
    reset({
      isFree: baseInfo.isFree,
      price: baseInfo.price,
      originalPrice: baseInfo.originalPrice
    })
  }, [baseInfo, reset])

  const isFree = useWatch({ control, name: 'isFree' }) ?? false

  const onSubmit = async (data: PublishCourseBody) => {
    const payload: PublishCourseBody = {
      isFree: data.isFree,
      price: data.isFree ? 0 : data.price,
      originalPrice: data.isFree ? null : data.originalPrice
    }
    await publishMutation.mutateAsync(payload)
    router.push(PATH.STUDIO)
  }

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-8'>
      <div className='space-y-2'>
        <button
          type='button'
          onClick={() => router.push(`${PATH.STUDIO}/courses/${courseId}/edit/step2`)}
          className='flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors'
        >
          <ChevronLeft className='w-4 h-4 mr-1' />
          Quay lại bước trước
        </button>
        <h1 className='text-3xl font-bold tracking-tight'>Chỉnh sửa khóa học</h1>
        <p className='text-muted-foreground'>Cập nhật giá và xuất bản.</p>
      </div>

      <CourseStepper currentStep={3} />

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <CourseStep3PricingFields
          control={control}
          setValue={setValue}
          isFree={isFree}
          priceLabel='Giá (VNĐ)'
          description='Cập nhật cách tính phí cho khóa học này.'
        />

        <div className='flex border-t justify-between pt-6'>
          <Button
            variant='outline'
            type='button'
            onClick={() => router.push(`${PATH.STUDIO}/courses/${courseId}/edit/step2`)}
          >
            <ChevronLeft className='w-4 h-4 mr-1' />
            Quay lại
          </Button>

          <Button type='submit' disabled={publishMutation.isPending}>
            <Check className='w-4 h-4 mr-1' />
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  )
}
