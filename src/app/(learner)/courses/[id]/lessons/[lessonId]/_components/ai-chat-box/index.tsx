'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useState } from 'react'
import { useChatBox } from './use-chat-box'
import { ChatMessageComponent } from './chat-message'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, Send, MessageCircle, Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AiChatBoxProps {
  lessonId: string
  authToken: string
}

export const AiChatBox = ({ lessonId, authToken }: AiChatBoxProps) => {
  const [outputLanguage, setOutputLanguage] = useState<'vi' | 'en'>('vi')
  const { messages, input, isLoading, setInput, handleSubmit, messagesEndRef } = useChatBox({
    lessonId,
    authToken,
    outputLanguage
  })

  return (
    <>
      <div
        className={cn(
          'fixed bottom-6 right-6 z-[100] flex h-[600px] w-[400px] max-h-[calc(100vh-24px)] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lg transition-all duration-300'
        )}
      >
        <div className='shrink-0 border-b border-border px-5 py-4'>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-foreground'>
                <Bot className='h-5 w-5' />
              </div>
              <div>
                <h3 className='text-sm font-semibold text-foreground'>LearnProof Assistant</h3>
                <div className='mt-1 flex items-center gap-1.5'>
                  <span className='relative flex h-2 w-2'>
                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
                    <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-500'></span>
                  </span>
                  <span className='text-[10px] font-medium uppercase tracking-widest text-muted-foreground'>
                    AI Online
                  </span>
                </div>
              </div>
            </div>
            <Sparkles className='h-4 w-4 text-muted-foreground' />
          </div>
        </div>

        <ScrollArea className='flex-1 px-5 py-5 scroll-smooth'>
          {messages.length === 0 ? (
            <div className='flex h-full flex-col items-center justify-center gap-5 text-center py-10'>
              <div className='flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground'>
                <MessageCircle className='h-7 w-7' />
              </div>
              <div className='space-y-1'>
                <p className='text-sm font-semibold text-foreground'>Bắt đầu cuộc trò chuyện</p>
                <p className='px-4 text-xs leading-relaxed text-muted-foreground'>
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
            <div className='space-y-4'>
              {messages.map((msg) => (
                <ChatMessageComponent key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} className='h-2' />
            </div>
          )}
        </ScrollArea>

        <div className='shrink-0 border-t border-border bg-card px-5 py-4'>
          <div className='mb-3 flex items-center justify-between gap-3'>
            <div className='text-[10px] font-medium uppercase tracking-widest text-muted-foreground'>Output language</div>
            <div>
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
          </div>

          <div className='relative flex items-center'>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
              placeholder='Hỏi AI điều gì đó...'
              className='h-12 w-full rounded-md border border-border bg-background px-4 pr-14 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground'
            />
            <Button
              size='icon'
              disabled={!input.trim() || isLoading}
              onClick={handleSubmit}
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
          <p className='mt-4 text-center text-[9px] font-medium uppercase tracking-[0.1em] text-muted-foreground'>
            Powered by LearnProof AI Ecosystem
          </p>
        </div>
      </div>
    </>
  )
}
