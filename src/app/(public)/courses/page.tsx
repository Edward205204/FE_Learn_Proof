import { Suspense } from 'react'
import homeApi from '../_api/home.api'
import { courseApi, Meta } from '../_api/course.api'
import ExploreLayout from './_components/explore-layout'
import CatalogContent from './_components/catalog-content'
import CourseSliderBanner from './_components/course-slider-banner'
import ExploreSections from './_components/explore-sections'
import { HomeCourseCard, CategoryWithCount, HomeSectionsResponse } from '@/schemas/course.schema'

interface CoursesPageProps {
  searchParams: Promise<{
    category?: string
    level?: string
    price?: string
    rating?: string
    search?: string
    sort?: string
    page?: string
  }>
}

export default async function CoursesPage() {
  // Lấy danh sách category
  let categories: CategoryWithCount[] = []
  try {
    const catRes = await homeApi.getCategories()
    categories = catRes.data || []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }

  // Lấy dữ liệu cho banner và sections
  let trendingCourses: HomeCourseCard[] = []
  let newestCourses: HomeCourseCard[] = []
  let topSellingCourses: HomeCourseCard[] = []
  try {
    const sectionRes = await homeApi.getHomeSections()
    if (sectionRes.ok) {
      const homeSections: HomeSectionsResponse = await sectionRes.json()
      trendingCourses = homeSections.trending || []
      newestCourses = homeSections.newest || []
      topSellingCourses = homeSections.topSelling || []
    }
  } catch (error) {
    console.error('Failed to fetch home sections:', error)
  }

  return (
    <main className='bg-white dark:bg-slate-950 min-h-screen pb-20'>
      <CourseSliderBanner trendingCourses={trendingCourses} newestCourses={newestCourses} />

      <div className='max-w-[1400px] mx-auto px-6 py-8'>
        <ExploreSections
          trendingCourses={trendingCourses}
          newestCourses={newestCourses}
          topSellingCourses={topSellingCourses}
          categories={categories}
        />
      </div>
    </main>
  )
}
