'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Play, FileText, HelpCircle, Rocket, ChevronRight, Layout, BookOpen, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { PATH } from '../../../../constants/path'
import { useUpdateProfileMutation } from '@/app/(auth)/_hooks/use-auth-mutation'

const ROADMAP_STEPS = [
  {
    id: 1,
    title: 'Bước 1: Cơ bản & Nền tảng',
    stats: '5 bài học • 2 giờ học tập',
    tags: ['Bắt buộc', 'Nhập môn'],
    icon: <BookOpen className='w-5 h-5' />,
    lessons: [
      { id: 101, type: 'video', title: 'Giới thiệu về lộ trình', duration: '12 PHÚT' },
      { id: 102, type: 'doc', title: 'Tư duy thiết kế cơ bản', duration: '15 PHÚT' },
      { id: 103, type: 'quiz', title: 'Kiểm tra kiến thức đầu vào', duration: '10 CÂU' }
    ]
  },
  {
    id: 2,
    title: 'Bước 2: Kỹ năng chuyên sâu',
    stats: '8 bài học • 5 giờ học tập',
    tags: ['Trung cấp'],
    icon: <Target className='w-5 h-5' />,
    lessons: [
      { id: 201, type: 'video', title: 'Xây dựng Component nâng cao', duration: '45 PHÚT' },
      { id: 202, type: 'video', title: 'Quản lý State hiệu quả', duration: '30 PHÚT' }
    ]
  },
  {
    id: 3,
    title: 'Bước 3: Dự án thực tế',
    stats: '3 bài tập • Project cuối khóa',
    tags: ['Thực chiến'],
    icon: <Rocket className='w-5 h-5' />,
    lessons: [
      { id: 301, type: 'doc', title: 'Đề bài Project cuối khóa', duration: 'Hàng tuần' },
      { id: 302, type: 'video', title: 'Hướng dẫn Deploy dự án', duration: '20 PHÚT' }
    ]
  }
]

