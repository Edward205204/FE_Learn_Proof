'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Pencil, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useUpdateCourseStatusMutation, useDeleteCourseMutation } from '../_hooks/use-course-mutation'
import type { ManagerCourseItem } from '../_utils/zod'
import {
  formatDate,
  formatPrice,
  LEVEL_CLASS,
  LEVEL_LABEL,
  STATUS_LABEL,
  STATUS_VARIANT
} from '../_constants/course-manager'
import { PATH } from '@/constants/path'
import { EditCourseMetadataDialog } from './edit-course-metadata-dialog'

interface CourseCardProps {
  course: ManagerCourseItem
  onPrefetch?: (courseId: string) => void
}

export function CourseCard({ course, onPrefetch }: CourseCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const statusMutation = useUpdateCourseStatusMutation(course.id)
  const deleteCourseMutation = useDeleteCourseMutation()

  const analytics = course.overallAnalytics

  return (
    <>
      <Link
        href={`${PATH.STUDIO_COURSES}/${course.id}`}
        prefetch={false}
        onMouseEnter={() => onPrefetch?.(course.id)}
        onFocus={() => onPrefetch?.(course.id)}
        className='block cursor-pointer group'
      >
        <Card className='border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 bg-card overflow-hidden'>
          <CardContent className='p-4 sm:p-5'>
            <div className='flex flex-col sm:flex-row items-start gap-4 sm:gap-6'>
              {/* Image Section */}
              <div className='relative aspect-video w-full sm:w-44 shrink-0 rounded-xl bg-muted/50 overflow-hidden border border-border/50'>
                {course.thumbnail ? (
                  <Image
                    fill
                    src={course.thumbnail}
                    alt={course.title}
                    className='object-cover transition-transform duration-500 group-hover:scale-105'
                    sizes='(max-width: 640px) 100vw, 176px'
                  />
                ) : (
                  <div className='flex items-center justify-center h-full text-muted-foreground/30'>
                    <BookOpen className='size-8' />
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className='flex-1 min-w-0 w-full py-0.5'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0'>
                    <h3 className='font-bold text-[17px] text-foreground group-hover:text-primary transition-colors line-clamp-1'>
                      {course.title}
                    </h3>
                    <p className='text-sm text-foreground/60 line-clamp-2 mt-1 leading-relaxed'>
                      {course.shortDesc?.replace(/<[^>]*>?/gm, '') || 'Chưa có mô tả'}
                    </p>
                  </div>

                  {/* Nút chỉnh sửa & xóa — click mở dialog, không navigate */}
                  <div
                    className='flex items-center gap-1.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity'
                    onClick={(e) => e.preventDefault()}
                  >
                    <Button
                      variant='outline'
                      size='icon-sm'
                      className='bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/30 text-muted-foreground border-border/50 h-8 w-8 rounded-full shadow-sm transition-all'
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setEditOpen(true)
                      }}
                      title='Chỉnh sửa thông tin khóa học'
                    >
                      <Pencil className='size-3.5' />
                    </Button>
                    <Button
                      variant='outline'
                      size='icon-sm'
                      className='bg-background hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 text-muted-foreground border-border/50 h-8 w-8 rounded-full shadow-sm transition-all'
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setDeleteOpen(true)
                      }}
                      title='Xóa khóa học'
                    >
                      <Trash2 className='size-3.5' />
                    </Button>
                  </div>
                </div>

                <div className='flex items-center gap-2 mt-3.5 flex-wrap'>
                  <div
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  >
                    <Select
                      value={course.status}
                      onValueChange={(val: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => statusMutation.mutate(val)}
                      disabled={statusMutation.isPending}
                    >
                      <SelectTrigger className='h-5 p-0 border-0 shadow-none focus:ring-0 gap-0 mr-1 [&>sv\\g]:hidden'>
                        <Badge
                          variant={STATUS_VARIANT[course.status]}
                          className='text-[10px] px-2 h-5 shadow-none tracking-wide uppercase cursor-pointer hover:opacity-80'
                        >
                          <SelectValue />
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_LABEL).map(([key, label]) => (
                          <SelectItem key={key} value={key} className='text-xs font-medium'>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Badge
                    variant='outline'
                    className={`text-[10px] px-2 h-5 uppercase tracking-wide shadow-none ${LEVEL_CLASS[course.level]}`}
                  >
                    {LEVEL_LABEL[course.level]}
                  </Badge>

                  <div className='ml-2 flex items-center gap-1.5'>
                    <span className='text-[13px] font-bold text-foreground'>
                      {formatPrice(course.price, course.isFree)}
                    </span>
                    {course.originalPrice && course.originalPrice > course.price && (
                      <span className='text-[11px] font-medium text-muted-foreground line-through opacity-70'>
                        {course.originalPrice.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                  </div>
                </div>

                <div className='flex flex-wrap items-center gap-x-4 gap-y-2 mt-3.5 text-[11px] font-medium text-muted-foreground'>
                  {/* {analytics && (
                    <>
                      <span className='inline-flex items-center gap-1.5 bg-muted/30 px-2 py-0.5 rounded-sm'>
                        <Star className='size-3 fill-amber-400 text-amber-400' />
                        <span className='text-foreground/80'>{analytics.avgRating.toFixed(1)}</span>
                      </span>
                      <span className='inline-flex items-center gap-1.5'>
                        <Users className='size-3 opacity-70' />
                        {analytics.totalStudents} học viên
                      </span>
                      <span className='inline-flex items-center gap-1.5'>
                        <TrendingUp className='size-3 opacity-70' />
                        {analytics.avgInterestScore.toFixed(1)} điểm
                      </span>
                    </>
                  )} */}
                  <div className='flex-1' />
                  <span className='opacity-70'>{formatDate(course.createdAt)}</span>
                  {!course.isCompleted && (
                    <Badge
                      variant='outline'
                      className='text-[9px] px-1.5 py-0 h-4 bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-none'
                    >
                      Chưa hoàn thiện
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Dialog chỉnh sửa metadata — render ngoài Link để tránh nested anchor */}
      <EditCourseMetadataDialog courseId={course.id} open={editOpen} onOpenChange={setEditOpen} />

      {/* Dialog xác nhận xóa khóa học */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa khóa học</DialogTitle>
          </DialogHeader>
          <div className='py-4 space-y-2'>
            <p>
              Bạn có chắc chắn muốn xóa khóa học <span className='font-bold'>{course.title}</span> không?
            </p>
            <p className='text-sm text-destructive font-medium'>
              Hành động này sẽ xóa toàn bộ chương, bài học và dữ liệu liên quan. Không thể hoàn tác.
            </p>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteOpen(false)} disabled={deleteCourseMutation.isPending}>
              Hủy
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                deleteCourseMutation.mutate(course.id, {
                  onSuccess: () => {
                    setDeleteOpen(false)
                  }
                })
              }}
              disabled={deleteCourseMutation.isPending}
            >
              {deleteCourseMutation.isPending ? 'Đang xóa...' : 'Xóa khóa học'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
