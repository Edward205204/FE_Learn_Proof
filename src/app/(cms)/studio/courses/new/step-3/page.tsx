'use client'

import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, Check } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { PATH } from '@/constants/path'
import { publishCourseSchema, type PublishCourseBody } from '@/app/(cms)/_utils/zod'
import { CoursePageShell } from '@/app/(cms)/_components/course-page-shell'
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
    <CoursePageShell
      currentStep={3}
      backLabel='Quay lại danh sách chương'
      title='Xuất bản khóa học'
      description='Cấu hình giá bán và kiểm tra trước khi công khai khóa học.'
      onBack={() => router.push(`${PATH.COURSE_NEW_STEP2}${courseId ? `?courseId=${courseId}` : ''}`)}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
        <CourseStep3PricingFields
          control={control}
          setValue={setValue}
          isFree={isFree}
          priceLabel='Giá gốc (VNĐ)'
          description='Thiết lập mức giá phù hợp cho khóa học của bạn.'
        />

        <div className='pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4'>
          <Button
            variant='ghost'
            type='button'
            className='font-semibold text-muted-foreground w-full sm:w-auto h-11 px-6 rounded-xl hover:bg-muted'
            onClick={() => router.push(`${PATH.COURSE_NEW_STEP2}${courseId ? `?courseId=${courseId}` : ''}`)}
          >
            <ChevronLeft className='w-4 h-4 mr-2' />
            Quay lại
          </Button>

          <div className='flex items-center gap-3 w-full sm:w-auto'>
            <Button variant='outline' type='button' className='font-bold h-11 px-6 rounded-xl w-full sm:w-auto bg-background'>
              Lưu bản nháp
            </Button>
            <Button type='submit' className='font-bold h-11 px-8 rounded-xl shadow-md w-full sm:w-auto' disabled={publishMutation.isPending || !courseId}>
              <Check className='w-5 h-5 mr-2' />
              Hoàn tất xuất bản
            </Button>
          </div>
        </div>
      </form>
    </CoursePageShell>
  )
}
