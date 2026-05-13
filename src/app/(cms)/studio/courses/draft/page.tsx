'use client'

import { Suspense } from 'react'
import { FilePenLine } from 'lucide-react'

import { CourseListSkeleton } from '../../../_components/course-list-skeleton'
import { CourseManagementPageContent } from '../../../_components/course-management-page-content'

export default function DraftCoursesPage() {
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
        fixedStatus='DRAFT'
        title='Khóa học bản nháp'
        description='Theo dõi các khóa học đang được soạn thảo trước khi xuất bản.'
        emptyTitle='Không có khóa học bản nháp'
        emptyDescription='Các khóa học bạn đang soạn sẽ xuất hiện tại đây để tiếp tục hoàn thiện.'
        icon={FilePenLine}
      />
    </Suspense>
  )
}