export default function OnboardingFinishPage() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(1)
  const updateProfileMutation = useUpdateProfileMutation()

  const currentStepData = ROADMAP_STEPS.find((s) => s.id === activeStep) || ROADMAP_STEPS[0]

  return (
    <div className='min-h-screen bg-[#FFF5F7]'>
      <main className='max-w-6xl mx-auto px-6 py-10'>
        {/* Step Info */}
        <div className='flex items-center justify-between mb-8'>
          <div className='flex flex-col'>
            <span className='text-[10px] font-black text-primary uppercase tracking-widest mb-1'>
              BƯỚC 6/6: HOÀN TẤT LỘ TRÌNH
            </span>
            <div className='w-48'>
              <Progress value={100} className='h-1.5 bg-rose-100' />
            </div>
          </div>
          <span className='text-xs font-bold text-muted-foreground'>100% hoàn thành</span>
        </div>

        {/* Hero Section */}
        <div className='mb-12'>
          <h1 className='text-4xl font-extrabold text-foreground mb-4'>
            Lộ trình cá nhân hóa của <br /> bạn đã sẵn sàng!
          </h1>
          <div className='flex items-center justify-between'>
            <p className='text-muted-foreground max-w-xl'>
              Dựa trên mục tiêu và kỹ năng hiện tại, chúng tôi đã thiết kế hành trình học tập tối ưu nhất dành riêng cho
              bạn. Kiểm tra và tùy chỉnh theo ý muốn.
            </p>
            <div className='flex gap-3'>
              <Button
                variant='outline'
                className='rounded-2xl border-rose-100 bg-white shadow-sm hover:bg-rose-50 text-rose-500 font-bold'
              >
                <Pencil className='w-4 h-4 mr-2' /> Chỉnh sửa
              </Button>
              <Button
                variant='outline'
                className='rounded-2xl border-rose-100 bg-white shadow-sm hover:bg-rose-50 text-rose-500 font-bold'
              >
                <Plus className='w-4 h-4 mr-2' /> Thêm bước mới
              </Button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
          {/* Timeline Sidebar */}
          <div className='lg:col-span-5 relative'>
            {/* Connection Line */}
            <div className='absolute left-6 top-10 bottom-10 w-0.5 bg-rose-200' />

            <div className='space-y-6'>
              {ROADMAP_STEPS.map((step) => (
                <div key={step.id} className='relative pl-14 cursor-pointer' onClick={() => setActiveStep(step.id)}>
                  {/* Step Dot/Icon */}
                  <div
                    className={cn(
                      'absolute left-0 top-6 w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg transition-all duration-300 z-10',
                      activeStep === step.id ? 'bg-primary text-white scale-110' : 'bg-white text-rose-300'
                    )}
                  >
                    {step.icon}
                  </div>

                  <div
                    className={cn(
                      'p-6 rounded-3xl border-2 transition-all duration-300',
                      activeStep === step.id
                        ? 'bg-white border-primary shadow-xl shadow-rose-200/50 scale-[1.02]'
                        : 'bg-white/50 border-transparent hover:border-rose-100'
                    )}
                  >
                    <h3
                      className={cn(
                        'text-lg font-bold mb-1',
                        activeStep === step.id ? 'text-primary' : 'text-muted-foreground'
                      )}
                    >
                      {step.title}
                    </h3>
                    <p className='text-xs text-muted-foreground mb-3'>{step.stats}</p>
                    <div className='flex gap-2'>
                      {step.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant='secondary'
                          className='bg-rose-50 text-rose-400 border-none font-bold text-[10px] px-2'
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details Pane */}
          <div className='lg:col-span-7'>
            <div className='bg-white rounded-[40px] p-8 shadow-2xl shadow-rose-100 border border-white'>
              <div className='flex items-center justify-between mb-8'>
                <h2 className='text-2xl font-bold flex items-center gap-2'>Chi tiết Bước {activeStep}</h2>
                <Button variant='ghost' size='sm' className='text-muted-foreground font-bold'>
                  Sắp xếp lại <Layout className='w-4 h-4 ml-2' />
                </Button>
              </div>

              <div className='space-y-4 mb-8'>
                {currentStepData.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className='flex items-center gap-4 p-4 rounded-3xl bg-rose-50/50 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all cursor-pointer'
                  >
                    <div className='w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary'>
                      {lesson.type === 'video' && <Play className='w-5 h-5 fill-current' />}
                      {lesson.type === 'doc' && <FileText className='w-5 h-5' />}
                      {lesson.type === 'quiz' && <HelpCircle className='w-5 h-5' />}
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-bold text-foreground'>{lesson.title}</h4>
                      <p className='text-[10px] font-black text-muted-foreground uppercase'>
                        {lesson.type === 'video' ? 'VIDEO' : lesson.type === 'doc' ? 'TÀI LIỆU' : 'TRẮC NGHIỆM'} •{' '}
                        {lesson.duration}
                      </p>
                    </div>
                    <ChevronRight className='w-5 h-5 text-muted-foreground/30' />
                  </div>
                ))}

                <button className='w-full py-4 border-2 border-dashed border-rose-200 rounded-3xl text-rose-400 font-bold flex items-center justify-center hover:bg-rose-50 transition-all'>
                  <Plus className='w-5 h-5 mr-2' /> Thêm bài học vào bước này
                </button>
              </div>

              <div className='space-y-4 pt-4 border-t border-rose-100'>
                <Button
                  onClick={() => {
                    updateProfileMutation.mutate({ isOnboardingCompleted: true }, {
                      onSuccess: () => {
                        router.push(PATH.HOME)
                      }
                    })
                  }}
                  disabled={updateProfileMutation.isPending}
                  size='lg'
                  className='w-full rounded-2xl py-8 text-xl font-bold shadow-xl shadow-primary/30'
                >
                  {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu lộ trình và Bắt đầu'}{' '}
                  <Rocket className='ml-2 w-6 h-6' />
                </Button>
                <p className='text-center text-xs text-muted-foreground italic'>
                  Bạn luôn có thể quay lại để tùy chỉnh sau khi bắt đầu học.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='max-w-6xl mx-auto px-6 py-12 flex items-center justify-between border-t border-rose-100 mt-12 mb-8'>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <div className='w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center text-primary font-bold italic text-xs'>
            L
          </div>
          <span className='text-sm font-bold'>LearnProof v2.4</span>
        </div>
        <div className='flex gap-8'>
          <a href='#' className='text-sm font-bold text-muted-foreground hover:text-primary transition-colors'>
            Hướng dẫn
          </a>
          <a href='#' className='text-sm font-bold text-muted-foreground hover:text-primary transition-colors'>
            Hỗ trợ học tập
          </a>
          <a href='#' className='text-sm font-bold text-muted-foreground hover:text-primary transition-colors'>
            Cộng đồng
          </a>
        </div>
      </footer>
    </div>
  )
}
