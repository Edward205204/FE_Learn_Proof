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
    <main className='max-w-[1400px] mx-auto py-10 px-4 md:px-8 grid grid-cols-1 lg:grid-cols-4 gap-10'>
      {/* Lõi Render theo loại bài học */}
      <div className='lg:col-span-3 space-y-6'>
        {activeLesson.type === 'video' && (
          <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
            <VideoPlayer
              url={activeLesson.videoUrl}
              lastPosition={activeLesson.lastPosition}
              lessonId={activeLesson.id}
              onEnded={handleVideoEnded}
            />
            <h1 className='text-3xl font-bold text-foreground mt-6'>{activeLesson.title}</h1>
            <LessonTabs
              lessonId={activeLesson.id}
              description={activeLesson.description}
              materials={activeLesson.materials}
            />
          </div>
        )}

        {activeLesson.type === 'reading' && (
          <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
            <ReadingContent lesson={activeLesson} />
          </div>
        )}

        {activeLesson.type === 'quiz' && (
          <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
            <QuizContainer lesson={activeLesson} onSubmit={handleQuizSubmit} />
          </div>
        )}
      </div>

      {/* Cột Sidebar */}
      <div className='lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]'>
        <CurriculumSidebar
          chapters={chapters}
          currentLessonId={activeLesson.id}
          prevLessonId={prevLessonId}
          nextLessonId={nextLessonId}
          onLessonClick={handleNavigate}
        />
      </div>
    </main>
  )
}
