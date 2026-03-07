'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Plus, GripVertical, Pencil, Trash2, FileText, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface Lesson {
  id: string
  title: string
}

interface Chapter {
  id: string
  title: string
  lessons: Lesson[]
}

const initialData: Chapter[] = [
  {
    id: 'ch-1',
    title: 'Chương 1: Tổng quan dự án',
    lessons: [
      { id: 'ls-1', title: 'Bài 1.1: Setup môi trường' },
      { id: 'ls-2', title: 'Bài 1.2: Cấu trúc thư mục' }
    ]
  }
]

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>(initialData)
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false)
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false)
  const [inputText, setInputText] = useState('')
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null)
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)

  const handleOpenChapterDialog = (chapter?: Chapter) => {
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
      setChapters(chapters.map((ch) => (ch.id === activeChapterId ? { ...ch, title: inputText } : ch)))
      toast.success('Đã cập nhật tên chương')
    } else {
      setChapters([...chapters, { id: `ch-${Date.now()}`, title: inputText, lessons: [] }])
      toast.success('Đã thêm chương mới')
    }
    setIsChapterDialogOpen(false)
    setInputText('')
  }

  const handleOpenLessonDialog = (chapterId: string, lesson?: Lesson) => {
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

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    if (type === 'chapter') {
      const newChapters = Array.from(chapters)
      const [reorderedChapter] = newChapters.splice(source.index, 1)
      newChapters.splice(destination.index, 0, reorderedChapter)
      setChapters(newChapters)
    } else {
      const sourceChapter = chapters.find((ch) => ch.id === source.droppableId)
      const destChapter = chapters.find((ch) => ch.id === destination.droppableId)
      if (!sourceChapter || !destChapter) return

      if (source.droppableId === destination.droppableId) {
        const newLessons = Array.from(sourceChapter.lessons)
        const [reorderedLesson] = newLessons.splice(source.index, 1)
        newLessons.splice(destination.index, 0, reorderedLesson)
        setChapters(chapters.map((ch) => (ch.id === sourceChapter.id ? { ...ch, lessons: newLessons } : ch)))
      } else {
        const sourceLessons = Array.from(sourceChapter.lessons)
        const [movedLesson] = sourceLessons.splice(source.index, 1)
        const destLessons = Array.from(destChapter.lessons)
        destLessons.splice(destination.index, 0, movedLesson)
        setChapters(
          chapters.map((ch) => {
            if (ch.id === sourceChapter.id) return { ...ch, lessons: sourceLessons }
            if (ch.id === destChapter.id) return { ...ch, lessons: destLessons }
            return ch
          })
        )
      }
    }
  }

  return (
    <div className='p-8 max-w-5xl mx-auto space-y-8 text-foreground'>
      <div className='flex justify-between items-center border-b pb-6'>
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight'>Cấu trúc khóa học</h1>
          <p className='text-muted-foreground mt-1'>Quản lý và sắp xếp nội dung.</p>
        </div>
        <Button onClick={() => handleOpenChapterDialog()} className='shadow-lg'>
          <Plus className='w-4 h-4 mr-2' /> Thêm chương
        </Button>
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
                      <div className='flex items-center justify-between p-4 bg-muted/20 border-b'>
                        <div className='flex items-center gap-4'>
                          <div
                            {...provided.dragHandleProps}
                            className='text-muted-foreground hover:text-primary transition-colors cursor-grab p-1'
                          >
                            <LayoutGrid className='w-5 h-5' />
                          </div>
                          <h3 className='font-bold text-lg uppercase tracking-wide'>{chapter.title}</h3>
                        </div>

                        <div className='flex items-center gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            className='h-8 bg-background'
                            onClick={() => handleOpenLessonDialog(chapter.id)}
                          >
                            <Plus className='w-3.5 h-3.5 mr-1' /> Bài học
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
                                    <span className='text-sm font-medium flex-1'>{lesson.title}</span>
                                    <div className='flex opacity-0 group-hover/lesson:opacity-100 transition-opacity'>
                                      <Button
                                        variant='ghost'
                                        size='icon'
                                        className='h-7 w-7'
                                        onClick={() => handleOpenLessonDialog(chapter.id, lesson)}
                                      >
                                        <Pencil className='w-3.5 h-3.5' />
                                      </Button>
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
            <Button onClick={handleSaveChapter}>Lưu</Button>
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
    </div>
  )
}
