'use client'

import { Search, Bell, PlayCircle, PlusCircle, ArrowRight, ChevronRight, Loader2 } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { PATH } from '@/constants/path'
import { config } from '@/constants/config'
import { useGetMyEnrollmentsQuery } from '../../_hooks/use-enrollment'
import { useAuthStore } from '@/store/auth.store'
import type { EnrollmentCourse } from '../../_api/enrollment.api'

export default function MyCoursesPage() {
  const { user } = useAuthStore()
  const { data: enrollments, isLoading } = useGetMyEnrollmentsQuery()

  const learningCourses = enrollments?.filter((e: EnrollmentCourse) => !e.completedAt) || []
  const completedCourses = enrollments?.filter((e: EnrollmentCourse) => e.completedAt) || []

  const displayFirstName = user?.fullName?.split(' ').pop() || 'bạn'

  return (
    <div className='min-h-screen bg-background text-foreground pb-20 pt-10'>
      <div className='max-w-[1240px] mx-auto px-6'>
        {/* Header Section */}
        <nav className='flex items-center gap-2 text-[12px] font-black tracking-widest uppercase text-slate-400 mb-8 mt-2'>
          <Link href='/' className='hover:text-[oklch(0.577_0.245_27.325)] transition-colors'>
            Trang chủ
          </Link>
          <ChevronRight size={14} />
          <span className='text-[oklch(0.577_0.245_27.325)]'>Học tập</span>
        </nav>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16'>
          <div className='space-y-2'>
            <h1 className='text-4xl font-bold tracking-tight'>Khóa học của tôi</h1>
            <p className='text-muted-foreground text-lg font-medium'>
              Chào {displayFirstName}, tiếp tục hành trình học tập nào!
            </p>
          </div>

          <div className='flex items-center gap-4'>
            <div className='relative w-full md:w-[360px]'>
              <Search className='absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground' size={20} />
              <input
                className='w-full pl-14 h-14 bg-background border border-input shadow-sm rounded-full text-[15px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium'
                placeholder='Tìm khóa học...'
              />
            </div>
            <button className='relative p-4 bg-background border border-border shadow-sm rounded-full text-muted-foreground hover:text-primary transition-colors'>
              <Bell size={24} />
              <span className='absolute top-4 right-4 w-3 h-3 bg-primary border-2 border-background rounded-full'></span>
            </button>
          </div>
        </div>

        {/* Categories / Tabs */}
        <Tabs defaultValue='learning' className='w-full'>
          <TabsList className='bg-transparent h-auto p-0 gap-12 flex justify-start border-none mb-10 border-b relative'>
            <TabsTrigger
              value='all'
              className="text-lg font-bold px-0 py-3 data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground bg-transparent border-none shadow-none ring-0 focus:ring-0 relative data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-1 data-[state=active]:after:bg-primary data-[state=active]:after:rounded-full rounded-none tracking-tight transition-all"
            >
              Tất cả
            </TabsTrigger>
            <TabsTrigger
              value='learning'
              className="text-lg font-bold px-0 py-3 data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground bg-transparent border-none shadow-none ring-0 focus:ring-0 relative data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-1 data-[state=active]:after:bg-primary data-[state=active]:after:rounded-full rounded-none tracking-tight transition-all"
            >
              Đang học ({learningCourses.length})
            </TabsTrigger>
            <TabsTrigger
              value='completed'
              className="text-lg font-bold px-0 py-3 data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground bg-transparent border-none shadow-none ring-0 focus:ring-0 relative data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-1 data-[state=active]:after:bg-primary data-[state=active]:after:rounded-full rounded-none tracking-tight transition-all"
            >
              Đã hoàn thành ({completedCourses.length})
            </TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className='flex items-center justify-center py-20 min-h-[30vh]'>
              <Loader2 className='w-8 h-8 animate-spin text-primary' />
            </div>
          ) : (
            <>
              <TabsContent value='learning' className='mt-0'>
                {learningCourses.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                    {learningCourses.map((enroll: EnrollmentCourse) => (
                      <CourseCard key={enroll.id} enroll={enroll} />
                    ))}
                  </div>
                ) : (
                  <div className='py-20 text-center text-muted-foreground text-lg'>
                    Bạn chưa có khóa học nào đang học. Khám phá ngay!
                  </div>
                )}
              </TabsContent>

              <TabsContent value='all' className='mt-0'>
                {enrollments && enrollments.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                    {enrollments.map((enroll: EnrollmentCourse) => (
                      <CourseCard key={enroll.id} enroll={enroll} />
                    ))}
                  </div>
                ) : (
                  <div className='py-20 text-center text-muted-foreground text-lg'>
                    Khám phá thêm nhiều kiến thức mới tại trang khóa học.
                  </div>
                )}
              </TabsContent>

              <TabsContent value='completed' className='mt-0'>
                {completedCourses.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                    {completedCourses.map((enroll: EnrollmentCourse) => (
                      <CourseCard key={enroll.id} enroll={enroll} />
                    ))}
                  </div>
                ) : (
                  <div className='py-20 text-center text-muted-foreground text-lg'>
                    Bạn chưa hoàn thành khóa học nào. Cố gắng lên nhé!
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* Discovery Box */}
        <div className='mt-20 group'>
          <Link
            href={PATH.COURSES}
            className='flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-all bg-muted/20'
          >
            <div className='w-16 h-16 rounded-full bg-background border border-border shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 group-hover:rotate-90'>
              <PlusCircle className='text-primary' size={32} strokeWidth={2.5} />
            </div>
            <h3 className='text-2xl font-bold text-foreground mb-2'>Khám phá khóa học mới</h3>
            <p className='text-muted-foreground text-[16px] font-medium'>Mở khóa tiềm năng của bạn ngay hôm nay</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

