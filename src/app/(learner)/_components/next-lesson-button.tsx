'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Clock, CheckCircle2, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

const REQUIRED_SECONDS = 5 * 60 // 5 phút

interface NextLessonButtonProps {
  lessonId: string
  nextLessonId: string | null
  isAlreadyCompleted: boolean
  onComplete: () => Promise<void> | void
  onNavigate: (lessonId: string) => void
}

/**
 * Hiển thị ở cuối mỗi bài học.
 * - Nếu bài học đã được đánh dấu hoàn thành (isAlreadyCompleted) thì button luôn active.
 * - Nếu chưa, đếm ngược 5 phút; khi đủ thì unlock, mark complete và cho phép chuyển tiếp.
 */
export function NextLessonButton({
  courseId,
  lessonId,
  nextLessonId,
  isAlreadyCompleted,
  onComplete,
  onNavigate
}: NextLessonButtonProps & { courseId: string }) {
  const router = useRouter()
  const [hasClickedComplete, setHasClickedComplete] = useState(false)

  const [secondsLeft, setSecondsLeft] = useState(() => {
    if (isAlreadyCompleted) return 0
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`lesson_timer_${lessonId}`)
      if (saved && !isNaN(Number(saved))) return Math.max(0, Number(saved))
    }
    return REQUIRED_SECONDS
  })
  const [isUnlocked, setIsUnlocked] = useState(isAlreadyCompleted || secondsLeft === 0)
  // Dùng ref thay vì state vì chỉ là guard flag, không cần trigger re-render
  const hasAutoCompletedRef = useRef(isAlreadyCompleted)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Chỉ start timer nếu chưa hoàn thành — state ban đầu đã được khởi tạo đúng qua useState
  // Component được remount khi đổi bài (key={lessonId} ở parent) nên không cần reset state trong effect
  useEffect(() => {
    if (isAlreadyCompleted) return

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setIsUnlocked(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isAlreadyCompleted])

  // Lưu timer vào localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (secondsLeft > 0 && secondsLeft < REQUIRED_SECONDS) {
        localStorage.setItem(`lesson_timer_${lessonId}`, String(secondsLeft))
      } else if (secondsLeft === 0) {
        localStorage.removeItem(`lesson_timer_${lessonId}`)
      }
    }
  }, [secondsLeft, lessonId])

  // Khi countdown xong → tự động mark complete (fire-and-forget, không setState trong effect)
  useEffect(() => {
    if (!isUnlocked || hasAutoCompletedRef.current) return
    hasAutoCompletedRef.current = true
    onComplete()
  }, [isUnlocked, onComplete])

  const handleNext = () => {
    if (!isUnlocked) return
    if (nextLessonId) {
      onNavigate(nextLessonId)
    } else {
      if (!hasClickedComplete) {
        setHasClickedComplete(true)
      } else {
        router.push(`/certificate/${courseId}`)
      }
    }
  }

  const minutes = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const progressPercent = isAlreadyCompleted
    ? 100
    : Math.round(((REQUIRED_SECONDS - secondsLeft) / REQUIRED_SECONDS) * 100)

  return (
    <div className='mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm'>
      <div className='flex flex-col gap-4'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            {isUnlocked ? (
              <CheckCircle2 className='h-5 w-5 text-emerald-500' />
            ) : (
              <Clock className='h-5 w-5 text-primary animate-pulse' />
            )}
            <span className='text-sm font-bold text-foreground'>
              {isUnlocked ? 'Đã đủ điều kiện chuyển tiếp' : 'Thời gian học tối thiểu'}
            </span>
          </div>

          {/* Countdown badge */}
          {!isUnlocked && (
            <span className='tabular-nums rounded-full bg-primary/10 px-3 py-1 text-sm font-black text-primary'>
              {minutes}:{secs.toString().padStart(2, '0')}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
          <div
            className={cn(
              'h-full rounded-full transition-all duration-1000 ease-linear',
              isUnlocked ? 'bg-emerald-500' : 'bg-primary'
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className='text-xs text-muted-foreground'>
          {isUnlocked
            ? 'Bạn đã học đủ 5 phút. Có thể chuyển sang bài tiếp theo!'
            : `Hãy học ít nhất 5 phút để mở khóa bài tiếp theo. Còn ${minutes} phút ${secs} giây.`}
        </p>

        {/* Button */}
        <button
          disabled={!isUnlocked}
          onClick={handleNext}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-all duration-200',
            isUnlocked
              ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40 active:scale-[0.98]'
              : 'cursor-not-allowed bg-muted text-muted-foreground'
          )}
        >
          {nextLessonId ? (
            <>
              Chuyển tiếp bài học
              <ArrowRight className='h-4 w-4' />
            </>
          ) : !hasClickedComplete ? (
            <>
              <CheckCircle2 className='h-4 w-4' />
              Hoàn thành khóa học
            </>
          ) : (
            <>
              <Award className='h-4 w-4' />
              Cấp chứng chỉ
            </>
          )}
        </button>
      </div>
    </div>
  )
}
