'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Pencil, Trash2, GripVertical, Plus, ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PATH } from '@/constants/path'
import { CourseStepper } from '@/app/(cms)/_components/course-stepper'
import { updateCourseChaptersFrameSchema, type UpdateCourseChaptersFrameBody } from '@/app/(cms)/_utils/zod'
import { useGetCourseBaseInfoQuery, useUpdateCourseChaptersFrameMutation } from '@/app/(cms)/_hooks/use-course-mutation'

interface ChapterUi {
  id: string
  title: string
  order: number
}

export default function EditCourseStep2Page() {
  const router = useRouter()
  const params = useParams<{ courseId: string }>()
  const courseId = params.courseId

  const { data: baseInfo } = useGetCourseBaseInfoQuery(courseId)
  const updateChaptersMutation = useUpdateCourseChaptersFrameMutation(courseId)

  const initialChapters = useMemo<ChapterUi[]>(
    () =>
      (baseInfo?.chapters ?? [])
        .map((c) => ({ id: c.id, title: c.title, order: c.order }))
        .sort((a, b) => a.order - b.order),
    [baseInfo]
  )

  const [chapterName, setChapterName] = useState('')
  const [chapters, setChapters] = useState<ChapterUi[]>(() => initialChapters)

  const addChapter = () => {
    if (!chapterName.trim()) return
    const nextOrder = (chapters.at(-1)?.order ?? 0) + 1
    setChapters([...chapters, { id: `temp-${Date.now()}`, title: chapterName.trim(), order: nextOrder }])
    setChapterName('')
  }

  const deleteChapter = (id: string) => {
    const newChapters = chapters.filter((c) => c.id !== id).map((c, idx) => ({ ...c, order: idx + 1 }))
    setChapters(newChapters)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addChapter()
    }
  }

  const onNext = async () => {
    const body: UpdateCourseChaptersFrameBody = {
      chapterList: chapters.map((c, idx) => ({ title: c.title, order: idx + 1 }))
    }
    const parsed = updateCourseChaptersFrameSchema.safeParse(body)
    if (!parsed.success) return
    await updateChaptersMutation.mutateAsync(parsed.data)
    router.push(`${PATH.STUDIO}/courses/${courseId}/edit/step3`)
  }

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-8'>
      <div className='space-y-2'>
        <button
          type='button'
          onClick={() => router.push(`${PATH.STUDIO}/courses/${courseId}/edit/step1`)}
          className='flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors'
        >
          <ChevronLeft className='w-4 h-4 mr-1' />
          Quay lại bước trước
        </button>
        <h1 className='text-3xl font-bold tracking-tight'>Chỉnh sửa khóa học</h1>
        <p className='text-muted-foreground'>Cập nhật cấu trúc chương học.</p>
      </div>

      <CourseStepper currentStep={2} />

      <Card className='p-6 space-y-4'>
        <h3 className='font-semibold text-lg'>Thêm chương mới</h3>
        <div className='flex gap-3'>
          <Input
            id='chapter-name'
            placeholder='Ví dụ: Giới thiệu khóa học'
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            onKeyDown={handleKeyDown}
            className='h-11'
          />
          <Button onClick={addChapter} className='shrink-0'>
            <Plus className='w-4 h-4 mr-2' />
            Thêm
          </Button>
        </div>
      </Card>

      <Card className='p-6 space-y-4'>
        <h3 className='font-semibold text-lg'>Danh sách chương ({chapters.length})</h3>
        {chapters.length === 0 ? (
          <p className='text-sm text-muted-foreground text-center py-8'>Chưa có chương nào.</p>
        ) : (
          <div className='space-y-3'>
            {chapters.map((chapter, index) => (
              <div key={chapter.id} className='flex items-center justify-between border rounded-lg p-4 bg-secondary/30'>
                <div className='flex items-center gap-3'>
                  <GripVertical className='w-4 h-4 text-muted-foreground cursor-move' />
                  <div>
                    <p className='text-xs font-semibold text-primary uppercase'>Chương {index + 1}</p>
                    <p className='font-medium'>{chapter.title}</p>
                  </div>
                </div>

                <div className='flex items-center gap-1'>
                  <Button variant='ghost' size='icon' disabled>
                    <Pencil className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-destructive hover:text-destructive'
                    onClick={() => deleteChapter(chapter.id)}
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className='flex border-t justify-between pt-6'>
        <Button variant='outline' onClick={() => router.push(`${PATH.STUDIO}/courses/${courseId}/edit/step1`)}>
          <ChevronLeft className='w-4 h-4 mr-1' />
          Quay lại
        </Button>
        <Button onClick={onNext} disabled={updateChaptersMutation.isPending}>
          Tiếp theo: Giá & Xuất bản
          <ArrowRight className='w-4 h-4 ml-2' />
        </Button>
      </div>
    </div>
  )
}
