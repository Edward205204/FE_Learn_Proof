'use client'

import { useEffect, useState } from 'react'
import { Edit2, Loader2, BookOpen } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import enrollmentApi, { EnrollmentCourse } from '@/app/(learner)/_api/enrollment.api'

export default function PublicProfilePage() {
  const { user } = useAuthStore()
  const [courses, setCourses] = useState<EnrollmentCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await enrollmentApi.getMyEnrollments()
        setCourses(res.data)
      } catch (error) {
        console.error('Failed to fetch enrollments:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEnrollments()
  }, [])

  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || 'U'
  }

  return (
    <div className='w-full bg-background min-h-screen'>
      {/* Banner Section */}
      <div className='bg-gradient-to-r from-primary/10 via-primary/5 to-transparent dark:from-muted/50 dark:to-transparent w-full h-[240px] relative border-b border-border'>
        <div className='max-w-6xl mx-auto h-full flex items-center px-6 md:px-0 relative'>
          <div className='space-y-3'>
            <h5 className='text-[12px] font-bold text-muted-foreground uppercase tracking-widest'>
              {user?.role || 'LEARNER'}
            </h5>
            <h1 className='text-4xl md:text-5xl font-bold text-foreground tracking-tight'>
              {user?.fullName || 'Người dùng'}
            </h1>
          </div>

          {/* Right Floating Card (Avatar & Edit Button) */}
          <div className='hidden md:flex absolute right-6 lg:right-0 top-16 w-[300px] bg-background shadow-sm border border-border rounded-2xl p-8 flex-col items-center gap-6 z-10 transition-shadow hover:shadow-md'>
            <Avatar className='w-[140px] h-[140px] bg-primary/10 text-primary border-4 border-background shadow-sm text-5xl font-bold flex items-center justify-center'>
              <AvatarImage src={user?.avatar || ''} alt={user?.fullName} className='object-cover' />
              <AvatarFallback className='bg-primary text-primary-foreground select-none'>
                {getInitials(user?.fullName || '')}
              </AvatarFallback>
            </Avatar>
            <Link href='/profile' className='w-full'>
              <Button className='w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-none font-bold rounded-xl h-12 text-[15px] flex items-center justify-center gap-2 shadow-none transition-all active:scale-[0.98]'>
                <Edit2 size={16} />
                Chỉnh sửa hồ sơ
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='max-w-6xl mx-auto px-6 md:px-0 py-12 md:py-20'>
        {/* Mobile Info (shows only on small screens) */}
        <div className='md:hidden flex flex-col items-center mb-12 space-y-6'>
          <Avatar className='w-28 h-28 bg-primary text-primary-foreground border-4 border-background shadow-sm text-4xl font-bold'>
            <AvatarImage src={user?.avatar || ''} alt={user?.fullName} />
            <AvatarFallback className='bg-primary text-primary-foreground'>
              {getInitials(user?.fullName || '')}
            </AvatarFallback>
          </Avatar>
          <Link href='/profile' className='w-full max-w-[280px]'>
            <Button className='w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-none font-bold rounded-xl h-12 text-[15px] shadow-none flex items-center gap-2 transition-all'>
              <Edit2 size={16} />
              Chỉnh sửa hồ sơ
            </Button>
          </Link>
        </div>

        {/* Dashboard Content */}
        <div className='w-full md:w-2/3'>
          <h2 className='text-2xl font-bold text-foreground mb-8 tracking-tight'>Khóa học đã mua</h2>

          {isLoading ? (
            <div className='flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground'>
              <Loader2 className='animate-spin' size={32} />
              <p>Đang tải danh sách khóa học...</p>
            </div>
          ) : courses.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8'>
              {courses.map((item) => (
                <Link
                  key={item.id}
                  href={`/courses/${item.course.slug}`}
                  className='group bg-background rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer'
                >
                  <div className='w-full aspect-[4/3] relative overflow-hidden bg-muted'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.course.thumbnail || '/placeholder-course.png'}
                      alt={item.course.title}
                      className='object-cover w-full h-full group-hover:scale-110 transition-transform duration-700'
                    />
                    <div className='absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors'></div>
                  </div>
                  <div className='p-6 pt-5 flex flex-col flex-1'>
                    <h3 className='font-bold text-[16px] text-foreground leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors'>
                      {item.course.title}
                    </h3>
                    <p className='text-[13px] font-medium text-muted-foreground flex-1'>
                      {item.course.creator.fullName}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-20 gap-6 bg-muted/30 rounded-3xl border-2 border-dashed border-muted'>
              <div className='w-16 h-16 bg-background rounded-full flex items-center justify-center shadow-sm'>
                <BookOpen className='text-muted-foreground' size={28} />
              </div>
              <div className='text-center space-y-2'>
                <p className='font-bold text-foreground'>Bạn chưa mua khóa học nào</p>
                <p className='text-sm text-muted-foreground px-10'>
                  Khám phá hàng ngàn khóa học hấp dẫn để bắt đầu hành trình học tập của bạn ngay hôm nay.
                </p>
              </div>
              <Link href='/courses'>
                <Button className='rounded-xl px-8 font-bold'>Khám phá ngay</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
