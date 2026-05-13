import Link from 'next/link'
import { Star, Users } from 'lucide-react'
import type { HomeCourseCard } from '@/schemas/course.schema'
import Image from 'next/image'
import { getCourseThumbnailUrl } from '@/utils/course'

const LEVEL_LABEL: Record<string, string> = {
  BEGINNER: 'Cơ bản',
  INTERMEDIATE: 'Trung cấp',
  ADVANCED: 'Nâng cao'
}

const LEVEL_CLASS: Record<string, string> = {
  BEGINNER: 'bg-emerald-500',
  INTERMEDIATE: 'bg-blue-500',
  ADVANCED: 'bg-primary'
}

interface CourseCardProps {
  course: HomeCourseCard
}

export default function CourseCard({ course }: CourseCardProps) {
  const rating = course.avgRating
  const totalReviews = course.totalReviews
  const displayPrice = course.isFree ? 'Miễn phí' : course.price.toLocaleString('vi-VN') + ' ₫'
  const hasDiscount = !course.isFree && course.originalPrice && course.originalPrice > course.price

  return (
    <Link
      href={`/courses/${course.slug}`}
      className='group flex flex-col rounded-lg border border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden'
      aria-label={`Xem khóa học: ${course.title}`}
    >
      {/* Thumbnail */}
      <div className='relative aspect-video overflow-hidden bg-muted flex-shrink-0'>
        <Image
          fill
          unoptimized
          src={getCourseThumbnailUrl(course.thumbnail)}
          alt={course.title}
          className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
        />
        <span
          className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[0.65rem] font-bold text-white uppercase tracking-wide ${LEVEL_CLASS[course.level]}`}
        >
          {LEVEL_LABEL[course.level]}
        </span>
        {course.isEnrolled && (
          <span className='absolute top-2 right-2 px-2 py-0.5 rounded text-[0.65rem] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase tracking-wide shadow-sm'>
            Đã sở hữu
          </span>
        )}
      </div>

      {/* Body */}
      <div className='flex flex-col gap-1 p-3.5 flex-1'>
        <p className='text-[0.7rem] font-semibold text-primary uppercase tracking-wider'>{course.category.name}</p>
        <h3 className='text-sm font-bold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors'>
          {course.title}
        </h3>
        <p className='text-xs text-muted-foreground'>{course.creator.fullName}</p>

        {/* Meta */}
        <div className='flex items-center justify-between mt-auto pt-3 border-t border-slate-50 dark:border-slate-800/50'>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-400/10 text-amber-500'>
              <Star size={10} fill='currentColor' strokeWidth={0} />
              <span className='text-[10px] font-black'>{rating > 0 ? rating.toFixed(1) : '0.0'}</span>
            </div>
            {totalReviews > 0 && (
              <span className='text-[10px] font-bold text-slate-400'>({totalReviews.toLocaleString('vi-VN')})</span>
            )}
          </div>

          <div className='flex items-center gap-1.5'>
            <span className={`text-sm font-extrabold ${course.isFree ? 'text-emerald-600' : 'text-foreground'}`}>
              {displayPrice}
            </span>
            {hasDiscount && (
              <span className='text-xs text-muted-foreground line-through'>
                {course.originalPrice!.toLocaleString('vi-VN')} ₫
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
