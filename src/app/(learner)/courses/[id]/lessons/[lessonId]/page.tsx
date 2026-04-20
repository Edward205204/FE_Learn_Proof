'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { VideoPlayer } from '../../../../_components/video-player'
import { LessonTabs } from '../../../../_components/lesson-tabs'
import { CurriculumSidebar } from '../../../../_components/curriculum-sidebar'
import { ReadingContent } from '../../../../_components/reading-content'
import { QuizContainer } from '../../../../_components/quiz-container'

import { useGetCourseProgressQuery } from '../../../../_hooks/use-course'
import { useGetLessonForLearnerQuery, useMarkLessonCompleteMutation } from '../../../../_hooks/use-lesson'
import type { SidebarChapter, LessonData } from '../../../../_utils/lesson-types'

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  const lessonId = params.lessonId as string

  // 1. Fetch Curriculum & Progress
  const { data: chaptersRaw, isLoading: isLoadingChapters } = useGetCourseProgressQuery(courseId)

  // 2. Fetch Current Lesson Detail
  const { data: lessonRaw, isLoading: isLoadingLesson } = useGetLessonForLearnerQuery(lessonId)

  // 3. Mark Complete Mutation
  const { mutate: markComplete } = useMarkLessonCompleteMutation(courseId)

  // 4. Map Chapters to Sidebar Format
  const chapters: SidebarChapter[] = (chaptersRaw || []).map((ch) => ({
    id: ch.id,
    title: ch.title,
    lessons: ch.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      duration: l.duration ? `${Math.floor(l.duration / 60)}:${(l.duration % 60).toString().padStart(2, '0')}` : '0:00',
      isCompleted: l.progress.length > 0 && l.progress[0].isCompleted,
      isLocked: false, // Tạm thời để false hết
      type: l.type === 'VIDEO' ? 'video' : l.type === 'TEXT' ? 'reading' : 'quiz'
    }))
  }))

  const allLessons = chapters.flatMap((c) => c.lessons)

  // 5. Build Active Lesson Data
  let activeLesson: LessonData | null = null
  if (lessonRaw) {
    if (lessonRaw.type === 'VIDEO') {
      activeLesson = {
        id: lessonRaw.id,
        type: 'video',
        title: lessonRaw.title,
        videoUrl: lessonRaw.videoUrl || '',
        lastPosition: 0, // FE tính toán sau
        description: lessonRaw.shortDesc || '',
        materials: [] // BE chưa support materials
      }
    } else if (lessonRaw.type === 'TEXT') {
      activeLesson = {
        id: lessonRaw.id,
        type: 'reading',
        title: lessonRaw.title,
        content: lessonRaw.textContent || '',
        estimatedMinutes: 5,
        materials: []
      }
    } else if (lessonRaw.type === 'QUIZ') {
      activeLesson = {
        id: lessonRaw.id,
        type: 'quiz',
        title: lessonRaw.title,
        isFinalExam: false,
        questions: (lessonRaw.quiz?.questions || []).map((q) => ({
          id: q.id,
          text: q.content,
          options: q.answers.map((a) => ({ id: a.id, text: a.content })),
          correctOptionId: '' // QuizLearnerResponse không trả về correctId để bảo mật
        }))
      }
    }
  }

  const currentIndex = allLessons.findIndex((l) => l.id === lessonId)
  const prevLessonId = allLessons[currentIndex - 1]?.id ?? null
  const nextLessonId = allLessons[currentIndex + 1]?.id ?? null

  const handleNavigate = (id: string) => {
    router.push(`/courses/${courseId}/lessons/${id}`)
  }

  const handleQuizSubmit = (answers: Record<string, string>, score: number) => {
    console.log('Quiz submitted:', { answers, score })
    // Giả sử hoàn thành quiz là hoàn thành bài học
    markComplete(lessonId)
  }

  const handleVideoEnded = () => {
    markComplete(lessonId)
  }

  // Tự động mark hoàn thành cho bài đọc sau 3 giây (để demo)
  useEffect(() => {
    if (activeLesson?.type === 'reading' && lessonId) {
      const timer = setTimeout(() => {
        markComplete(lessonId)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [activeLesson?.type, lessonId, markComplete])

  if (isLoadingChapters || isLoadingLesson) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
        <Loader2 className='w-12 h-12 animate-spin text-primary' />
        <p className='text-muted-foreground font-medium'>Đang tải nội dung bài học...</p>
      </div>
    )
  }

  if (!activeLesson) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
        <p className='text-destructive font-bold'>Không tìm thấy bài học</p>
        <Button onClick={() => router.back()}>Quay lại</Button>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[oklch(0.985_0_0)] dark:bg-[oklch(0.141_0.005_285.823)]'>
      <main className='max-w-[1440px] mx-auto py-8 px-4 md:px-8 lg:px-10'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
          {/* Lõi Render theo loại bài học */}
          <div className='lg:col-span-8 xl:col-span-9 space-y-8'>
            {activeLesson.type === 'video' && (
              <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
                <VideoPlayer
                  url={activeLesson.videoUrl}
                  lastPosition={activeLesson.lastPosition}
                  lessonId={activeLesson.id}
                  onEnded={handleVideoEnded}
                />
                <div className='mt-8 space-y-6'>
                  <h1 className='text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight'>
                    {activeLesson.title}
                  </h1>
                  <LessonTabs
                    lessonId={activeLesson.id}
                    courseId={courseId}
                    description={activeLesson.description}
                    materials={activeLesson.materials}
                    isEnrolled={chaptersRaw && chaptersRaw.length > 0}
                  />
                </div>
              </div>
            )}

            {activeLesson.type === 'reading' && (
              <div className='animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800'>
                <ReadingContent lesson={activeLesson} />
              </div>
            )}

            {activeLesson.type === 'quiz' && (
              <div className='animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800'>
                <QuizContainer lesson={activeLesson} onSubmit={handleQuizSubmit} />
              </div>
            )}
          </div>

          {/* Cột Sidebar - Khóa cứng */}
          <div className='lg:col-span-4 xl:col-span-3 lg:sticky lg:top-28 h-fit lg:h-[calc(100vh-140px)] z-20'>
            <CurriculumSidebar
              chapters={chapters}
              currentLessonId={activeLesson.id}
              prevLessonId={prevLessonId}
              nextLessonId={nextLessonId}
              onLessonClick={handleNavigate}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
