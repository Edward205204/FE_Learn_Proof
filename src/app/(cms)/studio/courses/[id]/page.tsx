'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Plus, GripVertical, Pencil, Trash2, FileText, LayoutGrid, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useGetManagerCourseDetailQuery, useRenameChapterMutation, useUpdateCourseChaptersFrameMutation } from '@/app/(cms)/_hooks/use-course-mutation'
import { useReorderQueue } from '@/app/(cms)/_hooks/use-reorder'
import Link from 'next/link'
import { PATH } from '@/constants/path'
import { useQuery } from '@tanstack/react-query'
import lessonApi from '@/app/(cms)/_api/lesson.api'
import dynamic from 'next/dynamic'
import { PlayCircle } from 'lucide-react'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as React.ComponentType<{
  url: string
  width?: string | number
  height?: string | number
  controls?: boolean
  playing?: boolean
}>

interface LessonItem {
  id: string
  title: string
  type?: string
}

interface ChapterItem {
  id: string
  title: string
  lessons: LessonItem[]
}

export default function ChaptersPage() {
  const params = useParams<{ id: string }>()
  const courseId = params.id

  const { data: courseDetail } = useGetManagerCourseDetailQuery(courseId)
  const { mutate: updateChaptersFrame, isPending: isUpdating } = useUpdateCourseChaptersFrameMutation(courseId)

  const mappedChaptersFromServer: ChapterItem[] = useMemo(() => {
    if (!courseDetail) return []
    return courseDetail.chapters.map((ch) => ({
      id: ch.id,
      title: ch.title,
      lessons: ch.lessons.map((ls) => ({
        id: ls.id,
        title: ls.title,
        type: ls.type
      }))
    }))
  }, [courseDetail])

  const [chapters, setChapters] = useState<ChapterItem[]>(mappedChaptersFromServer)
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({})
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false)
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false)
  const [inputText, setInputText] = useState('')
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null)
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)
  const [previewLessonId, setPreviewLessonId] = useState<string | null>(null)

  const { data: previewLesson, isFetching: isFetchingPreview } = useQuery({
    queryKey: ['lesson-preview', previewLessonId],
    queryFn: () => lessonApi.getLessonDetail(previewLessonId!).then((res) => res.data),
    enabled: !!previewLessonId
  })

  const renameChapterMutation = useRenameChapterMutation(courseId)

  useEffect(() => {
    if (!mappedChaptersFromServer.length) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChapters((prev) => (prev.length === 0 ? mappedChaptersFromServer : prev))
    setExpandedChapters((prev) => {
      const next: Record<string, boolean> = { ...prev }
      mappedChaptersFromServer.forEach((ch) => {
        if (next[ch.id] === undefined) next[ch.id] = false
      })
      return next
    })
  }, [mappedChaptersFromServer])

  const handleOpenChapterDialog = (chapter?: ChapterItem) => {
    if (chapter) {
      setActiveChapterId(chapter.id)
      setInputText(chapter.title)
    } else {
      setActiveChapterId(null)
      setInputText('')
    }
    setIsChapterDialogOpen(true)
  }

  const handleSaveChapter = () => {
    if (!inputText.trim()) return

    if (activeChapterId) {
      // Gọi API đổi tên chapter thật sự
      renameChapterMutation.mutate(
        { chapterId: activeChapterId, title: inputText.trim() },
        {
          onSuccess: () => {
            // Cập nhật local state ngay để UI phản hồi nhanh (optimistic)
            setChapters(chapters.map((ch) => (ch.id === activeChapterId ? { ...ch, title: inputText.trim() } : ch)))
            setIsChapterDialogOpen(false)
            setInputText('')
          }
        }
      )
    } else {
      setChapters([...chapters, { id: `ch-${Date.now()}`, title: inputText, lessons: [] }])
      toast.success('Đã thêm chương mới')
      setIsChapterDialogOpen(false)
      setInputText('')
    }
  }

  const handleOpenLessonDialog = (chapterId: string, lesson?: LessonItem) => {
    setActiveChapterId(chapterId)
    if (lesson) {
      setActiveLessonId(lesson.id)
      setInputText(lesson.title)
    } else {
      setActiveLessonId(null)
      setInputText('')
    }
    setIsLessonDialogOpen(true)
  }

  const handleSaveLesson = () => {
    if (!inputText.trim() || !activeChapterId) return

    const updatedChapters = chapters.map((ch) => {
      if (ch.id === activeChapterId) {
        if (activeLessonId) {
          return {
            ...ch,
            lessons: ch.lessons.map((ls) => (ls.id === activeLessonId ? { ...ls, title: inputText } : ls))
          }
        } else {
          return {
            ...ch,
            lessons: [...ch.lessons, { id: `ls-${Date.now()}`, title: inputText }]
          }
        }
      }
      return ch
    })
    setChapters(updatedChapters)
    toast.success(activeLessonId ? 'Đã cập nhật bài học' : 'Đã thêm bài học')
    setIsLessonDialogOpen(false)
    setInputText('')
  }

  const lastConfirmedRef = useRef<ChapterItem[]>(chapters)
  useEffect(() => {
    if (mappedChaptersFromServer.length) {
      lastConfirmedRef.current = mappedChaptersFromServer
    }
  }, [mappedChaptersFromServer])

  const handleRollback = useCallback(() => {
    setChapters(lastConfirmedRef.current)
  }, [])

  const handleSaveFrame = () => {
    const payload = {
      chapterList: chapters.map((ch, cIndex) => ({
        title: ch.title,
        order: cIndex + 1,
        lessons: ch.lessons.map((ls, lIndex) => ({
          title: ls.title,
          order: lIndex + 1,
          type: 'VIDEO' as const // Mặc định type là VIDEO nếu tạo nhanh qua UI frame
        }))
      }))
    }
    updateChaptersFrame(payload)
  }

  const { enqueue } = useReorderQueue(handleRollback)

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }))
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    if (type === 'chapter') {
      const newChapters = Array.from(chapters)
      const [movedChapter] = newChapters.splice(source.index, 1)
      newChapters.splice(destination.index, 0, movedChapter)
      setChapters(newChapters)

      const destIdx = destination.index
      enqueue({
        kind: 'chapter',
        payload: {
          courseId,
          chapterId: movedChapter.id,
          prevChapterId: destIdx > 0 ? newChapters[destIdx - 1].id : null,
          nextChapterId: destIdx < newChapters.length - 1 ? newChapters[destIdx + 1].id : null
        }
      })
      return
    }

    if (type === 'lesson') {
      const sourceChapter = chapters.find((ch) => ch.id === source.droppableId)
      const destChapter = chapters.find((ch) => ch.id === destination.droppableId)
      if (!sourceChapter || !destChapter) return

      let newChapters: ChapterItem[]
      let targetLessons: LessonItem[]
      let movedLessonId: string

      if (source.droppableId === destination.droppableId) {
        const newLessons = Array.from(sourceChapter.lessons)
        const [movedLesson] = newLessons.splice(source.index, 1)
        newLessons.splice(destination.index, 0, movedLesson)
        movedLessonId = movedLesson.id
        targetLessons = newLessons
        newChapters = chapters.map((ch) => (ch.id === sourceChapter.id ? { ...ch, lessons: newLessons } : ch))
      } else {
        const sourceLessons = Array.from(sourceChapter.lessons)
        const [movedLesson] = sourceLessons.splice(source.index, 1)
        const destLessons = Array.from(destChapter.lessons)
        destLessons.splice(destination.index, 0, movedLesson)
        movedLessonId = movedLesson.id
        targetLessons = destLessons

        setExpandedChapters((prev) => ({ ...prev, [destChapter.id]: true }))

        newChapters = chapters.map((ch) => {
          if (ch.id === sourceChapter.id) return { ...ch, lessons: sourceLessons }
          if (ch.id === destChapter.id) return { ...ch, lessons: destLessons }
          return ch
        })
      }

      setChapters(newChapters)

      const destIdx = destination.index
      enqueue({
        kind: 'lesson',
        payload: {
          courseId,
          lessonId: movedLessonId,
          targetChapterId: destination.droppableId,
          prevLessonId: destIdx > 0 ? targetLessons[destIdx - 1].id : null,
          nextLessonId: destIdx < targetLessons.length - 1 ? targetLessons[destIdx + 1].id : null
        }
      })
    }
  }

  const totalLessons = chapters.reduce((acc, ch) => acc + ch.lessons.length, 0)

  return (
    <div className='p-8 max-w-5xl mx-auto space-y-8 text-foreground'>
      <div className='flex justify-between items-center border-b pb-6'>
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight'>{courseDetail?.title}</h1>
          <p className='text-muted-foreground mt-1'>
            {chapters.length} chương · {totalLessons} bài học
          </p>
        </div>
        <div className='flex gap-3'>
          <Button variant='outline' onClick={() => handleOpenChapterDialog()} className='shadow-sm'>
            <Plus className='w-4 h-4 mr-2' /> Thêm chương
          </Button>
          <Button onClick={handleSaveFrame} disabled={isUpdating} className='shadow-lg px-6'>
            {isUpdating ? 'Đang lưu...' : 'Lưu cấu trúc khóa học'}
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='chapters' type='chapter'>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className='space-y-6'>
              {chapters.map((chapter, index) => (
                <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className='border-2 shadow-sm bg-card group'
                    >
                      <div
                        className='flex items-center justify-between p-4 bg-muted/20 border-b cursor-pointer select-none'
                        onClick={() => toggleChapter(chapter.id)}
                      >
                        <div className='flex items-center gap-4'>
                          <div
                            {...provided.dragHandleProps}
                            className='text-muted-foreground hover:text-primary transition-colors cursor-grab p-1'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <LayoutGrid className='w-5 h-5' />
                          </div>
                          {expandedChapters[chapter.id] ? (
                            <ChevronDown className='w-4 h-4 text-muted-foreground' />
                          ) : (
                            <ChevronRight className='w-4 h-4 text-muted-foreground' />
                          )}
                          <h3 className='font-bold text-lg uppercase tracking-wide'>
                            Chương {index + 1}: {chapter.title}
                          </h3>
                        </div>

                        <div className='flex items-center gap-2' onClick={(e) => e.stopPropagation()}>
                          <Button asChild variant='outline' size='sm' className='h-8 bg-background cursor-pointer'>
                            <Link href={`${PATH.CREATE_LESSON.replace(':id', courseId)}?chapterId=${chapter.id}`}>
                              <Plus className='w-3.5 h-3.5 mr-1' /> Soạn bài học
                            </Link>
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8'
                            onClick={() => handleOpenChapterDialog(chapter)}
                          >
                            <Pencil className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-destructive'
                            onClick={() => setChapters(chapters.filter((ch) => ch.id !== chapter.id))}
                          >
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </div>
                      </div>

                      {expandedChapters[chapter.id] && (
                        <Droppable droppableId={chapter.id} type='lesson'>
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className={`p-4 space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5' : 'bg-transparent'}`}
                            >
                              {chapter.lessons.map((lesson, lIndex) => (
                                <Draggable key={lesson.id} draggableId={lesson.id} index={lIndex}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className='flex items-center gap-3 p-3 ml-6 bg-card border rounded-lg shadow-sm hover:border-primary/50 transition-all group/lesson'
                                    >
                                      <GripVertical className='w-4 h-4 text-muted-foreground/50' />
                                      <FileText className='w-4 h-4 text-primary/60' />
                                      <span className='text-sm font-medium flex-1'>
                                        Bài {lIndex + 1}: {lesson.title}
                                      </span>
                                      <div className='flex opacity-0 group-hover/lesson:opacity-100 transition-opacity'>
                                        {lesson.type === 'VIDEO' && (
                                          <Button
                                            variant='ghost'
                                            size='icon'
                                            className='h-7 w-7 text-primary hover:bg-primary/10'
                                            onClick={() => setPreviewLessonId(lesson.id)}
                                            title='Xem trước Video'
                                          >
                                            <PlayCircle className='w-4 h-4' />
                                          </Button>
                                        )}
                                        <Link
                                          href={`${PATH.CREATE_LESSON.replace(':id', courseId)}?chapterId=${chapter.id}&lessonId=${lesson.id}`}
                                          className='h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors'
                                        >
                                          <Pencil className='size-4' />
                                        </Link>
                                        <Button
                                          variant='ghost'
                                          size='icon'
                                          className='h-7 w-7 text-destructive'
                                          onClick={() => {
                                            setChapters(
                                              chapters.map((ch) =>
                                                ch.id === chapter.id
                                                  ? { ...ch, lessons: ch.lessons.filter((ls) => ls.id !== lesson.id) }
                                                  : ch
                                              )
                                            )
                                          }}
                                        >
                                          <Trash2 className='w-3.5 h-3.5' />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      )}
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Chapter Dialog (Edit/Add) */}
      <Dialog open={isChapterDialogOpen} onOpenChange={setIsChapterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeChapterId ? 'Sửa tên chương' : 'Thêm chương mới'}</DialogTitle>
          </DialogHeader>
          <Input
            placeholder='Tên chương...'
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveChapter()}
          />
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsChapterDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveChapter} disabled={renameChapterMutation.isPending}>
              {renameChapterMutation.isPending ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog (Edit/Add) */}
      <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeLessonId ? 'Sửa bài học' : 'Thêm bài học mới'}</DialogTitle>
          </DialogHeader>
          <Input
            placeholder='Tên bài học...'
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveLesson()}
          />
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsLessonDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveLesson}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Preview Dialog */}
      <Dialog open={!!previewLessonId} onOpenChange={(open) => !open && setPreviewLessonId(null)}>
        <DialogContent className='max-w-4xl bg-black border-border shadow-2xl overflow-hidden p-0 gap-0 sm:rounded-2xl'>
          <DialogHeader className='opacity-0 absolute p-0 m-0 h-0 w-0'>
            <DialogTitle>Video Preview</DialogTitle>
          </DialogHeader>
          <div className='relative aspect-video w-full bg-black/90 flex items-center justify-center'>
            {isFetchingPreview ? (
              <div className='text-white flex items-center gap-2'>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                <span className='font-medium'>Đang tải video...</span>
              </div>
            ) : previewLesson?.type === 'VIDEO' && previewLesson.videoUrl ? (
              <ReactPlayer url={previewLesson.videoUrl} width='100%' height='100%' controls playing />
            ) : (
              <div className='text-muted-foreground font-medium'>Không tìm thấy video hợp lệ.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
