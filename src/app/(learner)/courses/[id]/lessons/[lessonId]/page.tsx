'use client'
import { LessonTabs } from '@/app/(learner)/_components/lesson-tabs'
import { useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { VideoPlayer } from '../../../../_components/video-player'

import { CurriculumSidebar } from '../../../../_components/curriculum-sidebar'
import { ReadingContent } from '../../../../_components/reading-content'
import { QuizContainer } from '../../../../_components/quiz-container'
import { LessonDiscussion } from '../../../../_components/lesson-discussion'
import { useGetCourseProgressQuery } from '../../../../_hooks/use-course'
import learnerLessonApi from '../../../../_api/lesson.api'
import learnerQuizApi from '../../../../_api/quiz.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { LessonData, SidebarChapter } from '../../../../_utils/lesson-types'

function formatDuration(seconds?: number | null) {
  if (!seconds) return '--:--'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function LessonPage() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const params = useParams<{ id: string; lessonId: string }>()
  const courseId = params.id
  const routeLessonId = params.lessonId

  const {
    data: progressData,
    isLoading: isProgressLoading,
    isError: isProgressError
  } = useGetCourseProgressQuery(courseId)

  const chapters: SidebarChapter[] = useMemo(
    () =>
      (progressData || []).map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        lessons: chapter.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          duration: formatDuration(lesson.duration),
          isCompleted: lesson.progress?.[0]?.isCompleted ?? false,
          isLocked: lesson.isLocked,
          type: lesson.type === 'TEXT' ? 'reading' : lesson.type === 'QUIZ' ? 'quiz' : 'video'
        }))
      })),
    [progressData]
  )

  const allLessons = useMemo(() => chapters.flatMap((c) => c.lessons), [chapters])
  const fallbackLessonId = useMemo(() => allLessons.find((l) => !l.isCompleted)?.id || allLessons[0]?.id, [allLessons])
  const currentLessonId = routeLessonId === 'start' ? fallbackLessonId : routeLessonId

  useEffect(() => {
    if (!courseId || !fallbackLessonId || !routeLessonId) return
    const routeExists = allLessons.some((l) => l.id === routeLessonId)
    if (routeLessonId === 'start' || !routeExists) {
      router.replace(`/courses/${courseId}/lessons/${fallbackLessonId}`)
    }
  }, [allLessons, courseId, fallbackLessonId, routeLessonId, router])

  const {
    data: lessonData,
    isLoading: isLessonLoading,
    isError: isLessonError
  } = useQuery({
    queryKey: ['learner_lesson', currentLessonId],
    queryFn: () => learnerLessonApi.getLessonForLearner(currentLessonId!).then((res) => res.data),
    enabled: Boolean(currentLessonId)
  })

  const markCompleteMutation = useMutation({
    mutationFn: (lessonId: string) => learnerLessonApi.markLessonComplete(lessonId, courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learner_course', courseId, 'progress'] })
      toast.success('Đã cập nhật tiến độ bài học.')
    }
  })

  const submitQuizMutation = useMutation({
    mutationFn: ({ quizId, submission }: { quizId: string; submission: { questionId: string; answerId: string }[] }) =>
      learnerQuizApi.submitQuiz(quizId, submission).then((res) => res.data)
  })

  const activeLesson: LessonData | null = useMemo(() => {
    if (!lessonData) return null
    if (lessonData.type === 'VIDEO') {
      return {
        id: lessonData.id,
        type: 'video',
        title: lessonData.title,
        videoUrl: lessonData.videoUrl,
        lastPosition: 0,
        description: lessonData.shortDesc || 'Không có mô tả cho bài học này.',
        materials: []
      }
    }
    if (lessonData.type === 'TEXT') {
      const wordCount = lessonData.textContent.trim().split(/\s+/).length
      return {
        id: lessonData.id,
        type: 'reading',
        title: lessonData.title,
        content: lessonData.textContent,
        estimatedMinutes: Math.max(1, Math.ceil(wordCount / 220)),
        materials: []
      }
    }
    return {
      id: lessonData.id,
      type: 'quiz',
      title: lessonData.title,
      isFinalExam: false,
      quizId: lessonData.quiz?.id,
      questions: (lessonData.quiz?.questions || []).map((q) => ({
        id: q.id,
        text: q.content,
        options: q.answers.map((a) => ({ id: a.id, text: a.content }))
      }))
    }
  }, [lessonData])

  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId)
  const prevLessonId = allLessons[currentIndex - 1]?.id ?? null
  const nextLessonId = allLessons[currentIndex + 1]?.id ?? null

  const handleNavigate = (id: string) => {
    router.push(`/courses/${courseId}/lessons/${id}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleQuizSubmit = async (answers: Record<string, string>) => {
    if (!activeLesson || activeLesson.type !== 'quiz' || !activeLesson.quizId) return
    const submission = Object.entries(answers).map(([questionId, answerId]) => ({ questionId, answerId }))
    const result = await submitQuizMutation.mutateAsync({
      quizId: activeLesson.quizId,
      submission
    })
    await markCompleteMutation.mutateAsync(activeLesson.id)
    return {
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      score: Number(result.score)
    }
  }

  if (isProgressError || isLessonError) {
    return (
      <main className='max-w-[1200px] mx-auto py-10 px-4 md:px-8'>
        <p className='text-sm text-destructive font-medium'>Không thể tải phòng học. Vui lòng thử lại.</p>
      </main>
    )
  }

  if (!fallbackLessonId) {
    return (
      <main className='max-w-[1200px] mx-auto py-10 px-4 md:px-8'>
        <p className='text-sm text-muted-foreground font-medium'>Khóa học chưa có bài học để bắt đầu.</p>
      </main>
    )
  }

  if (isProgressLoading || isLessonLoading || !activeLesson) {
    return (
      <main className='max-w-[1200px] mx-auto py-10 px-4 md:px-8 flex items-center justify-center min-h-[60vh]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </main>
    )
  }

  return (
    <main className='mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 py-10 md:px-8 lg:flex-row'>
      {/* Lõi Render theo loại bài học */}
      <div className='min-w-0 flex-1 basis-0 space-y-6 lg:flex-2'>
        {activeLesson.type === 'video' && (
          <div className='w-full min-w-0'>
            <VideoPlayer
              url={activeLesson.videoUrl}
              lastPosition={activeLesson.lastPosition}
              lessonId={activeLesson.id}
            />
            <h1 className='mt-6 w-full wrap-break-word text-3xl font-bold text-foreground'>{activeLesson.title}</h1>
            <LessonTabs
              courseId={courseId}
              lessonId={activeLesson.id}
              description={activeLesson.description}
              materials={activeLesson.materials}
            />
          </div>
        )}

        {activeLesson.type === 'reading' && (
          <div className='space-y-6 w-full min-w-0'>
            <ReadingContent key={activeLesson.id} lesson={activeLesson} onComplete={() => markCompleteMutation.mutate(activeLesson.id)} />
            <LessonDiscussion courseId={courseId} lessonId={activeLesson.id} />
          </div>
        )}

        {activeLesson.type === 'quiz' && (
          <div className='w-full min-w-0'>
            <QuizContainer courseId={courseId} lesson={activeLesson} onSubmit={handleQuizSubmit} />
          </div>
        )}
      </div>

      {/* Cột Sidebar */}
      <div className='min-w-0 lg:flex-1 lg:basis-0 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]'>
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
