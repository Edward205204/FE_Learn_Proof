'use client'

import React from 'react'
import { HomeCourseCard, CategoryWithCount } from '@/schemas/course.schema'
import CourseCard from '../../_components/course-card'
import { ChevronRight, Flame, Sparkles, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface CourseSectionProps {
  title: string
  subtitle?: string
  courses: HomeCourseCard[]
  icon?: React.ReactNode
  categorySlug?: string
}

function CourseSection({ title, subtitle, courses, icon, categorySlug }: CourseSectionProps) {
  if (courses.length === 0) return null

  return (
    <div className='mb-16 last:mb-0'>
      <div className='flex items-end justify-between mb-8'>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-2 text-primary'>
            {icon}
            <h2 className='text-2xl font-black tracking-tight text-foreground'>{title}</h2>
          </div>
          {subtitle && <p className='text-slate-500 text-sm font-medium'>{subtitle}</p>}
        </div>
        {categorySlug && (
          <Link
            href={`/courses?category=${categorySlug}`}
            className='flex items-center gap-1 text-sm font-bold text-primary hover:underline'
          >
            Xem tất cả
            <ChevronRight size={16} />
          </Link>
        )}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10'>
        {courses.slice(0, 4).map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}

interface ExploreSectionsProps {
  trendingCourses: HomeCourseCard[]
  newestCourses: HomeCourseCard[]
  topSellingCourses: HomeCourseCard[]
  categories: CategoryWithCount[]
}

export default function ExploreSections({
  trendingCourses,
  newestCourses,
  topSellingCourses,
  categories
}: ExploreSectionsProps) {
  return (
    <div className='w-full py-4'>
      <CourseSection
        title='Khóa học xu hướng'
        subtitle='Những khóa học được quan tâm nhất hiện nay'
        courses={trendingCourses}
        icon={<TrendingUp size={24} />}
      />

      <CourseSection
        title='Bán chạy nhất'
        subtitle='Lựa chọn hàng đầu từ cộng đồng học viên'
        courses={topSellingCourses}
        icon={<Flame size={24} className='text-orange-500' />}
      />

      <CourseSection
        title='Vừa ra mắt'
        subtitle='Luôn cập nhật những kiến thức mới nhất'
        courses={newestCourses}
        icon={<Sparkles size={24} className='text-blue-500' />}
      />

      {/* Dynamic Category Sections */}
      {categories
        .filter((c) => c._count.courses >= 3)
        .slice(0, 3)
        .map((cat) => (
          <CategoryCourseSection key={cat.id} category={cat} />
        ))}
    </div>
  )
}

// Sub-component to fetch and display courses for a category
import { useEffect, useState } from 'react'
import { courseApi } from '../../_api/course.api'

function CategoryCourseSection({ category }: { category: CategoryWithCount }) {
  const [courses, setCourses] = useState<HomeCourseCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    courseApi
      .getCourses({ category: category.slug })
      .then((res) => {
        setCourses(res.data.items || [])
      })
      .finally(() => setLoading(false))
  }, [category.slug])

  if (loading || courses.length === 0) return null

  return (
    <CourseSection
      title={category.name}
      subtitle={`Các khóa học chất lượng về ${category.name}`}
      courses={courses}
      categorySlug={category.slug}
    />
  )
}
