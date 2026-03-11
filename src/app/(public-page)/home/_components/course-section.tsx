import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { HomeCourseCard } from '@/schemas/course.schema'
import CourseCard from './course-card'

interface CourseSectionProps {
  title: string
  subtitle?: string
  courses: HomeCourseCard[]
  viewAllHref?: string
  viewAllLabel?: string
}

export default function CourseSection({
  title,
  subtitle,
  courses,
  viewAllHref = '/courses',
  viewAllLabel = 'Xem tất cả',
}: CourseSectionProps) {
  if (!courses || courses.length === 0) return null

  return (
    <section className='py-10'>
      {/* Header */}
      <div className='flex items-end justify-between mb-6 gap-4'>
        <div>
          <h2 className='text-2xl font-extrabold tracking-tight text-foreground'>{title}</h2>
          {subtitle && (
            <p className='text-sm text-muted-foreground mt-1'>{subtitle}</p>
          )}
        </div>
        <Link
          href={viewAllHref}
          className='group flex items-center gap-1 text-sm font-bold text-primary whitespace-nowrap hover:opacity-80 transition-opacity'
        >
          {viewAllLabel}
          <ArrowRight size={15} className='transition-transform group-hover:translate-x-0.5' />
        </Link>
      </div>

      {/* Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  )
}
