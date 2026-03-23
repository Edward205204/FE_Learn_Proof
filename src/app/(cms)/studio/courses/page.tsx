'use client'

import { Suspense } from 'react'
import { ContentManagementContent } from '../../_components/content-management-content'
import { CourseListSkeleton } from '../../_components/course-list-skeleton'

export default function ContentManagementPage() {
  return (
    <Suspense
      fallback={
        <div className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
          <div className='h-24 sm:h-28 animate-pulse bg-muted/40 rounded-xl border border-border/50' />
          <CourseListSkeleton />
        </div>
      }
    >
      <ContentManagementContent />
    </Suspense>
  )
}
