'use client'

import { 
  ChevronRight, 
  Star, 
  Play, 
  Check, 
  Layers, 
  Download, 
  Award, 
  Infinity, 
  ChevronDown, 
  PlayCircle,
  FileText,
  ShieldCheck,
  Zap,
  ShoppingCart,
  Heart
} from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'

// Mock data following CourseDetailResponseSchema
const COURSE_DETAIL = {
  id: 'c1',
  title: 'Làm chủ Ethereum & Hợp đồng thông minh',
  slug: 'lap-trinh-reactjs-pro',
  shortDesc: 'Hướng dẫn toàn diện để xây dựng các ứng dụng phi tập trung (dApps) trên mạng lưới Ethereum bằng Solidity và Web3.js. Làm chủ tương lai của web.',
  fullDesc: `Khóa học này được thiết kế dành cho các nhà phát triển muốn tìm hiểu sâu về thế giới web3. Bạn sẽ bắt đầu với các khái niệm cơ bản về công nghệ blockchain và nhanh chóng chuyển sang viết mã Solidity cấp độ chuyên nghiệp.

Xuyên suốt các mô-đun, chúng tôi tập trung vào bảo mật, tối ưu hóa và triển khai trong thực tế. Vào cuối khóa học này, bạn sẽ xây dựng được bốn dự án lớn bao gồm một sàn giao dịch phi tập trung và hệ sinh thái mã thông báo quản trị.`,
  thumbnail: 'https://images.unsplash.com/photo-1639762681412-cd1241168997?auto=format&fit=crop&q=80',
  level: 'INTERMEDIATE',
  status: 'PUBLISHED',
  isFree: false,
  price: 129.0,
  originalPrice: 199.0,
  isCompleted: false,
  publishedLessonsCount: 45,
  totalPlannedLessons: 50,
  expectedDays: 30,
  createdAt: new Date(),
  updatedAt: new Date(),
  category: {
    name: 'BLOCKCHAIN',
    slug: 'blockchain',
  },
  creator: {
    id: 'u1',
    fullName: 'Dr. Elena Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
  },
  chapters: [
    {
      id: 'ch1',
      title: 'Chương 1: Giới thiệu về Web3',
      order: 1,
      lessons: [
        { id: 'l1', title: 'Ethereum là gì?', order: 1, type: 'VIDEO', duration: 762 },
        { id: 'l2', title: 'Lộ trình đi đến thông thạo', order: 2, type: 'TEXT', duration: 300 },
      ]
    },
    {
      id: 'ch2',
      title: 'Chương 2: Cơ bản về Solidity',
      order: 2,
      lessons: [
        { id: 'l3', title: 'Biến và kiểu dữ liệu', order: 1, type: 'VIDEO', duration: 900 },
        { id: 'l4', title: 'Functions và Modifiers', order: 2, type: 'VIDEO', duration: 1200 },
      ]
    },
    {
      id: 'ch3',
      title: 'Chương 3: Hợp đồng thông minh nâng cao',
      order: 3,
      lessons: [
        { id: 'l5', title: 'Tối ưu hóa Gas', order: 1, type: 'VIDEO', duration: 1500 },
        { id: 'l6', title: 'Security Patterns', order: 2, type: 'QUIZ', duration: 600 },
      ]
    }
  ],
  overallAnalytics: {
    totalStudents: 2400,
    avgRating: 4.9,
    completionRate: 85,
  },
  reviews: [
    {
      id: 'r1',
      rating: 5,
      comment: 'Cách Elena giải thích các khái niệm phức tạp như tối ưu hóa gas thật tuyệt vời. Khóa học này đã giúp tôi có được công việc dApp developer thực thụ đầu tiên!',
      createdAt: new Date(),
      user: { fullName: 'Marcus Thorne', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80' }
    },
    {
      id: 'r2',
      rating: 5,
      comment: 'Cực kỳ thực tế. Các bài thực hành code rất chi tiết và cộng đồng Discord cực kỳ hữu ích khi bạn gặp khó khăn.',
      createdAt: new Date(),
      user: { fullName: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80' }
    }
  ]
}

export default function CourseDetailPage() {
  const [expandedChapters, setExpandedChapters] = useState<string[]>(['ch1'])
  const [isWishlisted, setIsWishlisted] = useState(false)

  const toggleChapter = (id: string) => {
    setExpandedChapters(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const formatDuration = (seconds: number) => {
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
            <Link href="/courses" className="hover:text-rose-500 transition-colors">
              Khóa học
            </Link>
            <ChevronRight size={10} strokeWidth={3} />
            <span className="text-rose-500">{COURSE_DETAIL.title}</span>
          </div>

          <div className="max-w-[800px] space-y-6">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              Làm chủ <span className="text-rose-600">Ethereum</span> & <br />Hợp đồng thông minh
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
              {COURSE_DETAIL.shortDesc}
            </p>

            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                  <AvatarImage src={COURSE_DETAIL.creator.avatar!} />
                  <AvatarFallback>ES</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">
                    {COURSE_DETAIL.creator.fullName}
                  </p>
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                    Kiến trúc sư Blockchain
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                 <div className="flex items-center gap-1 bg-amber-400/10 text-amber-500 px-2 py-1 rounded-lg">
                    <Star size={16} fill="currentColor" strokeWidth={0} />
                    <span className="text-sm font-black">{COURSE_DETAIL.overallAnalytics?.avgRating}</span>
                 </div>
                 <span className="text-xs text-slate-400 font-bold">({COURSE_DETAIL.overallAnalytics?.totalStudents.toLocaleString()} đánh giá)</span>
              </div>
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
              {COURSE_DETAIL.fullDesc}
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
              {COURSE_DETAIL.chapters.map((chapter) => (
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
              {COURSE_DETAIL.reviews.map((review) => (
                <div key={review.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.user.avatar!} />
                      <AvatarFallback>ST</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">
                        {review.user.fullName}
                      </p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={10} fill="currentColor" strokeWidth={0} className="text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="relative">
          <div className="space-y-6">
            
            {/* Preview Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 group">
              <div className="relative aspect-video">
                <Image 
                  src={COURSE_DETAIL.thumbnail!} 
                  alt={COURSE_DETAIL.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
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
                     ${COURSE_DETAIL.price.toFixed(2)}
                   </span>
                   {COURSE_DETAIL.originalPrice && COURSE_DETAIL.originalPrice > COURSE_DETAIL.price && (
                     <>
                       <span className="text-lg text-slate-400 line-through font-bold">
                         ${COURSE_DETAIL.originalPrice.toFixed(2)}
                       </span>
                       <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] tracking-tight">
                          GIẢM {Math.round(((COURSE_DETAIL.originalPrice - COURSE_DETAIL.price) / COURSE_DETAIL.originalPrice) * 100)}%
                       </Badge>
                     </>
                   )}
                </div>

                <Button className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white font-black text-base rounded-2xl shadow-xl shadow-rose-200 dark:shadow-rose-900/20 active:scale-[0.98] transition-all">
                  Đăng ký ngay
                </Button>

                <div className="flex gap-3 mt-3 mb-8">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-2xl border-2 border-slate-200 dark:border-slate-700 font-black text-sm text-slate-700 dark:text-slate-200 hover:border-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all gap-2 active:scale-[0.98]"
                  >
                    <ShoppingCart size={16} />
                    Thêm giỏ hàng
                  </Button>

                  <button
                    onClick={() => setIsWishlisted(prev => !prev)}
                    className={`h-12 w-12 shrink-0 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-[0.92] ${
                      isWishlisted
                        ? 'border-rose-400 bg-rose-50 dark:bg-rose-500/10 text-rose-500'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                    }`}
                    title={isWishlisted ? 'Bỏ yêu thích' : 'Yêu thích'}
                  >
                    <Heart
                      size={18}
                      className="transition-all duration-200"
                      fill={isWishlisted ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>

                <div className="space-y-5">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Khóa học bao gồm:</p>
                  
                  <div className="space-y-4">
                    <FeatureItem icon={<Layers size={16} />} text="32 Chương học" />
                    <FeatureItem icon={<PlayCircle size={16} />} text="45 Video bài giảng HD" />
                    <FeatureItem icon={<Download size={16} />} text="Tài liệu có thể tải xuống" />
                    <FeatureItem icon={<Award size={16} />} text="Chứng chỉ xác nhận Blockchain" />
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
