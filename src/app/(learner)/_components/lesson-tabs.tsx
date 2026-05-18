'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Send, FileText, Download, MessageCircle, Loader2 } from 'lucide-react'
import { LessonDiscussion } from './lesson-discussion'
import { useChatBox } from '../courses/[id]/lessons/[lessonId]/_components/ai-chat-box/use-chat-box'
import { ChatMessageComponent } from '../courses/[id]/lessons/[lessonId]/_components/ai-chat-box/chat-message'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface LessonTabsProps {
  courseId: string
  lessonId: string
  description: string
  materials: { title: string; size: string; url: string }[]
  authToken?: string
}

export function LessonTabs({ courseId, lessonId, description, materials, authToken }: LessonTabsProps) {
  const [outputLanguage, setOutputLanguage] = useState<'vi' | 'en'>('vi')

  const { messages, input, isLoading, setInput, handleSubmit, messagesEndRef } = useChatBox({
    lessonId,
    authToken: authToken || '',
    outputLanguage
  })

  return (
    <Tabs defaultValue='description' className='w-full'>
      <TabsList className='mb-5 flex h-auto w-full justify-start gap-2 rounded-none border-b border-border bg-transparent p-0'>
        <TabsTrigger
          value='description'
          className='rounded-none border-b-2 border-transparent px-2 py-3 text-sm font-medium text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent'
        >
          Mô tả
        </TabsTrigger>
        <TabsTrigger
          value='ai'
          className='flex items-center gap-1.5 rounded-none border-b-2 border-transparent px-2 py-3 text-sm font-medium text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent'
        >
          Hỏi đáp AI
          <span className='rounded-full border border-border bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground'>
            AI
          </span>
        </TabsTrigger>
        <TabsTrigger
          value='discussion'
          className='rounded-none border-b-2 border-transparent px-2 py-3 text-sm font-medium text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent'
        >
          Thảo luận
        </TabsTrigger>
        <TabsTrigger
          value='materials'
          className='rounded-none border-b-2 border-transparent px-2 py-3 text-sm font-medium text-muted-foreground transition-colors data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent'
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
        <div className='flex min-h-[500px] max-h-[600px] flex-col overflow-hidden rounded-xl border border-border bg-card'>
          <div className='border-b border-border px-5 py-4'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='text-sm font-semibold text-foreground'>Hỏi đáp AI</p>
                <p className='mt-1 text-xs text-muted-foreground'>
                  Hỏi về nội dung bài học, nhận tóm tắt, giải thích và gợi ý thực hành.
                </p>
              </div>
              <div className='rounded-full border border-border bg-muted px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
                Trợ lý bài học
              </div>
            </div>
          </div>

          <div className='flex-1 overflow-y-auto px-5 py-5 scroll-smooth'>
            {messages.length === 0 ? (
              <div className='flex h-full flex-col items-center justify-center gap-5 text-center py-10'>
                <div className='flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground'>
                  <MessageCircle className='h-7 w-7' />
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-semibold text-foreground'>Bắt đầu cuộc trò chuyện</p>
                  <p className='max-w-sm text-xs leading-relaxed text-muted-foreground'>
                    Hãy hỏi tôi bất cứ điều gì về bài học này. Tôi sẽ giúp bạn hiểu rõ hơn về nội dung!
                  </p>
                </div>
                <div className='flex flex-wrap justify-center gap-2'>
                  {['Tóm tắt bài này', 'Giải thích thuật ngữ', 'Đặt câu hỏi kiểm tra'].map((hint) => (
                    <button
                      key={hint}
                      onClick={() => setInput(hint)}
                      className='rounded-full border border-border bg-background px-4 py-2 text-[11px] font-medium text-foreground transition-colors hover:bg-muted'
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className='space-y-4 pb-4'>
                <div className='flex justify-start'>
                  <div className='max-w-[85%] rounded-xl rounded-tl-none border border-border bg-muted/30 px-4 py-3 text-sm leading-relaxed text-foreground'>
                    Chào mừng bạn đến với trợ lý học tập. Bạn có thể hỏi về lý thuyết, ví dụ thực tế hoặc yêu cầu tóm tắt nhanh.
                  </div>
                </div>
                {messages.map((msg) => (
                  <ChatMessageComponent key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} className='h-2' />
              </div>
            )}
          </div>

          <div className='shrink-0 border-t border-border bg-card px-5 py-4'>
            <div className='mb-3 flex items-center justify-between gap-3'>
              <div className='text-[10px] font-medium uppercase tracking-widest text-muted-foreground'>
                Output language
              </div>
              <Select value={outputLanguage} onValueChange={(value) => setOutputLanguage(value as 'vi' | 'en')}>
                <SelectTrigger className='h-9 w-[112px] rounded-md border border-border bg-background px-3 text-xs font-medium uppercase tracking-widest text-muted-foreground shadow-none'>
                  <SelectValue placeholder='VI' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='vi'>Tiếng Việt</SelectItem>
                  <SelectItem value='en'>English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='relative flex items-center'>
              <input
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
                placeholder='Đặt câu hỏi về bài học này...'
                className='h-12 w-full rounded-md border border-border bg-background px-4 pr-14 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground'
              />
              <Button
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading}
                size='icon'
                className={cn(
                  'absolute right-1.5 h-9 w-9 rounded-md transition-colors',
                  input.trim()
                    ? 'bg-foreground text-background hover:bg-foreground/90'
                    : 'bg-muted text-muted-foreground'
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
