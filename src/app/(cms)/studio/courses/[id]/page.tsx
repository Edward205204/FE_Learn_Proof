'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import {
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  FileText,
  LayoutGrid,
  ChevronDown,
  ChevronRight,
  Video,
  HelpCircle,
  Clock,
  X,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  useGetManagerCourseDetailQuery,
  useCompleteCourseMutation,
  useRenameChapterMutation,
  useUpdateCourseChaptersFrameMutation,
  useDeleteChapterMutation
} from '@/app/(cms)/_hooks/use-course-mutation'
import { useDeleteLessonMutation } from '@/app/(cms)/_hooks/use-lesson'
import { useReorderQueue } from '@/app/(cms)/_hooks/use-reorder'
import Link from 'next/link'
import { PATH } from '@/constants/path'
import { EditLessonMetadataDialog } from '@/app/(cms)/_components/edit-lesson-metadata-dialog'
import { EditCourseMetadataDialog } from '@/app/(cms)/_components/edit-course-metadata-dialog'
import { EditCourseStatusDialog } from '@/app/(cms)/_components/edit-course-status-dialog'
import { EditCourseThumbnailDialog } from '@/app/(cms)/_components/edit-course-thumbnail-dialog'
import { useQuery } from '@tanstack/react-query'
import lessonApi from '@/app/(cms)/_api/lesson.api'
import { PlayCircle } from 'lucide-react'
import { VideoPlayer } from '@/app/(learner)/_components/video-player'

interface LessonItem {
  id: string
  title: string
  type?: string
  duration?: number | null
}

interface ChapterItem {
  id: string
  title: string
  lessons: LessonItem[]
}

const MIN_LESSONS_TO_COMPLETE = 10

