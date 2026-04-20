'use client'

import { CheckCircle2, PlayCircle, Lock, ChevronRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Lesson {
  id: string
  title: string
  duration: string
  isCompleted: boolean
  isLocked: boolean
  type: 'video' | 'quiz' | 'reading'
}

interface Chapter {
  id: string
  title: string
  lessons: Lesson[]
}

interface CurriculumSidebarProps {
  chapters: Chapter[]
  currentLessonId: string
  prevLessonId?: string | null
  nextLessonId?: string | null
  onLessonClick?: (lessonId: string) => void
}

export function CurriculumSidebar({
  chapters,
  currentLessonId,
  prevLessonId,
  nextLessonId,
  onLessonClick
}: CurriculumSidebarProps) {
  // Tính tổng số bài & bài hoàn thành
  const allLessons = chapters.flatMap((c) => c.lessons)
  const totalLessons = allLessons.length
  const completedLessons = allLessons.filter((l) => l.isCompleted).length
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return (
    <div className='bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 h-full flex flex-col overflow-hidden'>
      {/* Header — PB24 */}
      <div className='mb-8 px-2 shrink-0'>
        <h3 className='font-bold text-lg text-foreground tracking-tight'>Nội dung khóa học</h3>
        <p className='text-[11px] font-medium text-muted-foreground mt-1 uppercase tracking-wide'>
          Hoàn thành {completedLessons} trên {totalLessons} bài học
        </p>

        {/* Thanh Progress Bar */}
        <div className='relative mt-6'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-[10px] font-black text-rose-500 uppercase tracking-wider'>Tiến độ học tập</span>
            <span className='text-[10px] font-black text-rose-500'>{progressPercent}%</span>
          </div>
          <div className='w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden'>
            <div
              className='bg-rose-500 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(244,63,94,0.4)]'
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Danh sách chương & bài học — cuộn được */}
      <div className='space-y-6 flex-1 overflow-y-auto pr-1 -mr-1'>
        {chapters.map((chapter, index) => (
          <div key={chapter.id} className='space-y-3'>
            {/* Tiêu đề chương */}
            <h4 className='text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-1 wrap-break-word'>
              Chương {index + 1}: {chapter.title}
            </h4>

            {/* Danh sách bài */}
            <div className='space-y-1'>
              {chapter.lessons.map((lesson) => {
                const isActive = lesson.id === currentLessonId

                return (
                  <button
                    key={lesson.id}
                    disabled={lesson.isLocked}
                    onClick={() => !lesson.isLocked && onLessonClick?.(lesson.id)}
                    className={cn(
                      'w-full group flex items-start justify-between p-3 rounded-md transition-all border text-left',
                      isActive
                        ? 'bg-primary/5 border-primary/20'
                        : lesson.isLocked
                          ? 'opacity-50 cursor-not-allowed border-transparent'
                          : 'hover:bg-muted/50 border-transparent cursor-pointer'
                    )}
                  >
                    <div className='flex items-start gap-3 min-w-0 flex-1'>
                      {/* Trạng thái icon */}
                      {lesson.isCompleted ? (
                        <CheckCircle2 className='h-4 w-4 text-emerald-500 shrink-0 mt-0.5' />
                      ) : lesson.isLocked ? (
                        <Lock className='h-4 w-4 text-muted-foreground shrink-0 mt-0.5' />
                      ) : (
                        <PlayCircle
                          className={cn(
                            'h-4 w-4 shrink-0 mt-0.5',
                            isActive
                              ? 'text-primary'
                              : 'text-muted-foreground group-hover:text-primary transition-colors'
                          )}
                        />
                      )}

                      <span
                        className={cn(
                          'text-[13px] leading-snug wrap-break-word transition-colors',
                          isActive
                            ? 'font-black text-rose-600'
                            : lesson.isCompleted
                              ? 'font-bold text-slate-400'
                              : 'font-bold text-slate-700 dark:text-slate-300 group-hover:text-rose-600'
                        )}
                      >
                        {lesson.title}
                      </span>
                    </div>

                    {/* Thời lượng / loại */}
                    <span className='text-[10px] font-mono text-muted-foreground shrink-0 ml-3 pt-0.5 max-w-[72px] text-right break-all'>
                      {lesson.type === 'quiz' ? 'Quiz' : lesson.duration}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* THANH ĐIỀU HƯỚNG TRƯỚC - SAU */}
      <div className='flex items-center justify-between px-2 pt-6 pb-2 border-t border-border mt-4 shrink-0'>
        <button
          disabled={!prevLessonId}
          onClick={() => prevLessonId && onLessonClick?.(prevLessonId)}
          className='flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors group disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground hover:text-primary disabled:hover:text-muted-foreground'
        >
          <ChevronLeft size={16} className='group-hover:-translate-x-0.5 transition-transform' />
          Trước
        </button>

        <button
          disabled={!nextLessonId}
          onClick={() => nextLessonId && onLessonClick?.(nextLessonId)}
          className='flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors group disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground hover:text-primary disabled:hover:text-muted-foreground'
        >
          Sau
          <ChevronRight size={16} className='group-hover:translate-x-0.5 transition-transform' />
        </button>
      </div>
    </div>
  )
}
