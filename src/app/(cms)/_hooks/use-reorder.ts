'use client'

import { useCallback, useRef } from 'react'
import { toast } from 'sonner'
import courseApi from '../_api/course.api'
import type { ReorderChapterPayload, ReorderLessonPayload } from '../_utils/zod'

type ReorderJob =
  | { kind: 'chapter'; payload: ReorderChapterPayload }
  | { kind: 'lesson'; payload: ReorderLessonPayload }

const DEBOUNCE_MS = 800

/**
 * Debounced reorder queue.
 *
 * Design decisions:
 * - Each dragged item gets its own "slot" in the queue (keyed by chapterId or lessonId).
 *   If the user drags the same item multiple times quickly, only the latest position is sent.
 * - After DEBOUNCE_MS of inactivity the queue is flushed: all pending jobs fire in parallel.
 * - On failure, `onRollback` is called so the page can revert to the last server-confirmed state.
 * - A "saving" flag is exposed so the UI can show a subtle indicator.
 */
export function useReorderQueue(onRollback: () => void) {
  const queueRef = useRef<Map<string, ReorderJob>>(new Map())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFlushing = useRef(false)

  const flush = useCallback(async () => {
    if (isFlushing.current) return
    const jobs = new Map(queueRef.current)
    queueRef.current.clear()
    if (jobs.size === 0) return

    isFlushing.current = true

    const promises = Array.from(jobs.values()).map((job) => {
      if (job.kind === 'chapter') return courseApi.reorderChapter(job.payload)
      return courseApi.reorderLesson(job.payload)
    })

    try {
      await Promise.all(promises)
    } catch {
      toast.error('Lỗi khi lưu thứ tự. Đang khôi phục...')
      onRollback()
    } finally {
      isFlushing.current = false
      if (queueRef.current.size > 0) {
        flush()
      }
    }
  }, [onRollback])

  const enqueue = useCallback(
    (job: ReorderJob) => {
      const key = job.kind === 'chapter' ? `ch:${job.payload.chapterId}` : `ls:${job.payload.lessonId}`
      queueRef.current.set(key, job)

      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(flush, DEBOUNCE_MS)
    },
    [flush]
  )

  return { enqueue }
}
