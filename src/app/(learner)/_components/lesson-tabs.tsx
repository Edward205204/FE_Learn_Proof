'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Send, FileText, Download, Bot, Lock } from 'lucide-react'

import { useAuthStore } from '@/store/auth.store'
import { LessonComments } from './lesson-comments'

interface LessonTabsProps {
  courseId: string
  lessonId: string
  description: string
  materials: { title: string; size: string; url: string }[]
  isEnrolled?: boolean
}

export function LessonTabs({ lessonId, courseId, description, materials, isEnrolled = false }: LessonTabsProps) {
  const { user } = useAuthStore()
  const [aiInput, setAiInput] = useState('')

  const handleSendAi = () => {
    if (!aiInput.trim() || !isEnrolled) return
    console.log('Sending to AI:', { lessonId, userId: user?.id, content: aiInput })
    setAiInput('')
  }

  return (
    <Tabs defaultValue='description' className='w-full'>
      {/* ... (TabsList unchanged) ... */}
      <TabsList className='bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-[1.25rem] w-fit h-auto gap-1 mb-8 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm'>
        <TabsTrigger
          value='description'
          className='rounded-[0.875rem] px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-rose-600 data-[state=active]:shadow-md transition-all font-black text-xs uppercase tracking-wider text-slate-500'
        >
          Mô tả
        </TabsTrigger>
        <TabsTrigger
          value='ai'
          className='rounded-[0.875rem] px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-rose-600 data-[state=active]:shadow-md transition-all font-black text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2'
        >
          Hỏi đáp AI
          <span className='bg-rose-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black tracking-normal'>
            NEW
          </span>
        </TabsTrigger>
        <TabsTrigger
          value='discussion'
          className='rounded-[0.875rem] px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-rose-600 data-[state=active]:shadow-md transition-all font-black text-xs uppercase tracking-wider text-slate-500'
        >
          Thảo luận
        </TabsTrigger>
        <TabsTrigger
          value='materials'
          className='rounded-[0.875rem] px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-rose-600 data-[state=active]:shadow-md transition-all font-black text-xs uppercase tracking-wider text-slate-500'
        >
          Tài liệu
        </TabsTrigger>
      </TabsList>

      {/* --- PHẦN MÔ TẢ --- */}
      <TabsContent value='description' className='mt-6 w-full min-w-0'>
        <div className='w-full min-w-0 text-foreground/90 leading-relaxed text-[15px] whitespace-pre-line break-all'>
          {description}
        </div>
      </TabsContent>

      {/* --- PHẦN HỎI ĐÁP AI --- */}
      <TabsContent value='ai' className='mt-6 w-full min-w-0'>
        <div className='bg-muted/30 rounded-2xl p-6 min-h-[400px] flex flex-col justify-between border border-border'>
          {/* Luồng tin nhắn */}
          <div className='space-y-6'>
            <div className='flex gap-4'>
              <div className='h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0'>
                <Bot size={20} />
              </div>
              <div className='bg-background p-4 rounded-2xl rounded-tl-none shadow-sm text-[15px] text-foreground max-w-[85%] border border-border leading-relaxed'>
                {
                  'Chào mừng bạn đến với trợ lý AI của LearnProof! Tôi đã nắm vững nội dung bài học. Bạn có bất kỳ thắc mắc nào về lý thuyết hay cách áp dụng thực tế không?'
                }
              </div>
            </div>
          </div>

          {/* Form nhập liệu Pill-style */}
          <div className='relative mt-4'>
            {isEnrolled ? (
              <>
                <input
                  type='text'
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAi()}
                  placeholder='Đặt câu hỏi về bài học này...'
                  className='w-full bg-background border border-input rounded-full py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm'
                />
                <Button
                  onClick={handleSendAi}
                  size='icon'
                  className='absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full h-11 w-11 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20'
                >
                  <Send size={18} className='text-primary-foreground' />
                </Button>
              </>
            ) : (
              <div className='w-full bg-muted/20 border border-dashed border-border rounded-full py-4 px-6 text-sm text-muted-foreground flex items-center justify-center gap-2'>
                <Lock size={16} />
                Bạn cần sở hữu khóa học này để đặt câu hỏi cho AI.
              </div>
            )}
          </div>
        </div>
      </TabsContent>

      {/* --- PHẦN THẢO LUẬN --- */}
      <TabsContent value='discussion' className='mt-6 w-full min-w-0'>
        <LessonComments courseId={courseId} lessonId={lessonId} isEnrolled={isEnrolled} />
      </TabsContent>

      {/* --- PHẦN TÀI LIỆU --- */}
      <TabsContent value='materials' className='mt-6 w-full min-w-0 space-y-3'>
        {materials.length > 0 ? (
          materials.map((file, idx) => (
            <a
              key={idx}
              href={file.url}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center justify-between p-4 bg-background border border-border rounded-xl hover:border-primary/50 transition-all group cursor-pointer shadow-sm'
            >
              <div className='flex items-center gap-4'>
                <div className='h-11 w-11 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors'>
                  <FileText size={22} />
                </div>
                <div>
                  <p className='text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors'>
                    {file.title}
                  </p>
                  <p className='text-[11px] text-muted-foreground uppercase font-mono tracking-tighter mt-0.5'>
                    {file.size}
                  </p>
                </div>
              </div>
              <Button
                variant='ghost'
                size='icon'
                className='text-muted-foreground hover:text-primary hover:bg-transparent'
                asChild
              >
                <span>
                  <Download size={20} />
                </span>
              </Button>
            </a>
          ))
        ) : (
          <div className='text-center py-12 text-muted-foreground text-sm border border-dashed border-border rounded-xl'>
            Chưa có tài liệu đính kèm cho bài học này.
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
