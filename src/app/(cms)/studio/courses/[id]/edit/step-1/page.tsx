'use client'

import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { PATH } from '@/constants/path'
import { CreateCourseStep1, createCourseStep1Schema } from '@/app/(cms)/_utils/zod'
import { CoursePageShell } from '@/app/(cms)/_components/course-page-shell'
import { CourseStep1Fields } from '@/app/(cms)/_components/course-step1-fields'
import {
  useGetCategoriesQuery,
  useGetCourseBaseInfoQuery,
  useUpdateCourseBaseInfoMutation
} from '@/app/(cms)/_hooks/use-course-mutation'

export default function EditCourseStep1Page() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const courseId = params.id

  const { data: categories } = useGetCategoriesQuery()
  const { data: baseInfo, isLoading } = useGetCourseBaseInfoQuery(courseId)
  const updateBaseInfoMutation = useUpdateCourseBaseInfoMutation(courseId)
  const form = useForm<CreateCourseStep1>({
    resolver: zodResolver(createCourseStep1Schema),
    defaultValues: {
      title: '',
      categoryId: '',
      level: 'BEGINNER',
      shortDesc: '',
      thumbnail: null
    }
  })

  useEffect(() => {
    if (!baseInfo) return
    form.reset({
      title: baseInfo.title,
      categoryId: baseInfo.categoryId,
      level: baseInfo.level,
      shortDesc: baseInfo.shortDesc,
      thumbnail: baseInfo.thumbnail ? baseInfo.thumbnail : null
    })
  }, [baseInfo, form])

  const shortDescValue = useWatch({ control: form.control, name: 'shortDesc' })
  const thumbnailValue = useWatch({ control: form.control, name: 'thumbnail' })
  const shortDescriptionLength = shortDescValue?.length ?? 0

  const onNext = async (data: CreateCourseStep1) => {
    await updateBaseInfoMutation.mutateAsync(data)
    router.push(`${PATH.STUDIO_COURSES}/courses/${courseId}/edit/step2`)
  }

  return (
    <CoursePageShell
      currentStep={1}
      backLabel='Quay lại danh sách khóa học'
      title='Chỉnh sửa khóa học'
      description='Cập nhật những thông tin cơ bản về khóa học của bạn.'
      onBack={() => router.push(PATH.STUDIO_COURSES)}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)} className='space-y-8'>
          <CourseStep1Fields
            form={form}
            categories={categories}
            shortDescriptionLength={shortDescriptionLength}
            thumbnailUrl={thumbnailValue}
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
            <Button
              type='submit'
              className='px-6 font-semibold'
              disabled={updateBaseInfoMutation.isPending || isLoading}
            >
              Tiếp theo: Chương học
              <ArrowRight className='w-4 h-4 ml-2' />
            </Button>
          </div>
        </form>
      </Form>
    </CoursePageShell>
  )
}
