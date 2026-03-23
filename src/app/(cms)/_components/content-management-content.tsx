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
import { useGetMyCoursesManagerQuery, usePrefetchManagerCourseDetail } from '../_hooks/use-course-mutation'
import { GetMyCoursesManagerQuerySchema, type ManagerFilterStatus } from '../_utils/zod'

export function ContentManagementContent() {
  const [queryParams, setQueryParams] = useQueryParams(GetMyCoursesManagerQuerySchema)
  const { data, isLoading, isFetching, isError, error, refetch } = useGetMyCoursesManagerQuery(queryParams)
  const prefetchCourseDetail = usePrefetchManagerCourseDetail()

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
    <div className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 border-b border-border/50 pb-6'>
        <div className='space-y-1.5'>
          <div className='flex items-center gap-2'>
            <BookOpen className='w-6 h-6 text-primary' />
            <h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground'>Quản lý Khóa học</h1>
          </div>
          <p className='text-sm text-muted-foreground'>Tạo, cập nhật và quản lý tất cả các khóa học của bạn tại đây.</p>
        </div>
        <Button asChild className='shadow-md hover:shadow-lg transition-all active:scale-95'>
          <Link href={PATH.COURSE_NEW_STEP1}>
            <Plus className='w-4 h-4 mr-1.5' /> Tạo khóa học mới
          </Link>
        </Button>
      </div>

      <div className='flex items-center justify-between bg-muted/30 p-2 sm:p-3 rounded-xl border border-border/50'>
        <div className="flex-1">
          <CourseManagerFilter status={queryParams.status} onStatusChange={handleStatusChange} />
        </div>
        {meta && (
          <div className='pl-4 pr-2 border-l border-border/50'>
            <p className='text-xs font-bold text-muted-foreground uppercase tracking-wider'>
              {meta.total} <span className="hidden sm:inline">khóa học</span>
            </p>
          </div>
        )}
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
              <CourseCard key={course.id} course={course} onPrefetch={prefetchCourseDetail} />
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
