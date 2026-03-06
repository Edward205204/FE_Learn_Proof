'use client'

import { useState } from 'react'
import { ChevronLeft, Pencil, Trash2, GripVertical, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Chapter = {
  id: number
  title: string
}

export default function CreateCourseChapters() {
  const [chapterName, setChapterName] = useState('')
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: 1, title: 'Introduction to Design Principles' },
    { id: 2, title: 'Understanding Color Theory' },
    { id: 3, title: 'Typography Fundamentals' }
  ])

  const addChapter = () => {
    if (!chapterName.trim()) return

    const newChapter: Chapter = {
      id: Date.now(),
      title: chapterName
    }

    setChapters([...chapters, newChapter])
    setChapterName('')
  }

  const deleteChapter = (id: number) => {
    setChapters(chapters.filter((c) => c.id !== id))
  }

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-8'>
      {/* Header */}
      <div className='space-y-2'>
        <button className='flex items-center text-sm text-muted-foreground hover:text-foreground'>
          <ChevronLeft className='w-4 h-4 mr-1' />
          Back to Courses
        </button>

        <h1 className='text-3xl font-bold'>Create Course</h1>
        <p className='text-muted-foreground'>Design your course structure by adding chapters.</p>
      </div>

      {/* Progress */}
      <Card className='p-6'>
        <div className='flex justify-between text-sm font-medium'>
          <span>Step 2: Chapters Structure</span>
          <span>Step 2 of 4</span>
        </div>

        <div className='w-full flex gap-2'>
          <div className='flex-1 h-2 bg-blue-600 rounded-full'></div>
          <div className='flex-1 h-2 bg-blue-600 rounded-full'></div>
          <div className='flex-1 h-2 bg-gray-300 rounded-full'></div>
          <div className='flex-1 h-2 bg-gray-300 rounded-full'></div>
        </div>
      </Card>

      {/* Add Chapter */}
      <Card className='p-6'>
        <h3 className='font-semibold text-lg'>Add New Chapter</h3>
        <Label htmlFor='chapter-name' className='sr-only mb-0'>
          Chapter Name
        </Label>
        <div className='flex gap-3'>
          <Input
            placeholder='e.g., Introduction to the Course'
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
          />

          <Button onClick={addChapter}>
            <Plus className='w-4 h-4 mr-2' />
            Add
          </Button>
        </div>
      </Card>

      {/* Chapter List */}
      <Card className='p-6 space-y-4'>
        <h3 className='font-semibold text-lg'>Course Chapters</h3>

        <div className='space-y-3'>
          {chapters.map((chapter, index) => (
            <div key={chapter.id} className='flex items-center justify-between border rounded-lg p-4 bg-secondary/40'>
              <div className='flex items-center gap-3'>
                <GripVertical className='w-4 h-4 text-muted-foreground cursor-move' />

                <div>
                  <p className='text-xs font-semibold text-blue-600 uppercase'>Chapter {index + 1}</p>

                  <p className='font-medium'>{chapter.title}</p>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <Button variant='ghost' size='icon'>
                  <Pencil className='w-4 h-4' />
                </Button>

                <Button variant='ghost' size='icon' onClick={() => deleteChapter(chapter.id)}>
                  <Trash2 className='w-4 h-4 text-red-500' />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Footer */}
      <div className='flex  border-t justify-between pt-6'>
        <Button variant='outline'>Back</Button>

        <Button className='bg-blue-600 hover:bg-blue-700'>Next Step</Button>
      </div>
    </div>
  )
}
