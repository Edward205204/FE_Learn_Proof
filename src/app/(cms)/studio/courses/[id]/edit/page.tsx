'use client'

import { useEffect } from 'react'
import { useForm, useWatch, type UseFormReturn, type Control, type UseFormSetValue } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import { ArrowRight, Check, ChevronLeft } from 'lucide-react'


import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { PATH } from '@/constants/path'
import {
  createCourseStep1Schema,
  publishCourseSchema,
  type CreateCourseStep1,
  type PublishCourseBody
} from '@/app/(cms)/_utils/zod'

import { CourseStep1Fields } from '@/app/(cms)/_components/course-step1-fields'
import { CourseStep3PricingFields } from '@/app/(cms)/_components/course-step3-pricing-fields'
import {
  useGetCategoriesQuery,
  useGetCourseBaseInfoQuery,
  useUpdateCourseBaseInfoMutation,
  usePublishCourseMutation
} from '@/app/(cms)/_hooks/use-course-mutation'
import { toast } from 'sonner'

// Combine schemas for the single edit page
const editCourseSchema = createCourseStep1Schema.and(publishCourseSchema)

// Flatten the intersection so React Hook Form's Path<T> can traverse it without complaining
type EditCourseFormValues = {
  [K in keyof (CreateCourseStep1 & PublishCourseBody)]: (CreateCourseStep1 & PublishCourseBody)[K]
}

export default function EditCoursePage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const courseId = params.id

  const { data: categories } = useGetCategoriesQuery()
  const { data: baseInfo, isLoading } = useGetCourseBaseInfoQuery(courseId)
  
  const updateBaseInfoMutation = useUpdateCourseBaseInfoMutation(courseId)
  const publishMutation = usePublishCourseMutation(courseId)

  const form = useForm<EditCourseFormValues>({
    resolver: zodResolver(editCourseSchema),
    defaultValues: {
      title: '',
      categoryId: '',
      level: 'BEGINNER',
      shortDesc: '',
      fullDesc: '',
      thumbnail: null,
      isFree: false,
      price: 0,
      originalPrice: null
    }
  })

  useEffect(() => {
    if (!baseInfo) return
    form.reset({
      title: baseInfo.title,
      categoryId: baseInfo.categoryId,
      level: baseInfo.level,
      shortDesc: baseInfo.shortDesc,
      fullDesc: baseInfo.fullDesc,
      thumbnail: baseInfo.thumbnail ? baseInfo.thumbnail : null,
      isFree: baseInfo.isFree,
      price: baseInfo.price,
      originalPrice: baseInfo.originalPrice
    })
  }, [baseInfo, form])

  const shortDescValue = useWatch({ control: form.control, name: 'shortDesc' })
  const shortDescriptionLength = shortDescValue?.length ?? 0
  
  const isFree = useWatch({ control: form.control, name: 'isFree' })

  const onSubmit = async (data: EditCourseFormValues) => {
    try {
      // 1. Update basic info (Step 1 equivalent)
      await updateBaseInfoMutation.mutateAsync({
        title: data.title,
        categoryId: data.categoryId,
        level: data.level,
        shortDesc: data.shortDesc,
        fullDesc: data.fullDesc,
        thumbnail: data.thumbnail
      })

      // 2. Update pricing (Step 3 equivalent)
      await publishMutation.mutateAsync({
        isFree: data.isFree,
        price: data.isFree ? 0 : data.price,
        originalPrice: data.isFree ? null : data.originalPrice
      })

      toast.success('Lưu thông tin khóa học thành công!')
      router.push(PATH.STUDIO_COURSES)
    } catch (error) {
      console.error('Lỗi khi lưu khóa học:', error)
      toast.error('Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.')
    }
  }

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-8'>
      <div className='space-y-2'>
        <button
          type='button'
          onClick={() => router.push(PATH.STUDIO_COURSES)}
          className='flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors'
        >
          <ChevronLeft className='w-4 h-4 mr-1' />
          Quay lại danh sách khóa học
        </button>
        <h1 className='text-3xl font-bold tracking-tight'>Chỉnh sửa khóa học</h1>
        <p className='text-muted-foreground'>Cập nhật thông tin cơ bản và giá bán của khóa học.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-12'>
          
          {/* Basic Info Section (formerly Step 1) */}
          <div className='space-y-6'>
            <h2 className='text-xl font-bold tracking-tight border-b pb-2'>1. Thông tin cơ bản</h2>
            <CourseStep1Fields
              form={form as unknown as UseFormReturn<CreateCourseStep1>}
              categories={categories}
              shortDescriptionLength={shortDescriptionLength}
              thumbnailUrl={form.getValues('thumbnail')}
            />
          </div>

          {/* Pricing Section (formerly Step 3) */}
          <div className='space-y-6'>
            <h2 className='text-xl font-bold tracking-tight border-b pb-2'>2. Giá & Xuất bản</h2>
            <CourseStep3PricingFields
              control={form.control as unknown as Control<PublishCourseBody>}
              setValue={form.setValue as unknown as UseFormSetValue<PublishCourseBody>}
              isFree={isFree}
              priceLabel='Giá (VNĐ)'
              description='Cập nhật cách tính phí cho khóa học này.'
            />
          </div>

          {/* Actions */}
          <div className='pt-8 flex items-center justify-between border-t'>
            <Button
              variant='ghost'
              type='button'
              className='font-semibold text-muted-foreground'
              onClick={() => router.push(PATH.STUDIO_COURSES)}
            >
              Hủy
            </Button>
            
            <div className='flex gap-3'>
              <Button
                variant='outline'
                type='button'
                onClick={() => router.push(`${PATH.STUDIO_COURSES}/${courseId}/edit/step-2`)}
                className='font-semibold'
              >
                Chỉnh sửa khung chương
                <ArrowRight className='w-4 h-4 ml-2' />
              </Button>

              <Button
                type='submit'
                className='px-8 font-semibold'
                disabled={updateBaseInfoMutation.isPending || publishMutation.isPending || isLoading}
              >
                <Check className='w-4 h-4 mr-2' />
                Lưu toàn bộ
              </Button>
            </div>
          </div>
          
        </form>
      </Form>
    </div>
  )
}
