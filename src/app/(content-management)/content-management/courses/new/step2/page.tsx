'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Pencil, Trash2, GripVertical, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PATH } from '@/constants/path'
import { CourseStepper } from '@/app/(content-management)/_components/course-stepper'

interface Chapter {
  id: number
  title: string
}

const DEFAULT_CHAPTERS: Chapter[] = [
  { id: 1, title: 'Giới thiệu khóa học' },
  { id: 2, title: 'Kiến thức nền tảng' },
  { id: 3, title: 'Thực hành & Bài tập' }
]

export default function CreateCourseStep2Page() {
  const router = useRouter()
  const [chapterName, setChapterName] = useState('')
  const [chapters, setChapters] = useState<Chapter[]>(DEFAULT_CHAPTERS)

  const addChapter = () => {
    if (!chapterName.trim()) return
    setChapters([...chapters, { id: Date.now(), title: chapterName.trim() }])
    setChapterName('')
  }

  const deleteChapter = (id: number) => {
    setChapters(chapters.filter((c) => c.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addChapter()
    }
  }

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-8'>
      <div className='space-y-2'>
        <button
          type='button'
          onClick={() => router.push(PATH.COURSE_NEW_STEP1)}
          className='flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors'
        >
          <ChevronLeft className='w-4 h-4 mr-1' />
          Quay lại bước trước
        </button>
        <h1 className='text-3xl font-bold tracking-tight'>Tạo khóa học mới</h1>
        <p className='text-muted-foreground'>Thiết kế cấu trúc khóa học bằng cách thêm các chương học.</p>
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
          <p className='text-sm text-muted-foreground text-center py-8'>Chưa có chương nào. Thêm chương đầu tiên bên trên.</p>
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
                  <Button variant='ghost' size='icon'>
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
        <Button variant='outline' onClick={() => router.push(PATH.COURSE_NEW_STEP1)}>
          <ChevronLeft className='w-4 h-4 mr-1' />
          Quay lại
        </Button>
        <Button onClick={() => router.push(PATH.COURSE_NEW_STEP3)}>
          Tiếp theo: Giá & Xuất bản
          <ArrowRight className='w-4 h-4 ml-2' />
        </Button>
      </div>
    </div>
  )
}
