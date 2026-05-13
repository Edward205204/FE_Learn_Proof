'use client'

import { Suspense } from 'react'
import { Archive } from 'lucide-react'

import { CourseListSkeleton } from '../../../_components/course-list-skeleton'
import { CourseManagementPageContent } from '../../../_components/course-management-page-content'

export default function ArchivedCoursesPage() {
  return (
    <Suspense
      fallback={
        <div className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
          <div className='h-24 sm:h-28 animate-pulse bg-muted/40 rounded-xl border border-border/50' />
          <CourseListSkeleton />
        </div>
      }
    >
      <CourseManagementPageContent
        fixedStatus='ARCHIVED'
        title='Khóa học lưu trữ'
        description='Xem lại các khóa học đã được đưa vào chế độ lưu trữ.'
        emptyTitle='Không có khóa học lưu trữ'
        emptyDescription='Khi bạn lưu trữ một khóa học, nó sẽ xuất hiện tại đây.'
        icon={Archive}
      />
    </Suspense>
  )
}
