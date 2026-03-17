'use client'

import { Card, CardContent } from '@/components/ui/card'

export function CourseListSkeleton() {
  return (
    <div className='space-y-4'>
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className='border shadow-sm'>
          <CardContent className='p-5'>
            <div className='flex items-start gap-4'>
              <div className='h-20 w-32 rounded-lg bg-muted animate-pulse shrink-0' />
              <div className='flex-1 space-y-3'>
                <div className='h-4 w-2/3 bg-muted animate-pulse rounded' />
                <div className='h-3 w-1/2 bg-muted animate-pulse rounded' />
                <div className='flex gap-2'>
                  <div className='h-5 w-16 bg-muted animate-pulse rounded-full' />
                  <div className='h-5 w-14 bg-muted animate-pulse rounded-full' />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

