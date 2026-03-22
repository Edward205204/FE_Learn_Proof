'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, Pencil, Trash2, GripVertical, Plus, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PATH } from '@/constants/path'
import { CoursePageShell } from '@/app/(cms)/_components/course-page-shell'
import { updateCourseChaptersFrameSchema, type UpdateCourseChaptersFrameBody } from '@/app/(cms)/_utils/zod'
import { useUpdateCourseChaptersFrameMutation } from '@/app/(cms)/_hooks/use-course-mutation'
import { getDraftCourseId, persistDraftCourseId } from '@/app/(cms)/_utils/course-workflow'

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
  const searchParams = useSearchParams()
  const courseId = getDraftCourseId(searchParams)

  useEffect(() => {
    if (!courseId) router.replace(PATH.COURSE_NEW_STEP1)
  }, [courseId, router])

  const [chapterName, setChapterName] = useState('')
  const [chapters, setChapters] = useState<Chapter[]>(DEFAULT_CHAPTERS)
  const updateChaptersMutation = useUpdateCourseChaptersFrameMutation(courseId ?? '')

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

  const onNext = async () => {
    if (!courseId) return
    const body: UpdateCourseChaptersFrameBody = {
      chapterList: chapters.map((ch, index) => ({ title: ch.title, order: index + 1 }))
    }
    const parsed = updateCourseChaptersFrameSchema.safeParse(body)
    if (!parsed.success) {
      toast.error('Dữ liệu không hợp lệ', { description: 'Vui lòng kiểm tra lại danh sách chương.' })
      return
    }
    
    try {
      await updateChaptersMutation.mutateAsync(parsed.data)
      persistDraftCourseId(courseId)
      router.push(`${PATH.COURSE_NEW_STEP3}?courseId=${courseId}`)
    } catch (error) {
      toast.error('Lưu thất bại', { description: 'Đã có lỗi xảy ra khi lưu chương học. Vui lòng thử lại.' })
    }
  }

  return (
    <CoursePageShell
      currentStep={2}
      backLabel='Quay lại Thông tin cơ bản'
      title='Chương học'
      description='Thiết kế cấu trúc khóa học bằng cách phân chia nội dung thành các chương học mạch lạc.'
      onBack={() => router.push(`${PATH.COURSE_NEW_STEP1}${courseId ? `?courseId=${courseId}` : ''}`)}
    >
      <div className='space-y-8'>
        <Card className='border border-border/60 shadow-sm rounded-3xl overflow-hidden bg-card'>
          <div className='p-6 sm:p-10 space-y-6'>
            <div className='flex items-start gap-5'>
              <div className='h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 ring-1 ring-primary/20 shadow-sm'>
                <Plus className='h-7 w-7' />
              </div>
              <div className='pt-1'>
                <h3 className='font-extrabold text-2xl tracking-tight text-foreground'>Thêm chương mới</h3>
                <p className='text-muted-foreground font-medium mt-1'>Nhập tên chương để thêm vào cấu trúc khóa học.</p>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-3 pt-2'>
              <Input
                id='chapter-name'
                placeholder='Ví dụ: Chương 1: Giới thiệu tổng quan'
                value={chapterName}
                onChange={(e) => setChapterName(e.target.value)}
                onKeyDown={handleKeyDown}
                className='h-12 text-base font-medium rounded-xl border-border/50 focus-visible:ring-primary/20 bg-muted/10 flex-1'
              />
              <Button onClick={() => addChapter()} className='h-12 px-8 rounded-xl font-bold shadow-md shrink-0 bg-primary hover:bg-primary/90'>
                <Plus className='w-5 h-5 mr-2' />
                Thêm Chương
              </Button>
            </div>
          </div>
        </Card>

        <Card className='border border-border/60 shadow-sm rounded-3xl overflow-hidden bg-card'>
          <div className='p-6 sm:p-10 space-y-6'>
            <div className='flex items-center justify-between'>
              <h3 className='font-extrabold text-xl tracking-tight text-foreground flex items-center gap-3'>
                Danh sách chương 
                <span className='bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full ring-1 ring-primary/20'>{chapters.length}</span>
              </h3>
            </div>

            {chapters.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-16 px-4 bg-muted/10 rounded-2xl border border-dashed border-border/50'>
                <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4'>
                  <GripVertical className='w-6 h-6 text-muted-foreground/50' />
                </div>
                <p className='font-bold text-foreground'>Chưa có chương nào</p>
                <p className='text-sm text-muted-foreground mt-1'>Hãy tạo chương đầu tiên để bắt đầu xây dựng khóa học.</p>
              </div>
            ) : (
              <div className='space-y-3'>
                {chapters.map((chapter, index) => (
                  <div key={chapter.id} className='flex items-center justify-between border border-border/50 rounded-2xl p-4 bg-muted/5 hover:bg-muted/20 transition-all group'>
                    <div className='flex items-center gap-4'>
                      <div className='cursor-grab active:cursor-grabbing p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors'>
                        <GripVertical className='w-5 h-5' />
                      </div>
                      <div>
                        <p className='text-[10px] font-extrabold text-primary uppercase tracking-wider mb-0.5'>Chương {index + 1}</p>
                        <p className='font-bold text-foreground text-sm sm:text-base'>{chapter.title}</p>
                      </div>
                    </div>

                    <div className='flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity'>
                      <Button variant='ghost' size='icon' className='hover:bg-primary/10 hover:text-primary rounded-xl'>
                        <Pencil className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl'
                        onClick={() => deleteChapter(chapter.id)}
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <div className='pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4'>
          <Button
            variant='ghost'
            type='button'
            className='font-semibold text-muted-foreground w-full sm:w-auto h-11 px-6 rounded-xl hover:bg-muted'
            onClick={() => router.push(`${PATH.COURSE_NEW_STEP1}${courseId ? `?courseId=${courseId}` : ''}`)}
          >
            <ChevronLeft className='w-4 h-4 mr-2' />
            Quay lại
          </Button>
          <Button onClick={onNext} className='font-bold h-11 px-8 rounded-xl shadow-md w-full sm:w-auto' disabled={updateChaptersMutation.isPending || !courseId}>
            Tiếp theo: Giá & Xuất bản
            <ArrowRight className='w-5 h-5 ml-2' />
          </Button>
        </div>
      </div>
    </CoursePageShell>
  )
}
