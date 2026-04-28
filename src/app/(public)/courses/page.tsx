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

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  // Next.js 15 yêu cầu await searchParams
  const params = await searchParams

  // Kiểm tra xem có đang dùng bộ lọc/tìm kiếm hay không
  const isLanding =
    !params.category && !params.level && !params.price && !params.rating && !params.search && !params.sort

  // Lấy danh sách category cho sidebar
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

  // Lấy danh sách khóa học theo filter (chỉ khi không ở landing hoặc vẫn cần meta)
  let courses: HomeCourseCard[] = []
  let meta: Meta | null = null
  try {
    const courseRes = await courseApi.getCourses(params)
    courses = courseRes.data.items || []
    meta = courseRes.data.meta
  } catch (error) {
    console.error('Failed to fetch courses:', error)
  }

  return (
    <main className='bg-white dark:bg-slate-950 min-h-screen pb-20'>
      <CourseSliderBanner trendingCourses={trendingCourses} newestCourses={newestCourses} />

      <ExploreLayout categories={categories}>
        <Suspense fallback={<CatalogContent courses={[]} isLoading={true} />}>
          {isLanding ? (
            <ExploreSections
              trendingCourses={trendingCourses}
              newestCourses={newestCourses}
              topSellingCourses={topSellingCourses}
              categories={categories}
            />
          ) : (
            <CatalogContent courses={courses} meta={meta} />
          )}
        </Suspense>
      </ExploreLayout>
    </main>
  )
}
