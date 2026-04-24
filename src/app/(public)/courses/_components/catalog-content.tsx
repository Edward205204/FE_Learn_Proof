'use client'

import CourseCard from '../../_components/course-card'
import { HomeCourseCard } from '@/schemas/course.schema'
import { Search } from 'lucide-react'
import { Meta } from '../../_api/course.api'
import Pagination from '@/components/common/pagination'
import { useRouter, useSearchParams } from 'next/navigation'

interface CatalogContentProps {
  courses: HomeCourseCard[]
  meta?: Meta | null
  isLoading?: boolean
}

export default function CatalogContent({ courses, meta, isLoading }: CatalogContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`, { scroll: true })
  }

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full'>
        {[...Array(8)].map((_, i) => (
          <div key={i} className='flex flex-col gap-4 animate-pulse'>
            <div className='aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl' />
            <div className='h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4' />
            <div className='h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2' />
          </div>
        ))}
      </div>
    )
  }

  if (!courses || courses.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 px-4 text-center w-full bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800'>
        <div className='p-4 bg-white dark:bg-slate-800 rounded-full shadow-xl mb-6'>
          <Search size={40} className='text-slate-400' />
        </div>
        <h3 className='text-xl font-bold mb-2'>Không tìm thấy khóa học nào</h3>
        <p className='text-slate-500 max-w-xs'>
          Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để tìm thấy nội dung phù hợp hơn.
        </p>
      </div>
    )
  }

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-6'>
        <p className='text-sm font-medium text-slate-500'>
          Hiển thị <span className='font-bold text-foreground'>{meta?.total ?? courses.length}</span> kết quả
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10'>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className='mt-16 flex justify-center'>
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}