export default function ChaptersPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const courseId = params.id

  const { data: courseDetail } = useGetManagerCourseDetailQuery(courseId)
  const completeCourseMutation = useCompleteCourseMutation(courseId)

  const mappedChaptersFromServer: ChapterItem[] = useMemo(() => {
    if (!courseDetail) return []
    return courseDetail.chapters.map((ch) => ({
      id: ch.id,
      title: ch.title,
      lessons: ch.lessons.map((ls) => ({
        id: ls.id,
        title: ls.title,
        type: ls.type,
        duration: ls.duration
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
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null)
  const [previewLessonId, setPreviewLessonId] = useState<string | null>(null)
  const [lessonToDelete, setLessonToDelete] = useState<LessonItem | null>(null)
  const [chapterToDelete, setChapterToDelete] = useState<ChapterItem | null>(null)

  const [isEditBaseInfoOpen, setIsEditBaseInfoOpen] = useState(false)
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false)
  const [isCompleteCourseOpen, setIsCompleteCourseOpen] = useState(false)

  const deleteLessonMutation = useDeleteLessonMutation(courseId)
  const deleteChapterMutation = useDeleteChapterMutation(courseId)

  const { data: previewLesson, isFetching: isFetchingPreview } = useQuery({
    queryKey: ['lesson-preview', previewLessonId],
    queryFn: () => lessonApi.getLessonDetail(previewLessonId!).then((res) => res.data),
    enabled: !!previewLessonId
  })

  const renameChapterMutation = useRenameChapterMutation(courseId)
  const updateCourseChaptersFrameMutation = useUpdateCourseChaptersFrameMutation(courseId)

  useEffect(() => {
    if (!mappedChaptersFromServer.length) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChapters((prev) => {
      const hasUnsavedChanges = prev.some(
        (ch) => ch.id.startsWith('ch-') || ch.lessons.some((ls) => ls.id.startsWith('ls-'))
      )
      return hasUnsavedChanges ? prev : mappedChaptersFromServer
    })
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
    const chapterTitle = inputText.trim()

    if (activeChapterId) {
      // Gọi API đổi tên chapter thật sự
      renameChapterMutation.mutate(
        { chapterId: activeChapterId, title: chapterTitle },
        {
          onSuccess: () => {
            // Cập nhật local state ngay để UI phản hồi nhanh (optimistic)
            setChapters(chapters.map((ch) => (ch.id === activeChapterId ? { ...ch, title: chapterTitle } : ch)))
            setIsChapterDialogOpen(false)
            setInputText('')
          }
        }
      )
    } else {
      updateCourseChaptersFrameMutation.mutate(
        {
          chapterList: [
            ...chapters.map((ch, index) => ({ title: ch.title, order: index + 1 })),
            {
              title: chapterTitle,
              order: chapters.length + 1
            }
          ]
        },
        {
          onSuccess: () => {
            setIsChapterDialogOpen(false)
            setInputText('')
          }
        }
      )
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
  const isCourseCompleted = Boolean((courseDetail as { isCompleted?: boolean } | null)?.isCompleted)
  const canCompleteCourse = totalLessons >= MIN_LESSONS_TO_COMPLETE

  return (
    <div className='p-8 max-w-5xl mx-auto space-y-8 text-foreground'>
      <div className='mb-8 space-y-8'>
        {/* Course Header & Metadata */}
        <div className='flex flex-col xl:flex-row xl:items-start justify-between gap-6'>
          <div className='flex-1 max-w-3xl'>
            <div className='mb-3'>
              {courseDetail?.status && (
                <Badge
                  variant={courseDetail.status === 'PUBLISHED' ? 'default' : 'secondary'}
                  className={`px-3 py-1 text-xs uppercase tracking-wider font-bold rounded-md shadow-sm ${
                    courseDetail.status === 'PUBLISHED'
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-300 gap-2'
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-300 gap-2'
                  }`}
                >
                  <span className='relative flex h-2 w-2'>
                    {courseDetail.status === 'PUBLISHED' ? (
                      <>
                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
                        <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-500'></span>
                      </>
                    ) : (
                      <>
                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75'></span>
                        <span className='relative inline-flex rounded-full h-2 w-2 bg-amber-500'></span>
                      </>
                    )}
                  </span>
                  {courseDetail.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}
                </Badge>
              )}
            </div>

            <h1 className='text-3xl font-extrabold tracking-tight text-foreground mb-4'>
              {courseDetail?.title || 'Đang tải...'}
            </h1>

            <div className='flex flex-wrap items-center gap-2.5 text-[13px]'>
              <div className='flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-md border shadow-sm'>
                <span className='font-semibold text-foreground'>{chapters.length}</span>
                <span className='text-muted-foreground'>chương</span>
                <span className='text-muted-foreground/50'>•</span>
                <span className='font-semibold text-foreground'>{totalLessons}</span>
                <span className='text-muted-foreground'>bài học</span>
              </div>

              {courseDetail?.level && (
                <div className='flex items-center gap-1.5 bg-blue-50/50 dark:bg-blue-950/30 px-2.5 py-1 rounded-md border border-blue-100 dark:border-blue-900 shadow-sm'>
                  <span className='font-medium text-blue-700 dark:text-blue-400'>{courseDetail.level}</span>
                </div>
              )}

              {courseDetail?.category?.name && (
                <div className='flex items-center gap-1.5 bg-purple-50/50 dark:bg-purple-950/30 px-2.5 py-1 rounded-md border border-purple-100 dark:border-purple-900 shadow-sm'>
                  <span className='font-medium text-purple-700 dark:text-purple-400'>{courseDetail.category.name}</span>
                </div>
              )}

              {courseDetail?.isFree ? (
                <div className='flex items-center gap-1.5 bg-emerald-50/50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-900 shadow-sm'>
                  <span className='font-medium text-emerald-700 dark:text-emerald-400'>Miễn phí</span>
                </div>
              ) : courseDetail?.price !== undefined ? (
                <div className='flex items-center gap-1.5 bg-rose-50/50 dark:bg-rose-950/30 px-2.5 py-1 rounded-md border border-rose-100 dark:border-rose-900 shadow-sm'>
                  <span className='font-medium text-rose-700 dark:text-rose-400'>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(courseDetail.price)}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-3'>
            <EditCourseThumbnailDialog
              courseId={courseId}
              courseTitle={courseDetail?.title}
              thumbnail={courseDetail?.thumbnail}
              compact
            />
            <Button
              variant='outline'
              className='shadow-sm bg-background hover:bg-muted/50 transition-colors'
              onClick={() => setIsEditBaseInfoOpen(true)}
            >
              <Pencil className='w-4 h-4 mr-2 text-muted-foreground' /> Sửa thông tin
            </Button>
            <Button
              variant='outline'
              className='shadow-sm bg-background hover:bg-muted/50 transition-colors'
              onClick={() => setIsEditStatusOpen(true)}
            >
              <Settings className='w-4 h-4 mr-2 text-muted-foreground' /> Cập nhật Trạng thái
            </Button>
          </div>
        </div>

        {/* Curriculum Toolbar */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60'>
          <div>
            <h2 className='text-xl flex flex-col font-bold tracking-tight text-foreground'>Chương trình giảng dạy</h2>
            <p className='text-sm text-muted-foreground mt-1'>Quản lý các chương và bài học trong khóa học</p>
          </div>
          <div className='flex items-center gap-3'>
            <Button variant='secondary' onClick={() => handleOpenChapterDialog()} className='shadow-sm font-medium'>
              <Plus className='w-4 h-4 mr-2' /> Thêm chương
            </Button>
            <Button
              onClick={() => setIsCompleteCourseOpen(true)}
              disabled={completeCourseMutation.isPending || isCourseCompleted || !canCompleteCourse}
              className='shadow-sm px-6 font-medium bg-primary text-primary-foreground hover:bg-primary/90'
            >
              {isCourseCompleted
                ? 'Khóa học đã hoàn thiện'
                : !canCompleteCourse
                  ? `Cần tối thiểu ${MIN_LESSONS_TO_COMPLETE} bài học`
                  : completeCourseMutation.isPending
                    ? 'Đang xác nhận...'
                    : 'Xác nhận hoàn thiện khóa học'}
            </Button>
          </div>
        </div>
        {!isCourseCompleted && !canCompleteCourse && (
          <p className='text-xs text-muted-foreground'>
            Bạn hiện có <strong>{totalLessons}</strong> bài học. Cần tối thiểu{' '}
            <strong>{MIN_LESSONS_TO_COMPLETE}</strong> bài học để hoàn thiện khóa học.
          </p>
        )}
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
                            onClick={() => {
                              if (chapter.id.startsWith('ch-')) {
                                setChapters(chapters.filter((ch) => ch.id !== chapter.id))
                              } else {
                                setChapterToDelete(chapter)
                              }
                            }}
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
                                      {lesson.type === 'VIDEO' ? (
                                        <Video className='w-4 h-4 text-rose-500' />
                                      ) : lesson.type === 'QUIZ' ? (
                                        <HelpCircle className='w-4 h-4 text-amber-500' />
                                      ) : (
                                        <FileText className='w-4 h-4 text-blue-500' />
                                      )}
                                      <span className='text-sm font-medium flex-1 flex items-center gap-2'>
                                        <span className='truncate max-w-[200px] sm:max-w-xs md:max-w-sm lg:max-w-md'>
                                          Bài {lIndex + 1}: {lesson.title}
                                        </span>
                                        {lesson.type === 'VIDEO' && lesson.duration != null && (
                                          <span className='inline-flex items-center gap-1 text-[10px] bg-rose-500/10 text-rose-600 px-1.5 py-0.5 rounded font-semibold shrink-0'>
                                            <Clock className='w-3 h-3' />
                                            {Math.floor(lesson.duration / 60)}:
                                            {(lesson.duration % 60).toString().padStart(2, '0')}
                                          </span>
                                        )}
                                        {lesson.type === 'QUIZ' && (
                                          <span className='inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-semibold shrink-0'>
                                            Quiz
                                          </span>
                                        )}
                                        {lesson.type === 'TEXT' && (
                                          <span className='inline-flex items-center gap-1 text-[10px] bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded font-semibold shrink-0'>
                                            Văn bản
                                          </span>
                                        )}
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
                                        <Button
                                          variant='ghost'
                                          size='icon'
                                          className='h-7 w-7 text-muted-foreground hover:text-primary transition-colors'
                                          onClick={() => {
                                            if (lesson.id.startsWith('ls-')) {
                                              handleOpenLessonDialog(chapter.id, lesson)
                                            } else if (lesson.type === 'TEXT') {
                                              // TEXT lesson → trang editor blog riêng
                                              router.push(`/studio/courses/${courseId}/lesson/${lesson.id}/edit`)
                                            } else {
                                              // VIDEO / QUIZ → dialog popup
                                              setEditingLessonId(lesson.id)
                                            }
                                          }}
                                          title='Chỉnh sửa thông tin bài học'
                                        >
                                          <Pencil className='size-4' />
                                        </Button>
                                        <Button
                                          variant='ghost'
                                          size='icon'
                                          className='h-7 w-7 text-destructive'
                                          onClick={() => {
                                            if (lesson.id.startsWith('ls-')) {
                                              setChapters(
                                                chapters.map((ch) =>
                                                  ch.id === chapter.id
                                                    ? { ...ch, lessons: ch.lessons.filter((ls) => ls.id !== lesson.id) }
                                                    : ch
                                                )
                                              )
                                            } else {
                                              setLessonToDelete(lesson)
                                            }
                                          }}
                                          title={lesson.id.startsWith('ls-') ? 'Xóa bài học chưa lưu' : 'Xóa bài học'}
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
            <Button
              onClick={handleSaveChapter}
              disabled={renameChapterMutation.isPending || updateCourseChaptersFrameMutation.isPending}
            >
              {renameChapterMutation.isPending || updateCourseChaptersFrameMutation.isPending ? 'Đang lưu...' : 'Lưu'}
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
        <DialogContent className='max-w-[95vw] md:max-w-5xl lg:max-w-6xl xl:max-w-7xl bg-black border border-white/10 shadow-2xl overflow-hidden p-0 gap-0 sm:rounded-2xl'>
          <DialogHeader className='opacity-0 absolute p-0 m-0 h-0 w-0'>
            <DialogTitle>Video Preview</DialogTitle>
          </DialogHeader>

          {/* Nút Close to, nổi bật */}
          <Button
            variant='ghost'
            onClick={() => setPreviewLessonId(null)}
            className='absolute top-3 right-3 z-50 bg-black/40 hover:bg-red-600 hover:text-white text-white/80 rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 backdrop-blur-sm shadow-xl border border-white/10 group'
            title='Đóng video'
          >
            <X className='w-7! h-7! transition-transform group-hover:scale-110 group-hover:rotate-90' />
          </Button>

          <div className='relative aspect-video w-full bg-[#0a0a0a] flex items-center justify-center'>
            {isFetchingPreview ? (
              <div className='text-white flex flex-col items-center gap-3'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
                <span className='font-medium opacity-80 tracking-wide'>Đang tải video...</span>
              </div>
            ) : !!previewLessonId && previewLesson?.type === 'VIDEO' && previewLesson.videoUrl ? (
              <div className='w-full h-full relative group'>
                <VideoPlayer url={previewLesson.videoUrl} lessonId={previewLesson.id} lastPosition={0} />
              </div>
            ) : (
              <div className='text-muted-foreground font-medium'>Không tìm thấy video hoặc bản xem trước đã đóng.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Lesson Confirmation Dialog */}
      <Dialog open={!!lessonToDelete} onOpenChange={(open) => !open && setLessonToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa bài học</DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            Bạn có chắc chắn muốn xóa bài học <span className='font-bold'>{lessonToDelete?.title}</span> không? Hành
            động này không thể hoàn tác.
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setLessonToDelete(null)} disabled={deleteLessonMutation.isPending}>
              Hủy
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                if (lessonToDelete) {
                  deleteLessonMutation.mutate(lessonToDelete.id, {
                    onSuccess: () => {
                      setChapters(
                        chapters.map((ch) => ({
                          ...ch,
                          lessons: ch.lessons.filter((ls) => ls.id !== lessonToDelete.id)
                        }))
                      )
                      setLessonToDelete(null)
                    }
                  })
                }
              }}
              disabled={deleteLessonMutation.isPending}
            >
              {deleteLessonMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Chapter Confirmation Dialog */}
      <Dialog open={!!chapterToDelete} onOpenChange={(open) => !open && setChapterToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa chương</DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            Bạn có chắc chắn muốn xóa chương <span className='font-bold'>{chapterToDelete?.title}</span> không? Hành
            động này không thể hoàn tác.
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setChapterToDelete(null)}
              disabled={deleteChapterMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                if (chapterToDelete) {
                  deleteChapterMutation.mutate(chapterToDelete.id, {
                    onSuccess: () => {
                      setChapters(chapters.filter((ch) => ch.id !== chapterToDelete.id))
                      setChapterToDelete(null)
                    }
                  })
                }
              }}
              disabled={deleteChapterMutation.isPending}
            >
              {deleteChapterMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCompleteCourseOpen} onOpenChange={setIsCompleteCourseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hoàn thiện khóa học</DialogTitle>
          </DialogHeader>
          <div className='py-2 text-sm text-muted-foreground leading-relaxed'>
            Bạn xác nhận khóa học này đã hoàn thiện nội dung? Hệ thống yêu cầu tối thiểu{' '}
            <strong>{MIN_LESSONS_TO_COMPLETE}</strong> bài học trước khi đánh dấu hoàn thiện.
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsCompleteCourseOpen(false)}
              disabled={completeCourseMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={() =>
                completeCourseMutation.mutate(undefined, {
                  onSuccess: () => setIsCompleteCourseOpen(false)
                })
              }
              disabled={completeCourseMutation.isPending}
            >
              {completeCourseMutation.isPending ? 'Đang xử lý...' : 'Xác nhận hoàn thiện'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditLessonMetadataDialog
        lessonId={editingLessonId}
        open={!!editingLessonId}
        onOpenChange={(open) => !open && setEditingLessonId(null)}
      />

      {/* Course Edit Dialogs */}
      <EditCourseMetadataDialog courseId={courseId} open={isEditBaseInfoOpen} onOpenChange={setIsEditBaseInfoOpen} />

      <EditCourseStatusDialog courseId={courseId} open={isEditStatusOpen} onOpenChange={setIsEditStatusOpen} />
    </div>
  )
}
