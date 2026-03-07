'use client'

import Link from 'next/link'
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PATH } from '@/constants/path'
import { Course } from '../_types/content'

const LEVEL_LABEL: Record<Course['level'], string> = {
  BEGINNER: 'Cơ bản',
  INTERMEDIATE: 'Trung cấp',
  ADVANCED: 'Nâng cao'
}

const STATUS_LABEL: Record<Course['status'], string> = {
  DRAFT: 'Bản nháp',
  PUBLISHED: 'Đã xuất bản',
  ARCHIVED: 'Đã lưu trữ'
}

const STATUS_VARIANT: Record<Course['status'], 'secondary' | 'default' | 'outline'> = {
  DRAFT: 'secondary',
  PUBLISHED: 'default',
  ARCHIVED: 'outline'
}

// Mock data — thay bằng useGetCoursesQuery() khi BE sẵn sàng
const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Professional Business Practices',
    shortDescription: 'Khóa học thực hành nghiệp vụ chuyên nghiệp dành cho người đi làm.',
    level: 'INTERMEDIATE',
    status: 'PUBLISHED',
    price: 499000,
    categoryId: 'cat-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Business English Fundamentals',
    shortDescription: 'Tiếng Anh thương mại từ căn bản đến thành thạo.',
    level: 'BEGINNER',
    status: 'DRAFT',
    price: 0,
    categoryId: 'cat-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

function CourseCard({ course }: { course: Course }) {
  return (
    <Card className='border shadow-sm hover:shadow-md transition-shadow'>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex gap-4 flex-1 min-w-0'>
            <div className='h-16 w-24 rounded-lg bg-muted flex items-center justify-center shrink-0'>
              <BookOpen className='h-6 w-6 text-muted-foreground' />
            </div>
            <div className='min-w-0'>
              <h3 className='font-bold text-base truncate'>{course.title}</h3>
              <p className='text-sm text-muted-foreground line-clamp-2 mt-1'>{course.shortDescription}</p>
              <div className='flex items-center gap-2 mt-3 flex-wrap'>
                <Badge variant={STATUS_VARIANT[course.status]}>{STATUS_LABEL[course.status]}</Badge>
                <Badge variant='outline'>{LEVEL_LABEL[course.level]}</Badge>
                <span className='text-xs text-muted-foreground'>
                  {course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString('vi-VN')}đ`}
                </span>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-1 shrink-0'>
            <Button variant='ghost' size='icon' asChild>
              <Link href={`/content-management/courses/${course.id}`}>
                <Pencil className='h-4 w-4' />
              </Link>
            </Button>
            <Button variant='ghost' size='icon' className='text-destructive hover:text-destructive'>
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ContentManagementPage() {
  return (
    <div className='p-8 max-w-5xl mx-auto space-y-8'>
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

      {MOCK_COURSES.length === 0 ? (
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
        <div className='space-y-4'>
          {MOCK_COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
