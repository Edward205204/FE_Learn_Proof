import HeroBanner from './_components/hero-banner'
import CourseSection from './_components/course-section'
import CtaSection from './_components/cta-section'
import {
  MOCK_TRENDING,
  MOCK_TOP_SELLING,
  MOCK_NEWEST,
  MOCK_TOP_RATED,
} from './_data/mock-courses'

export default function HomePage() {
  return (
    <main>
      <HeroBanner />

      <div className='max-w-[1200px] mx-auto px-6 pb-16'>
        <CourseSection
          title='Xu hướng hiện nay'
          subtitle='Những khóa học được quan tâm nhiều nhất cộng đồng'
          courses={MOCK_TRENDING}
          viewAllHref='/courses?sort=popular'
          viewAllLabel='Xem tất cả'
        />

        <CourseSection
          title='Bán chạy nhất'
          subtitle='Đầu tư vào bản thân với 100.000+ học viên đã tin tưởng'
          courses={MOCK_TOP_SELLING}
          viewAllHref='/courses?sort=popular'
          viewAllLabel='Xem tất cả'
        />

        <CourseSection
          title='Khóa học mới nhất'
          subtitle='Cập nhật liên tục — kiến thức luôn mới mẻ'
          courses={MOCK_NEWEST}
          viewAllHref='/courses?sort=newest'
          viewAllLabel='Xem tất cả'
        />

        <CourseSection
          title='Đánh giá cao nhất'
          subtitle='Được học viên đánh giá xuất sắc nhất nền tảng'
          courses={MOCK_TOP_RATED}
          viewAllHref='/courses?sort=rating'
          viewAllLabel='Xem tất cả'
        />

        <CtaSection />
      </div>
    </main>
  )
}
