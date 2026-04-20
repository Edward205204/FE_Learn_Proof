'use client'

import {
  Search,
  Bell,
  PlayCircle,
  PlusCircle,
  ArrowRight,
  ChevronRight,
  Loader2,
  BookOpen,
  CheckCircle2,
  Trophy,
  Clock
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { PATH } from '@/constants/path'
import { useGetMyEnrollmentsQuery } from '../../_hooks/use-enrollment'
import { useAuthStore } from '@/store/auth.store'
import type { EnrollmentCourse } from '../../_api/enrollment.api'
import { getCourseThumbnailUrl } from '@/utils/course'

export default function MyCoursesPage() {
  const { user } = useAuthStore()
  const { data: enrollments, isLoading } = useGetMyEnrollmentsQuery()

  const learningCourses = enrollments?.filter((e: EnrollmentCourse) => !e.completedAt) || []
  const completedCourses = enrollments?.filter((e: EnrollmentCourse) => e.completedAt) || []

  const displayFirstName = user?.fullName?.split(' ').pop() || 'bạn'

  return (
    <div className='min-h-screen bg-[#fafafa] dark:bg-background pb-20'>
      {/* Premium Header Banner */}
      <div className='relative overflow-hidden bg-white dark:bg-card border-b'>
        <div className='absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent' />
        <div className='absolute -right-20 -top-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl' />
        <div className='absolute right-40 -bottom-20 w-60 h-60 bg-primary/5 rounded-full blur-2xl' />

        <div className='max-w-[1240px] mx-auto px-6 pt-10 pb-16 relative z-10'>
          <nav className='flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-8'>
            <Link href='/' className='hover:text-primary transition-colors'>
              Trang chủ
            </Link>
            <ChevronRight size={12} className='text-muted-foreground/50' />
            <span className='text-primary'>Học tập</span>
          </nav>

          <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-10'>
            <div className='space-y-4'>
              <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20'>
                <Trophy size={14} />
                <span>Hành trình kiến thức</span>
              </div>
              <h1 className='text-4xl lg:text-5xl font-black tracking-tight text-foreground'>Khóa học của tôi</h1>
              <p className='text-muted-foreground text-lg lg:text-xl font-medium max-w-2xl leading-relaxed'>
                Chào {displayFirstName}, hôm nay là một ngày tuyệt vời để tiếp tục hành trình học tập và phát triển bản
                thân!
              </p>
            </div>

            <div className='flex items-center gap-4 w-full lg:w-auto'>
              <div className='relative flex-1 lg:w-[320px]'>
                <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground' size={18} />
                <input
                  className='w-full pl-12 h-14 bg-background dark:bg-muted/50 border border-input shadow-sm rounded-2xl text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium'
                  placeholder='Tìm khóa học của bạn...'
                />
              </div>
              <Button size='icon' variant='outline' className='h-14 w-14 rounded-2xl shrink-0 group'>
                <Bell size={22} className='group-hover:rotate-12 transition-transform' />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-[1240px] mx-auto px-6 -mt-10 relative z-20'>
        {/* Stats Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
          <StatCard
            icon={<BookOpen className='text-blue-500' size={24} />}
            label='Đang tham gia'
            value={learningCourses.length}
            description='Khóa học đang học'
          />
          <StatCard
            icon={<CheckCircle2 className='text-green-500' size={24} />}
            label='Đã hoàn thành'
            value={completedCourses.length}
            description='Chinh phục thành công'
          />
          <StatCard
            icon={<Clock className='text-orange-500' size={24} />}
            label='Tổng tích lũy'
            value={enrollments?.length || 0}
            description='Toàn bộ khoá học'
          />
        </div>

        {/* Content Section */}
        <Tabs defaultValue='learning' className='w-full'>
          <div className='flex items-center justify-between border-b mb-10'>
            <TabsList className='bg-transparent h-auto p-0 gap-8'>
              <TabsTrigger
                value='learning'
                className='text-[15px] font-bold px-0 py-4 data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground bg-transparent border-none shadow-none relative rounded-none transition-all data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary'
              >
                Đang học ({learningCourses.length})
              </TabsTrigger>
              <TabsTrigger
                value='completed'
                className='text-[15px] font-bold px-0 py-4 data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground bg-transparent border-none shadow-none relative rounded-none transition-all data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary'
              >
                Đã hoàn thành ({completedCourses.length})
              </TabsTrigger>
              <TabsTrigger
                value='all'
                className='text-[15px] font-bold px-0 py-4 data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground bg-transparent border-none shadow-none relative rounded-none transition-all data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary'
              >
                Tất cả ({enrollments?.length || 0})
              </TabsTrigger>
            </TabsList>
          </div>

          {isLoading ? (
            <div className='flex flex-col items-center justify-center py-32'>
              <Loader2 className='w-10 h-10 animate-spin text-primary mb-4' />
              <p className='text-muted-foreground font-medium'>Đang tải dữ liệu học tập...</p>
            </div>
          ) : (
            <div className='min-h-[40vh]'>
              <TabsContent value='learning' className='mt-0 focus-visible:outline-none'>
                {learningCourses.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {learningCourses.map((enroll: EnrollmentCourse) => (
                      <CourseCard key={enroll.id} enroll={enroll} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title='Chưa có khóa học đang học'
                    description='Bắt đầu ngay hôm nay để không bỏ lỡ những kiến thức giá trị nhất!'
                  />
                )}
              </TabsContent>

              <TabsContent value='completed' className='mt-0 focus-visible:outline-none'>
                {completedCourses.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {completedCourses.map((enroll: EnrollmentCourse) => (
                      <CourseCard key={enroll.id} enroll={enroll} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title='Bạn chưa hoàn thành khoá học nào'
                    description='Kiên trì học tập mỗi ngày để sớm đạt được mục tiêu của mình nhé!'
                  />
                )}
              </TabsContent>

              <TabsContent value='all' className='mt-0 focus-visible:outline-none'>
                {enrollments && enrollments.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {enrollments.map((enroll: EnrollmentCourse) => (
                      <CourseCard key={enroll.id} enroll={enroll} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title='Bạn chưa tham gia khoá học nào'
                    description='Đến trang khám phá để tìm kiếm những khóa học phù hợp nhất với bạn.'
                  />
                )}
              </TabsContent>
            </div>
          )}
        </Tabs>

        {/* Discovery Box */}
        <div className='mt-24 group'>
          <Link
            href={PATH.COURSES}
            className='relative flex flex-col items-center justify-center py-20 rounded-[2rem] border-2 border-dashed border-primary/20 hover:border-primary bg-white dark:bg-card hover:bg-primary/[0.02] transition-all duration-500 overflow-hidden'
          >
            <div className='absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity' />
            <div className='w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 rotate-3 group-hover:rotate-12 transition-all duration-500 group-hover:scale-110'>
              <PlusCircle className='text-primary' size={40} strokeWidth={2.5} />
            </div>
            <h3 className='text-3xl font-black text-foreground mb-3'>Khám phá khóa học mới</h3>
            <p className='text-muted-foreground text-lg font-medium'>Nâng tầm kỹ năng của bạn ngay bây giờ</p>
            <div className='mt-10 flex items-center gap-2 text-primary font-bold'>
              <span>Xem tất cả khoá học</span>
              <ArrowRight size={20} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  description
}: {
  icon: React.ReactNode
  label: string
  value: number
  description: string
}) {
  return (
    <div className='bg-white dark:bg-card p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4 hover:shadow-md transition-all group'>
      <div className='p-3 bg-muted dark:bg-muted/30 rounded-xl group-hover:scale-110 transition-transform'>{icon}</div>
      <div className='space-y-1'>
        <p className='text-[13px] font-bold text-muted-foreground uppercase tracking-wider'>{label}</p>
        <div className='flex items-baseline gap-2'>
          <span className='text-3xl font-black text-foreground'>{value}</span>
          <span className='text-sm text-muted-foreground font-medium'>{description}</span>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className='py-24 flex flex-col items-center text-center max-w-md mx-auto'>
      <div className='w-24 h-24 rounded-full bg-muted dark:bg-card border-2 border-dashed border-primary/20 flex items-center justify-center mb-8'>
        <BookOpen className='text-primary/40' size={40} />
      </div>
      <h3 className='text-2xl font-bold text-foreground mb-4'>{title}</h3>
      <p className='text-muted-foreground font-medium leading-relaxed mb-10'>{description}</p>
      <Button
        asChild
        className='rounded-xl px-8 h-12 h-14 text-base font-bold transition-all hover:scale-105 active:scale-95'
      >
        <Link href={PATH.COURSES}>Bắt đầu khám phá</Link>
      </Button>
    </div>
  )
}

function CourseCard({ enroll }: { enroll: EnrollmentCourse }) {
  const { course } = enroll
  const imageUrl = getCourseThumbnailUrl(course.thumbnail)

  return (
    <div className='group bg-white dark:bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 flex flex-col h-full'>
      {/* Image Section */}
      <div className='relative aspect-[16/9] overflow-hidden shrink-0'>
        <Image
          src={imageUrl}
          alt={course.title}
          fill
          unoptimized
          className='object-cover transition-transform duration-700 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
        <div className='absolute top-3 left-3'>
          <Badge className='bg-white/95 backdrop-blur shadow-sm text-foreground text-[10px] font-black px-3 py-1.5 rounded-lg border-none tracking-widest uppercase'>
            {course.category?.name || 'KHÓA HỌC'}
          </Badge>
        </div>
        {enroll.progressPercent === 100 && (
          <div className='absolute top-3 right-3'>
            <div className='w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg'>
              <CheckCircle2 size={18} />
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className='p-6 flex flex-col flex-1 gap-6'>
        <div className='space-y-2 flex-1'>
          <h3 className='text-lg font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors'>
            {course.title}
          </h3>
          <div className='flex items-center gap-2 text-xs text-muted-foreground font-medium'>
            <div className='flex flex-row items-center gap-1.5'>
              <div className='w-1.5 h-1.5 rounded-full bg-primary/40' />
              <span>Giảng viên: {course.creator.fullName}</span>
            </div>
          </div>
        </div>

        <div className='space-y-4 pt-2'>
          <div className='space-y-2.5'>
            <div className='flex items-center justify-between text-[11px] font-black tracking-widest uppercase'>
              <span className='text-muted-foreground'>Tiến độ học tập</span>
              <span className='text-primary'>{enroll.progressPercent}%</span>
            </div>
            <div className='h-1.5 w-full bg-muted dark:bg-muted/50 rounded-full overflow-hidden'>
              <div
                className='h-full bg-primary rounded-full transition-all duration-1000 ease-in-out relative overflow-hidden'
                style={{ width: `${enroll.progressPercent}%` }}
              >
                <div className='absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress-stripe_1s_linear_infinite]' />
              </div>
            </div>
            <p className='text-[10px] font-bold text-muted-foreground/80 uppercase tracking-tighter'>
              Đã học {enroll.completedLessons} trên {enroll.totalLessons} bài
            </p>
          </div>

          <Button
            asChild
            className='w-full h-11 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground font-bold text-sm border-none transition-all duration-300 drop-shadow-sm active:scale-95'
          >
            <Link href={`/courses/${course.slug}`}>
              <PlayCircle size={16} className='mr-2' />
              {enroll.progressPercent === 100 ? 'Xem lại khoá học' : 'Tiếp tục học tập'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