function CourseCard({ enroll }: { enroll: EnrollmentCourse }) {
  const { course } = enroll
  const imageUrl = course.thumbnail
    ? `${config.BE_URL}/media/${course.thumbnail}`
    : 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80'

  return (
    <div className='group bg-background rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md hover:border-primary/50 hover:-translate-y-1 transition-all duration-500 flex flex-col'>
      {/* Image and Badge */}
      <div className='relative aspect-[4/3] overflow-hidden shrink-0 bg-muted'>
        <Image
          src={imageUrl}
          alt={course.title}
          fill
          unoptimized
          className='object-cover transition-transform duration-1000 group-hover:scale-110'
        />
        <div className='absolute top-4 left-4'>
          <Badge className='bg-background/95 backdrop-blur-md shadow-sm text-foreground text-[11px] font-bold px-4 py-1.5 rounded-full border-none tracking-tight uppercase'>
            {course.category?.name || 'KHÓA HỌC'}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className='p-8 pt-6 flex flex-col h-full grow'>
        <h3 className='text-xl font-bold text-foreground leading-[1.3] line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors'>
          {course.title}
        </h3>

        {/* Progress Info */}
        <div className='mt-6 flex flex-col gap-6 grow justify-end'>
          <div className='flex items-center gap-4'>
            <div className='w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0'>
              <PlayCircle size={18} className='text-muted-foreground' />
            </div>
            <div className='min-w-0'>
              <span className='text-[11px] font-bold text-muted-foreground uppercase tracking-widest block mb-0.5'>
                Bài học:
              </span>
              <p className='text-sm font-bold text-foreground truncate'>
                {enroll.completedLessons} / {enroll.totalLessons}
              </p>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex items-center justify-between text-[11px] font-bold tracking-widest uppercase text-muted-foreground'>
              <span>Tiến độ</span>
              <span className='text-primary'>{enroll.progressPercent}%</span>
            </div>
            <div className='h-2 w-full bg-muted rounded-full overflow-hidden'>
              <div
                className='h-full bg-primary rounded-full transition-all duration-1000 ease-out'
                style={{ width: `${enroll.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cta */}
        <Button
          asChild
          className='mt-8 w-full h-[48px] rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground font-semibold text-[15px] gap-2 border-none shadow-none group/btn transition-all active:scale-[0.98] shrink-0'
        >
          <Link href={`/courses/${course.slug}`}>
            Tiếp tục học
            <ArrowRight size={18} className='transition-transform group-hover/btn:translate-x-1.5' />
          </Link>
        </Button>
      </div>
    </div>
  )
}
