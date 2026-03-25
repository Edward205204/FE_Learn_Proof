'use client'

import {
  ChevronRight, Star, Play, Check, Layers, Download, Award, Infinity,
  ChevronDown, PlayCircle, FileText, ShieldCheck, Zap, ShoppingCart, Heart, Loader2
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { PATH } from '@/constants/path'
import { useAddToCartMutation } from '@/app/(learner)/cart/_hooks/use-cart'
import { useCourseDetailQuery } from '../_hooks/use-course'
import { useWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/app/(learner)/wishlist/_hooks/use-wishlist'
import type { WishlistItem } from '@/app/(learner)/wishlist/_api/wishlist.api'

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseSlug = params?.id as string

  const { data: courseData, isLoading, isError } = useCourseDetailQuery(courseSlug)
  const { data: wishlistData } = useWishlistQuery()

  const addMutation = useAddToCartMutation()
  const addToWishlistMutation = useAddToWishlistMutation()
  const removeFromWishlistMutation = useRemoveFromWishlistMutation()

  const [expandedChapters, setExpandedChapters] = useState<string[]>([])

  const isWishlisted = useMemo(
    () => (wishlistData as WishlistItem[] | undefined)?.some((item) => item.courseId === courseData?.id) || false,
    [wishlistData, courseData?.id]
  )

  const toggleWishlist = () => {
    if (!courseData) return
    if (isWishlisted) {
      removeFromWishlistMutation.mutate(courseData.id)
    } else {
      addToWishlistMutation.mutate(courseData.id)
    }
  }

  const courseIdOrSlug = courseData?.id || courseSlug

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[oklch(0.985_0_0)] dark:bg-transparent flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-rose-500 border-t-transparent animate-spin"></div>
      </div>
    )
  }

  if (isError || !courseData) {
    return (
      <div className="min-h-screen bg-[oklch(0.985_0_0)] dark:bg-transparent flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Không tìm thấy khóa học</h1>
        <Link href="/courses" className="text-rose-600 hover:underline mt-4">Quay lại danh sách</Link>
      </div>
    )
  }

  const toggleChapter = (id: string) => {
    setExpandedChapters(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const formatDuration = (seconds?: number | null) => {
    if (!seconds) return '00:00'
    const mins = Math.floor(seconds / 60)
    return `${mins < 10 ? '0' : ''}${mins}:${seconds % 60 < 10 ? '0' : ''}${seconds % 60}`
  }

  return (
    <div className="min-h-screen bg-[oklch(0.985_0_0)] dark:bg-transparent pb-20 pt-10">
      {/* Header / Hero */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-[1240px] mx-auto px-6 py-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.1em] text-slate-400 uppercase mb-8">
            <Link href="/" className="hover:text-rose-500 transition-colors">Trang chủ</Link>
            <ChevronRight size={10} strokeWidth={3} />
            <Link href="/courses" className="hover:text-rose-500 transition-colors">Khóa học</Link>
            <ChevronRight size={10} strokeWidth={3} />
            <span className="text-rose-500">{courseData.title}</span>
          </div>

          <div className="max-w-[800px] space-y-6">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              Làm chủ <span className="text-rose-600">Ethereum</span> & <br />Hợp đồng thông minh
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
              {courseData.shortDesc}
            </p>

            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-slate-200 shadow-sm">
                  <AvatarImage src={courseData.creator.avatar || undefined} />
                  <AvatarFallback>{courseData.creator.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">
                    {courseData.creator.fullName}
                  </p>
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                    Giảng viên
                  </p>
                </div>
              </div>

              {courseData.overallAnalytics && (
                <div className="flex items-center gap-2">
                   <div className="flex items-center gap-1 bg-amber-400/10 text-amber-500 px-2 py-1 rounded-lg">
                      <Star size={16} fill="currentColor" strokeWidth={0} />
                      <span className="text-sm font-black">{courseData.overallAnalytics.avgRating.toFixed(1)}</span>
                   </div>
                   <span className="text-xs text-slate-400 font-bold">({courseData.overallAnalytics.totalStudents.toLocaleString()} học viên)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-[1240px] mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-12">
          {/* Description Section */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center">
                  <Zap size={16} className="text-rose-600" />
               </div>
               <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
                 Mô tả khóa học
               </h2>
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-medium leading-[1.8] whitespace-pre-line">
              {courseData.fullDesc}
            </div>
          </section>

          {/* Curriculum Section */}
          <section>
            <div className="flex items-center gap-3 mb-8">
               <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center">
                  <Layers size={16} className="text-rose-600" />
               </div>
               <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
                 Lộ trình học tập
               </h2>
            </div>
            
            <div className="space-y-4">
              {courseData.chapters.map((chapter) => (
                <div key={chapter.id} className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 transition-all shadow-sm">
                  <button 
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full flex items-center justify-between p-7 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {chapter.title}
                    </span>
                    <ChevronDown size={20} className={cn("text-slate-400 transition-transform duration-300", expandedChapters.includes(chapter.id) && "rotate-180")} />
                  </button>
                  
                  {expandedChapters.includes(chapter.id) && (
                    <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-2">
                        {chapter.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/50 dark:bg-white/5 hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group">
                            <div className="flex items-center gap-4">
                               <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center shrink-0">
                                 {lesson.type === 'VIDEO' ? (
                                   <Play size={14} className="text-rose-600 fill-rose-600" />
                                 ) : lesson.type === 'QUIZ' ? (
                                   <Zap size={14} className="text-amber-500 fill-amber-500" />
                                 ) : (
                                   <FileText size={14} className="text-blue-500" />
                                 )}
                               </div>
                               <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-rose-600 transition-colors">
                                 {lesson.title}
                               </span>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 tracking-tighter tabular-nums">
                              {formatDuration(lesson.duration)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Reviews Section */}
          {courseData.reviews && courseData.reviews.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center">
                    <Star size={16} className="text-rose-600" />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Đánh giá từ học viên
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {courseData.reviews.map((review) => (
                  <div key={review.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.user.avatar || undefined} />
                        <AvatarFallback>{review.user.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">
                          {review.user.fullName}
                        </p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={10} fill={s <= review.rating ? "currentColor" : "none"} strokeWidth={s <= review.rating ? 0 : 1} className={s <= review.rating ? "text-amber-400" : "text-slate-300"} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className='text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic'>
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="relative">
          <div className="space-y-6">
            {/* Preview Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 group">
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                {courseData.thumbnail ? (
                  <Image 
                    src={courseData.thumbnail} 
                    alt={courseData.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    Chưa có ảnh đại diện
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                   <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                      <Play size={24} fill="currentColor" className="ml-1" />
                   </div>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-[10px] font-black text-white px-4 py-1.5 rounded-full uppercase tracking-widest whitespace-nowrap">
                   Xem trước khóa học
                </div>
              </div>

              <div className="p-8 pt-6">
                <div className="flex items-baseline gap-3 mb-6">
                   <span className="text-3xl font-black text-slate-900 dark:text-white">
                     {courseData.isFree ? 'Miễn phí' : `${courseData.price.toLocaleString('vi-VN')} đ`}
                   </span>
                   {courseData.originalPrice && courseData.originalPrice > courseData.price && (
                     <>
                       <span className="text-lg text-slate-400 line-through font-bold">
                         {courseData.originalPrice.toLocaleString('vi-VN')} đ
                       </span>
                       <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] tracking-tight">
                          GIẢM {Math.round(((courseData.originalPrice - courseData.price) / courseData.originalPrice) * 100)}%
                       </Badge>
                     </>
                   )}
                </div>

                <Button
                  className='w-full h-14 bg-rose-600 hover:bg-rose-700 text-white font-black text-base rounded-2xl shadow-xl shadow-rose-200 dark:shadow-rose-900/20 active:scale-[0.98] transition-all disabled:opacity-70'
                  disabled={addMutation.isPending}
                  onClick={async () => {
                    await addMutation.mutateAsync(courseIdOrSlug)
                    router.push(PATH.CHECKOUT)
                  }}
                >
                  {addMutation.isPending ? 'Đang xử lý...' : 'Đăng ký ngay'}
                </Button>

                <div className="flex gap-3 mt-3 mb-8">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-2xl border-2 border-slate-200 dark:border-slate-700 font-black text-sm text-slate-700 dark:text-slate-200 hover:border-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all gap-2 active:scale-[0.98] disabled:opacity-50"
                    onClick={() => addMutation.mutate(courseIdOrSlug)}
                    disabled={addMutation.isPending}
                  >
                    <ShoppingCart size={16} />
                    {addMutation.isPending ? 'Đang thêm...' : 'Thêm giỏ hàng'}
                  </Button>

                  <button
                    onClick={toggleWishlist}
                    disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
                    className={`h-12 w-12 shrink-0 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-[0.92] disabled:opacity-50 ${
                      isWishlisted
                        ? 'border-rose-400 bg-rose-50 dark:bg-rose-500/10 text-rose-500'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                    }`}
                    title={isWishlisted ? 'Bỏ yêu thích' : 'Yêu thích'}
                  >
                    {addToWishlistMutation.isPending || removeFromWishlistMutation.isPending ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Heart
                        size={18}
                        className="transition-all duration-200"
                        fill={isWishlisted ? 'currentColor' : 'none'}
                      />
                    )}
                  </button>
                </div>

                <div className="space-y-5">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Khóa học bao gồm:</p>
                  
                  <div className="space-y-4">
                    <FeatureItem icon={<Layers size={16} />} text={`${courseData.chapters.length} Chương học`} />
                    <FeatureItem icon={<PlayCircle size={16} />} text={`${courseData.publishedLessonsCount} Bài giảng`} />
                    <FeatureItem icon={<Download size={16} />} text="Tài liệu có thể tải xuống" />
                    <FeatureItem icon={<Award size={16} />} text="Giấy chứng nhận hoàn thành" />
                    <FeatureItem icon={<Infinity size={16} />} text="Truy cập trọn đời" />
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800 text-center">
                  <p className="text-[11px] text-slate-400 font-bold mb-4">Cam kết hoàn tiền trong 30 ngày</p>
                  <div className="flex justify-center gap-6 text-slate-300">
                    <Check size={20} />
                    <Zap size={20} />
                    <ShieldCheck size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* Trial Box */}
            <div className="bg-slate-100 dark:bg-white/5 rounded-[2rem] p-6 text-center">
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                Bạn chưa chắc chắn? Hãy thử <br />Dùng thử miễn phí <span className="text-rose-600 underline cursor-pointer">7 ngày</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-bold text-xs">
      <div className="text-rose-600">
        {icon}
      </div>
      <span>{text}</span>
    </div>
  )
}
