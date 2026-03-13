import Link from 'next/link'
import { Star, Users } from 'lucide-react'
import type { HomeCourseCard } from '@/schemas/course.schema'

const LEVEL_LABEL: Record<string, string> = {
  BEGINNER: 'Cơ bản',
  INTERMEDIATE: 'Trung cấp',
  ADVANCED: 'Nâng cao',
}

const LEVEL_CLASS: Record<string, string> = {
  BEGINNER: 'bg-emerald-500',
  INTERMEDIATE: 'bg-blue-500',
  ADVANCED: 'bg-primary',
}

interface CourseCardProps {
  course: HomeCourseCard
}

export default function CourseCard({ course }: CourseCardProps) {
  const rating = course.overallAnalytics?.avgRating ?? 0
  const totalStudents = course.overallAnalytics?.totalStudents ?? 0
  const displayPrice = course.isFree ? 'Miễn phí' : `$${course.price.toFixed(2)}`
  const hasDiscount = !course.isFree && course.originalPrice && course.originalPrice > course.price

  return (
    <Link
      href={`/courses/${course.slug}`}
      className='group flex flex-col rounded-lg border border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden'
      aria-label={`Xem khóa học: ${course.title}`}
    >
      {/* Thumbnail */}
      <div className='relative aspect-video overflow-hidden bg-muted flex-shrink-0'>
        {course.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.thumbnail}
            alt={course.title}
            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
          />
        ) : (
          <div className='absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20' />
        )}
        <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[0.65rem] font-bold text-white uppercase tracking-wide ${LEVEL_CLASS[course.level]}`}>
          {LEVEL_LABEL[course.level]}
        </span>
      </div>

      {/* Body */}
      <div className='flex flex-col gap-1 p-3.5 flex-1'>
        <p className='text-[0.7rem] font-semibold text-primary uppercase tracking-wider'>
          {course.category.name}
        </p>
        <h3 className='text-sm font-bold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors'>
          {course.title}
        </h3>
        <p className='text-xs text-muted-foreground'>{course.creator.fullName}</p>

        {/* Meta */}
        <div className='flex items-center justify-between mt-auto pt-2'>
          <div className='flex items-center gap-1.5'>
            <Star size={12} className='fill-amber-400 text-amber-400' />
            <span className='text-xs font-bold text-amber-500'>
              {rating > 0 ? rating.toFixed(1) : '—'}
            </span>
            {totalStudents > 0 && (
              <span className='flex items-center gap-0.5 text-[0.68rem] text-muted-foreground ml-1'>
                <Users size={11} />
                {totalStudents.toLocaleString('vi-VN')}
              </span>
            )}
          </div>

          <div className='flex items-center gap-1.5'>
            <span className={`text-sm font-extrabold ${course.isFree ? 'text-emerald-600' : 'text-foreground'}`}>
              {displayPrice}
            </span>
            {hasDiscount && (
              <span className='text-xs text-muted-foreground line-through'>
                ${course.originalPrice!.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
