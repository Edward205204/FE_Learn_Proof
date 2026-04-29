import { Suspense } from 'react'
import homeApi from '../_api/home.api'
import { courseApi, Meta } from '../_api/course.api'
import ExploreLayout from '../courses/_components/explore-layout'
import CatalogContent from '../courses/_components/catalog-content'
import ExploreSections from '../courses/_components/explore-sections'
import { HomeCourseCard, CategoryWithCount, HomeSectionsResponse } from '@/schemas/course.schema'

export const metadata = {
  title: 'Tìm kiếm khóa học | Learn Proof'
}

interface SearchPageProps {
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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  // Lấy danh sách category cho sidebar
  let categories: CategoryWithCount[] = []
  try {
    const catRes = await homeApi.getCategories()
    categories = catRes.data || []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }

  // Lấy danh sách khóa học theo filter
  let courses: HomeCourseCard[] = []
  let meta: Meta | null = null
  try {
    const courseRes = await courseApi.getCourses(params)
    courses = courseRes.data.items || []
    meta = courseRes.data.meta
  } catch (error) {
    console.error('Failed to fetch courses:', error)
  }

  // Nếu không có khóa học nào, lấy các khóa học phổ biến để gợi ý
  let trendingCourses: HomeCourseCard[] = []
  let newestCourses: HomeCourseCard[] = []
  let topSellingCourses: HomeCourseCard[] = []

  if (courses.length === 0) {
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
  }

  return (
    <main className='bg-white dark:bg-slate-950 min-h-screen pb-20 pt-8'>
      <div className='max-w-[1400px] mx-auto px-6 mb-4'>
        <h1 className='text-2xl font-bold text-slate-800 dark:text-slate-100'>
          Kết quả tìm kiếm cho:{' '}
          <span className='text-primary'>&quot;{params.search || params.category || 'Tất cả'}&quot;</span>
        </h1>
        <p className='text-sm text-slate-500 mt-1'>Tìm thấy {meta?.total || 0} khóa học phù hợp.</p>
      </div>

      <ExploreLayout categories={categories}>
        <Suspense fallback={<CatalogContent courses={[]} isLoading={true} />}>
          <CatalogContent courses={courses} meta={meta} />

          {courses.length === 0 && (
            <div className='mt-8'>
              <div className='mb-8 text-center'>
                <h3 className='text-xl font-bold text-slate-800 dark:text-slate-100'>
                  Bạn có thể quan tâm đến các khóa học sau
                </h3>
                <p className='text-slate-500'>Khám phá những khóa học nổi bật nhất từ cộng đồng Learn Proof</p>
              </div>
              <ExploreSections
                trendingCourses={trendingCourses}
                newestCourses={newestCourses}
                topSellingCourses={topSellingCourses}
                categories={categories}
              />
            </div>
          )}
        </Suspense>
      </ExploreLayout>
    </main>
  )
}
