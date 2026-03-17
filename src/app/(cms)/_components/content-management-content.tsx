'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, BookOpen, Plus, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import Pagination from '@/components/common/pagination'
import { PATH } from '@/constants/path'
import { useQueryParams } from '@/hooks/use-query-params'

import { CourseCard } from './course-card'
import { CourseListSkeleton } from './course-list-skeleton'
import CourseManagerFilter from './course-manager-filter'
import { useGetMyCoursesManagerQuery } from '../_hooks/use-course-mutation'
import { GetMyCoursesManagerQuerySchema, type ManagerFilterStatus } from '../_utils/zod'

export function ContentManagementContent() {
  const [queryParams, setQueryParams] = useQueryParams(GetMyCoursesManagerQuerySchema)
  const { data, isLoading, isFetching, isError, error, refetch } = useGetMyCoursesManagerQuery(queryParams)

  const courses = data?.items ?? []
  const meta = data?.meta

  useEffect(() => {
    if (!isError || !error) return
    const axiosError = error as { response?: { data?: { message: string | { message: string }[] } } }
    const serverMsg = axiosError.response?.data?.message
    let msg = 'Không thể tải danh sách khóa học.'
    if (serverMsg) {
      msg = Array.isArray(serverMsg) ? serverMsg.map((e) => e.message).join(', ') : serverMsg
    }
    toast.error(msg)
  }, [isError, error])

  const handleStatusChange = (status: ManagerFilterStatus) => {
    setQueryParams({ status, page: 1 })
  }

  const handlePageChange = (page: number) => {
    setQueryParams({ page })
  }

  return (
    <div className='p-8 max-w-5xl mx-auto space-y-6'>
      <div className='flex justify-between items-center border-b pb-6'>
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight'>Quản lý Khóa học</h1>
          <p className='text-muted-foreground mt-1'>Tạo và quản lý các khóa học của bạn.</p>
        </div>
        <Button asChild className='shadow-sm'>
          <Link href={PATH.COURSE_NEW_STEP1}>
            <Plus className='w-4 h-4 mr-2' /> Tạo khóa học mới
          </Link>
        </Button>
      </div>

      <div className='flex items-center justify-between'>
        <CourseManagerFilter status={queryParams.status} onStatusChange={handleStatusChange} />
        {meta && <p className='text-sm text-muted-foreground'>{meta.total} khóa học</p>}
      </div>

      <div className={`transition-opacity duration-150 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
        {isLoading ? (
          <CourseListSkeleton />
        ) : isError ? (
          <div className='flex flex-col items-center justify-center py-24 text-center'>
            <AlertCircle className='h-12 w-12 text-destructive mb-4' />
            <h3 className='font-semibold text-lg'>Đã xảy ra lỗi</h3>
            <p className='text-muted-foreground mt-1 mb-6'>Không thể tải danh sách khóa học. Vui lòng thử lại.</p>
            <Button variant='outline' onClick={() => refetch()}>
              <RefreshCw className='w-4 h-4 mr-2' /> Thử lại
            </Button>
          </div>
        ) : courses.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-24 text-center'>
            <BookOpen className='h-12 w-12 text-muted-foreground mb-4' />
            <h3 className='font-semibold text-lg'>Chưa có khóa học nào</h3>
            <p className='text-muted-foreground mt-1 mb-6'>Bắt đầu bằng cách tạo khóa học đầu tiên của bạn.</p>
            <Button asChild>
              <Link href={PATH.COURSE_NEW_STEP1}>
                <Plus className='w-4 h-4 mr-2' /> Tạo khóa học mới
              </Link>
            </Button>
          </div>
        ) : (
          <div className='space-y-3'>
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className='pt-4 border-t'>
          <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )
}
