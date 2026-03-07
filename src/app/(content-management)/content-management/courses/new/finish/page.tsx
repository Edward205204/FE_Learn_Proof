'use client'

import Link from 'next/link'
import { Check, LayoutGrid, PlusCircle, Video, FileQuestion, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PATH } from '@/constants/path'

interface QuickActionLinkProps {
  icon: React.ReactNode
  label: string
  href: string
}

function QuickActionLink({ icon, label, href }: QuickActionLinkProps) {
  return (
    <Link href={href} className='flex flex-col items-center gap-3 group transition-all'>
      <div className='h-14 w-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground shadow-sm'>
        {icon}
      </div>
      <span className='text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors'>
        {label}
      </span>
    </Link>
  )
}

export default function CourseFinishPage() {
  return (
    <div className='min-h-screen bg-background flex flex-col items-center justify-center p-4'>
      <div className='absolute top-6 left-8 flex items-center gap-2'>
        <div className='bg-primary p-1.5 rounded-md'>
          <LayoutGrid className='w-5 h-5 text-primary-foreground' />
        </div>
      </div>

      <Card className='w-full max-w-[640px] p-12 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-500'>
        <div className='relative'>
          <div className='absolute inset-0 bg-green-500/20 blur-2xl rounded-full' />
          <div className='relative h-20 w-20 rounded-full bg-green-100 flex items-center justify-center border-4 border-background shadow-sm'>
            <Check className='w-10 h-10 text-green-600 stroke-[3px]' />
          </div>
        </div>

        <div className='space-y-3'>
          <h1 className='text-4xl font-extrabold tracking-tight'>Tạo khóa học thành công!</h1>
          <p className='text-muted-foreground text-lg max-w-[480px] mx-auto leading-relaxed'>
            Khóa học của bạn đã được tạo. Bạn có thể bắt đầu thêm bài học, chương học và quản lý học viên đăng ký.
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 w-full justify-center pt-4'>
          <Button
            asChild
            size='lg'
            className='h-14 px-8 rounded-full font-bold text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]'
          >
            <Link href={PATH.CONTENT_MANAGEMENT}>
              <LayoutGrid className='w-5 h-5 mr-2' />
              Quản lý khóa học
            </Link>
          </Button>

          <Button
            asChild
            variant='secondary'
            size='lg'
            className='h-14 px-8 rounded-full font-bold text-base'
          >
            <Link href={PATH.COURSE_NEW_STEP1}>
              <PlusCircle className='w-5 h-5 mr-2' />
              Tạo khóa học khác
            </Link>
          </Button>
        </div>

        <div className='w-full pt-8 border-t border-border/50'>
          <p className='text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6'>
            Thao tác nhanh cho khóa học mới
          </p>
          <div className='grid grid-cols-3 gap-8'>
            <QuickActionLink icon={<Video className='w-6 h-6' />} label='Thêm bài học' href='#' />
            <QuickActionLink icon={<FileQuestion className='w-6 h-6' />} label='Tạo bài kiểm tra' href={PATH.QUIZ_LESSON} />
            <QuickActionLink icon={<Settings className='w-6 h-6' />} label='Cài đặt' href={PATH.CONTENT_MANAGEMENT} />
          </div>
        </div>
      </Card>
    </div>
  )
}
