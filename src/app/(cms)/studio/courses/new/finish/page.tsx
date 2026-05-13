'use client'

import Link from 'next/link'
import { Check, LayoutGrid, PlusCircle, Video, FileQuestion, Settings, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PATH } from '@/constants/path'

interface QuickActionLinkProps {
  icon: React.ReactNode
  label: string
  href: string
}

function QuickActionLink({ icon, label, href }: QuickActionLinkProps) {
  return (
    <Link
      href={href}
      className='group flex flex-col items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:bg-muted'
    >
      <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-background text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground'>
        {icon}
      </div>
      <span className='text-center text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground'>
        {label}
      </span>
    </Link>
  )
}

export default function CourseFinishPage() {
  return (
    <div className='w-full bg-background px-4 py-6 md:px-6 md:py-8'>
      <div className='mx-auto flex w-full max-w-4xl flex-col gap-6 animate-in fade-in duration-500'>
        <section className='rounded-2xl border border-border bg-card p-6 md:p-8'>
          <div className='flex flex-col gap-5 md:flex-row md:items-start md:justify-between'>
            <div className='flex items-start gap-4'>
              <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                <Check className='h-7 w-7 stroke-[3px]' />
              </div>
              <div className='space-y-1.5'>
                <p className='text-sm font-semibold text-primary'>Hoàn tất thiết lập</p>
                <h1 className='text-2xl font-extrabold tracking-tight md:text-3xl'>Tạo khóa học thành công!</h1>
                <p className='max-w-[620px] text-sm leading-relaxed text-muted-foreground md:text-base'>
                  Khóa học của bạn đã được tạo và lưu trữ an toàn. Bạn có thể bắt đầu thêm nội dung, bài kiểm tra hoặc
                  tùy chỉnh thông tin để chuẩn bị xuất bản.
                </p>
              </div>
            </div>

            <div className='rounded-lg border border-border bg-muted px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
              Trạng thái: Bản nháp
            </div>
          </div>

          <div className='mt-5 flex items-start gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground'>
            <AlertCircle className='mt-0.5 h-5 w-5 shrink-0 text-primary' strokeWidth={2.5} />
            <p className='leading-relaxed'>
              Khóa học hiện đang ở trạng thái <strong>Bản nháp</strong>. Hệ thống yêu cầu mỗi khóa học phải có ít nhất
              10 bài học trước khi có thể xuất bản cho học viên đăng ký.
            </p>
          </div>
        </section>

        <section className='flex flex-col gap-4 sm:flex-row'>
          <Button asChild size='lg' className='h-12 px-6 font-semibold'>
            <Link href={PATH.STUDIO_COURSES}>
              <LayoutGrid className='mr-2 h-4 w-4' />
              Quản lý khóa học
            </Link>
          </Button>

          <Button asChild variant='secondary' size='lg' className='h-12 px-6 font-semibold'>
            <Link href={PATH.COURSE_NEW_STEP1}>
              <PlusCircle className='mr-2 h-4 w-4' />
              Tạo khóa học khác
            </Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
