'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useGetCourseProgressQuery } from '../../../_hooks/use-course'
import { Loader2 } from 'lucide-react'

export default function LessonsRedirectPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const { data: chapters, isLoading } = useGetCourseProgressQuery(courseId)

  useEffect(() => {
    if (chapters && chapters.length > 0) {
      // Find the first lesson of the first chapter
      const firstChapter = chapters[0]
      if (firstChapter.lessons.length > 0) {
        const firstLessonId = firstChapter.lessons[0].id
        router.replace(`/courses/${courseId}/lessons/${firstLessonId}`)
      }
    }
  }, [chapters, courseId, router])

  if (!isLoading && (!chapters || chapters.length === 0)) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4'>
        <p className='text-rose-500 font-bold'>Lỗi: Khóa học này chưa có nội dung bài học.</p>
        <button
          onClick={() => router.back()}
          className='text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors'
        >
          Quay lại trang trước
        </button>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
      <Loader2 className='w-12 h-12 animate-spin text-rose-500' />
      <p className='text-muted-foreground font-medium animate-pulse'>Đang chuẩn bị bài học...</p>
    </div>
  )
}
