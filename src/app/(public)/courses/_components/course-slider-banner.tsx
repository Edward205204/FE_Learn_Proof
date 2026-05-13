'use client'

import * as React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Users, ArrowRight, Flame, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HomeCourseCard } from '@/schemas/course.schema'
import { getCourseThumbnailUrl } from '@/utils/course'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

interface CourseSliderBannerProps {
  trendingCourses: HomeCourseCard[]
  newestCourses: HomeCourseCard[]
}

export default function CourseSliderBanner({ trendingCourses, newestCourses }: CourseSliderBannerProps) {
  // Combine and deduplicate
  const allSlides = React.useMemo(() => {
    const combined = [...trendingCourses, ...newestCourses]
    const seen = new Set()
    return combined
      .filter((c) => {
        if (seen.has(c.id)) return false
        seen.add(c.id)
        return true
      })
      .slice(0, 8) // Limit to 8 slides
  }, [trendingCourses, newestCourses])

  if (allSlides.length === 0) return null

  return (
    <section className='relative group'>
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect='fade'
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true
        }}
        navigation={true}
        className='h-[450px] md:h-[550px] w-full'
      >
        {allSlides.map((course, index) => {
          const isNew = newestCourses.some((c) => c.id === course.id)
          const isTrending = trendingCourses.some((c) => c.id === course.id)
          const imageUrl = getCourseThumbnailUrl(course.thumbnail)

          return (
            <SwiperSlide key={course.id}>
              <div className='relative w-full h-full overflow-hidden'>
                {/* Background Image with Overlay */}
                <Image
                  src={imageUrl}
                  alt={course.title}
                  fill
                  className='object-cover'
                  priority={index === 0}
                  unoptimized
                />
                <div className='absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent' />
                <div className='absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent' />

                {/* Content Area */}
                <div className='relative h-full max-w-[1400px] mx-auto px-6 flex flex-col justify-center gap-6 z-10'>
                  <div className='flex gap-3'>
                    {isTrending && (
                      <div className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-black uppercase tracking-widest backdrop-blur-md'>
                        <Flame size={12} fill='currentColor' />
                        <span>Phổ biến</span>
                      </div>
                    )}
                    {isNew && (
                      <div className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-black uppercase tracking-widest backdrop-blur-md'>
                        <Sparkles size={12} fill='currentColor' />
                        <span>Mới nhất</span>
                      </div>
                    )}
                  </div>

                  <h2 className='text-3xl md:text-5xl lg:text-6xl font-black text-white max-w-[20ch] leading-[1.1] tracking-tight drop-shadow-2xl'>
                    {course.title}
                  </h2>

                  <p className='text-slate-300 text-sm md:text-lg max-w-[50ch] line-clamp-2 font-medium leading-relaxed opacity-90'>
                    {course.shortDesc}
                  </p>

                  <div className='flex items-center gap-8 py-2'>
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-1.5 text-amber-400'>
                        <Star size={18} fill='currentColor' strokeWidth={0} />
                        <span className='text-xl font-black tracking-tight'>
                          {course.overallAnalytics?.avgRating.toFixed(1) || '0.0'}
                        </span>
                      </div>
                      <span className='text-[10px] text-slate-400 font-bold uppercase tracking-widest'>Đánh giá</span>
                    </div>

                    <div className='w-px h-10 bg-white/10' />

                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-1.5 text-slate-100'>
                        <Users size={18} className='text-primary' />
                        <span className='text-xl font-black tracking-tight'>
                          {course.overallAnalytics?.totalStudents.toLocaleString() || '0'}
                        </span>
                      </div>
                      <span className='text-[10px] text-slate-400 font-bold uppercase tracking-widest'>Học viên</span>
                    </div>
                  </div>

                  <div className='flex gap-4 mt-4'>
                    <Button asChild size='lg' className='h-14 px-8 rounded-2xl font-bold text-base group'>
                      <Link href={`/courses/${course.slug}`}>
                        Bắt đầu ngay
                        <ArrowRight className='ml-2 group-hover:translate-x-1 transition-transform' size={18} />
                      </Link>
                    </Button>
                    <Link
                      href={`/courses/${course.slug}`}
                      className='flex items-center justify-center h-14 px-8 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-base border border-white/10 backdrop-blur-md transition-all'
                    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white !important;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          width: 50px !important;
          height: 50px !important;
          border-radius: 100%;
          border: 1px solid rgba(255, 255, 255, 0.1);
          opacity: 0;
          transition: all 0.3s ease;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px !important;
          font-weight: bold;
        }
        .group:hover .swiper-button-next,
        .group:hover .swiper-button-prev {
          opacity: 1;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: var(--primary);
          border-color: var(--primary);
        }
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.5;
          width: 10px;
          height: 10px;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          width: 30px;
          border-radius: 5px;
          background: var(--primary) !important;
        }
      `}</style>
    </section>
  )
}
