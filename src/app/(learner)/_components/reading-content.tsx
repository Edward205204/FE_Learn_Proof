'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Clock, CheckCircle2, Download, FileText, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ReadingLesson } from '../_utils/lesson-types'

interface ReadingContentProps {
  lesson: ReadingLesson
  onComplete?: () => void
}

export function ReadingContent({ lesson, onComplete }: ReadingContentProps) {
  return (
    <div className='space-y-6'>
      {/* Card nội dung chính */}
      <div className='bg-background rounded-xl border border-border shadow-sm overflow-hidden'>
        {/* Header */}
        <div className='px-10 pt-10 pb-6 border-b border-border'>
          <div className='flex items-center gap-2 mb-4'>
            <span className='inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20'>
              <BookOpen size={11} />
              Bài đọc
            </span>
            <span className='inline-flex items-center gap-1 text-[11px] text-muted-foreground font-medium'>
              <Clock size={11} />~{lesson.estimatedMinutes} phút
            </span>
          </div>
          <h1 className='text-3xl font-bold text-foreground leading-tight tracking-tight'>{lesson.title}</h1>
        </div>

        {/* Nội dung bài đọc */}
        <div className='px-10 py-8 text-foreground/90 text-[15px] leading-[1.9] whitespace-pre-line'>
          {lesson.content}
        </div>
      </div>

      {/* Tài liệu đính kèm (nếu có) */}
      {lesson.materials && lesson.materials.length > 0 && (
        <div className='space-y-3 pt-4'>
          <h3 className='text-xs font-bold uppercase tracking-widest text-muted-foreground px-1'>Tài liệu đính kèm</h3>
          {lesson.materials.map((file, idx) => (
            <a
              key={idx}
              href={file.url}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center justify-between p-4 bg-background border border-border rounded-xl hover:border-primary/50 transition-all group shadow-sm'
            >
              <div className='flex items-center gap-3'>
                <div className='h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors'>
                  <FileText size={20} />
                </div>
                <div>
                  <p className='text-sm font-semibold text-foreground group-hover:text-primary transition-colors'>
                    {file.title}
                  </p>
                  <p className='text-[10px] text-muted-foreground uppercase font-mono mt-0.5'>{file.size}</p>
                </div>
              </div>
              <Download size={18} className='text-muted-foreground/50 group-hover:text-primary transition-colors' />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
