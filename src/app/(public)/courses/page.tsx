import HeroBanner from '../_components/hero-banner'
import CourseSection from '../_components/course-section'
import CtaSection from '../_components/cta-section'
import homeApi from '../_api/home.api'
import { HomeSectionsResponse } from '@/schemas/course.schema'

export default async function HomePage() {
  const res = await homeApi.getHomeSections()
  const data = (await res.json()) as HomeSectionsResponse
  console.log(data)
  return (
    <main>
      <HeroBanner />

      <div className='max-w-[1200px] mx-auto px-6 pb-16'>
        <CourseSection
          title='Xu hướng hiện nay'
          subtitle='Những khóa học được quan tâm nhiều nhất cộng đồng'
          courses={data?.trending || []}
          viewAllHref='/courses?sort=popular'
          viewAllLabel='Xem tất cả'
        />

        <CourseSection
          title='Bán chạy nhất'
          subtitle='Đầu tư vào bản thân với 100.000+ học viên đã tin tưởng'
          courses={data?.topSelling || []}
          viewAllHref='/courses?sort=popular'
          viewAllLabel='Xem tất cả'
        />

        <CourseSection
          title='Khóa học mới nhất'
          subtitle='Cập nhật liên tục — kiến thức luôn mới mẻ'
          courses={data?.newest || []}
          viewAllHref='/courses?sort=newest'
          viewAllLabel='Xem tất cả'
        />

        <CourseSection
          title='Đánh giá cao nhất'
          subtitle='Được học viên đánh giá xuất sắc nhất nền tảng'
          courses={data?.topRated || []}
          viewAllHref='/courses?sort=rating'
          viewAllLabel='Xem tất cả'
        />

        <CtaSection />
      </div>
    </main>
  )
}
