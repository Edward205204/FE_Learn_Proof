'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Pencil, Star, TrendingUp, Trash2, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useDeleteCourseMutation } from '../_hooks/use-course-mutation'
import type { ManagerCourseItem } from '../_utils/zod'
import {
  formatDate,
  formatPrice,
  LEVEL_CLASS,
  LEVEL_LABEL,
  STATUS_LABEL,
  STATUS_VARIANT
} from '../_constants/course-manager'

export function CourseCard({ course }: { course: ManagerCourseItem }) {
  const deleteMutation = useDeleteCourseMutation()
  const analytics = course.overallAnalytics

  return (
    <Card className='border shadow-sm hover:shadow-md transition-shadow'>
      <CardContent className='p-5'>
        <div className='flex items-start gap-4'>
          <div className='relative h-20 w-32 rounded-lg bg-muted overflow-hidden shrink-0'>
            {course.thumbnail ? (
              <Image fill src={course.thumbnail} alt={course.title} className='object-cover' sizes='128px' />
            ) : (
              <div className='flex items-center justify-center h-full'>
                <BookOpen className='size-6 text-muted-foreground' />
              </div>
            )}
          </div>

          <div className='flex-1 min-w-0'>
            <div className='flex items-start justify-between gap-3'>
              <div className='min-w-0'>
                <h3 className='font-semibold text-base truncate'>{course.title}</h3>
                <p className='text-sm text-muted-foreground line-clamp-1 mt-0.5'>{course.shortDesc}</p>
              </div>

              <div className='flex items-center gap-1 shrink-0'>
                <Button variant='ghost' size='icon-sm' asChild>
                  <Link href={`/content-management/courses/${course.id}/edit/step1`}>
                    <Pencil className='size-3.5' />
                  </Link>
                </Button>
                <Button
                  variant='ghost'
                  size='icon-sm'
                  className='text-destructive hover:text-destructive'
                  onClick={() => deleteMutation.mutate(course.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className='size-3.5' />
                </Button>
              </div>
            </div>

            <div className='flex items-center gap-2 mt-2.5 flex-wrap'>
              <Badge variant={STATUS_VARIANT[course.status]}>{STATUS_LABEL[course.status]}</Badge>
              <Badge variant='outline' className={LEVEL_CLASS[course.level]}>
                {LEVEL_LABEL[course.level]}
              </Badge>
              <span className='text-xs font-medium text-muted-foreground'>
                {formatPrice(course.price, course.isFree)}
              </span>
              {course.originalPrice && course.originalPrice > course.price && (
                <span className='text-xs text-muted-foreground line-through'>
                  {course.originalPrice.toLocaleString('vi-VN')}đ
                </span>
              )}
            </div>

            <div className='flex items-center gap-4 mt-2 text-xs text-muted-foreground'>
              {analytics && (
                <>
                  <span className='inline-flex items-center gap-1'>
                    <Star className='size-3 fill-amber-400 text-amber-400' />
                    {analytics.avgRating.toFixed(1)}
                  </span>
                  <span className='inline-flex items-center gap-1'>
                    <Users className='size-3' />
                    {analytics.totalStudents}
                  </span>
                  <span className='inline-flex items-center gap-1'>
                    <TrendingUp className='size-3' />
                    {analytics.avgInterestScore.toFixed(1)}
                  </span>
                </>
              )}
              <span>{formatDate(course.createdAt)}</span>
              {!course.isCompleted && (
                <Badge
                  variant='outline'
                  className='text-[10px] px-1.5 py-0 bg-amber-50 text-amber-600 border-amber-200'
                >
                  Chưa hoàn thiện
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
