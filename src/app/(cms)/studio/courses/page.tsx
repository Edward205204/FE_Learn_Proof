'use client'

import { Suspense } from 'react'
import { ContentManagementContent } from '../../_components/content-management-content'
import { CourseListSkeleton } from '../../_components/course-list-skeleton'

export default function ContentManagementPage() {
  return (
    <Suspense
      fallback={
        <div className='p-8 max-w-5xl mx-auto space-y-6'>
          <div className='h-20 animate-pulse bg-muted rounded' />
          <CourseListSkeleton />
        </div>
      }
    >
      <ContentManagementContent />
    </Suspense>
  )
}
