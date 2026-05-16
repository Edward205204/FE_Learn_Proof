'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Send, FileText, Download, Bot, MessageCircle, Loader2 } from 'lucide-react'
import { LessonDiscussion } from './lesson-discussion'
import { useChatBox } from '../courses/[id]/lessons/[lessonId]/_components/ai-chat-box/use-chat-box'
import { ChatMessageComponent } from '../courses/[id]/lessons/[lessonId]/_components/ai-chat-box/chat-message'
import { cn } from '@/lib/utils'

interface LessonTabsProps {
  courseId: string
  lessonId: string
  description: string
  materials: { title: string; size: string; url: string }[]
  authToken?: string
}

export function LessonTabs({ courseId, lessonId, description, materials, authToken }: LessonTabsProps) {
  // Use ChatBox logic but without the isOpen state (it's always open in the tab)
  const { messages, input, isLoading, setInput, handleSubmit, messagesEndRef } = useChatBox({
    lessonId,
    authToken: authToken || ''
  })

  return (
    <Tabs defaultValue='description' className='w-full'>
      {/* Tab Headers */}
      <TabsList className='bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 mb-6 gap-2'>
        <TabsTrigger
          value='description'
          className='data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none border-b-2 border-transparent px-2 py-3 font-semibold text-muted-foreground transition-all'
        >
          Mô tả
        </TabsTrigger>
        <TabsTrigger
          value='ai'
          className='data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none border-b-2 border-transparent px-2 py-3 font-semibold text-muted-foreground transition-all flex items-center gap-1.5'
        >
          Hỏi đáp AI{' '}
          <span className='bg-primary/10 text-primary text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wide'>
            Mới
          </span>
        </TabsTrigger>
        <TabsTrigger
          value='discussion'
          className='data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none border-b-2 border-transparent px-2 py-3 font-semibold text-muted-foreground transition-all'
        >
          Thảo luận
        </TabsTrigger>
        <TabsTrigger
          value='materials'
          className='data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none border-b-2 border-transparent px-2 py-3 font-semibold text-muted-foreground transition-all'
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
        <div className='bg-card rounded-[2rem] p-6 min-h-[500px] max-h-[600px] flex flex-col justify-between border border-white/10 shadow-xl overflow-hidden'>
          {/* Luồng tin nhắn */}
          <div className='flex-1 overflow-y-auto pr-2 scroll-smooth'>
            {messages.length === 0 ? (
              <div className='h-full flex flex-col items-center justify-center text-center p-8 gap-6'>
                <div className='w-20 h-20 rounded-[2rem] bg-muted flex items-center justify-center text-muted-foreground/30'>
                  <MessageCircle className='w-10 h-10' />
                </div>
                <div className='space-y-2'>
                  <p className='text-sm font-black text-foreground'>Bắt đầu cuộc trò chuyện!</p>
                  <p className='text-xs text-muted-foreground font-medium leading-relaxed max-w-sm'>
                    Hãy hỏi tôi bất cứ điều gì về bài học này. Tôi sẽ giúp bạn hiểu rõ hơn về nội dung!
                  </p>
                </div>
                <div className='flex flex-wrap justify-center gap-2'>
                  {['Tóm tắt bài này', 'Giải thích thuật ngữ', 'Đặt câu hỏi kiểm tra'].map((hint) => (
                    <button
                      key={hint}
                      onClick={() => setInput(hint)}
                      className='px-4 py-2 rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 text-[11px] font-bold transition-all'
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className='space-y-4 pb-4'>
                <div className='flex gap-4 mb-6 group/msg justify-start'>
                  <div className='bg-card text-foreground rounded-[1.5rem] rounded-tl-none border border-white/10 shadow-black/5 px-5 py-3.5 text-sm max-w-[85%] leading-relaxed font-medium'>
                    Chào mừng bạn đến với trợ lý AI của LearnProof! Bạn có bất kỳ thắc mắc nào về lý thuyết hay cách áp dụng thực tế không?
                  </div>
                </div>
                {messages.map((msg) => (
                  <ChatMessageComponent key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} className='h-2' />
              </div>
            )}
          </div>

          {/* Form nhập liệu */}
          <div className='shrink-0 pt-4 mt-2 border-t border-white/10 bg-card'>
            <div className='relative flex items-center'>
              <input
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
                placeholder='Đặt câu hỏi về bài học này...'
                className='w-full bg-background/50 border-2 border-transparent focus:border-primary/20 focus:bg-background h-14 pl-5 pr-14 rounded-2xl text-sm font-medium transition-all outline-none shadow-inner'
              />
              <Button
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading}
                size='icon'
                className={cn(
                  'absolute right-2 w-10 h-10 rounded-xl transition-all',
                  input.trim()
                    ? 'bg-primary shadow-lg shadow-primary/20 scale-100'
                    : 'bg-muted text-muted-foreground scale-90'
                )}
              >
                {isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : <Send className='w-4 h-4' />}
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* --- PHẦN THẢO LUẬN --- */}
      <TabsContent value='discussion' className='mt-6 w-full min-w-0'>
        <LessonDiscussion courseId={courseId} lessonId={lessonId} />
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
