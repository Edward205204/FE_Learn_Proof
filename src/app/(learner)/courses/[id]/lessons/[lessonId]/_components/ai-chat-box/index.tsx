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
      {/* Chat Box Container */}
      <div
        className={cn(
          'fixed bottom-6 right-6 w-[400px] h-[600px] max-h-[calc(100vh-24px)] bg-card/80 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-[100] flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right scale-100 opacity-100'
        )}
      >
        {/* Header with Sparkles */}
        <div className='relative shrink-0 p-6 border-b border-white/10 bg-gradient-to-r from-primary/10 via-transparent to-transparent'>
          <div className='absolute top-0 right-0 p-4'>
            <Sparkles className='w-5 h-5 text-primary animate-pulse' />
          </div>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-4'>
              <div className='w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-inner'>
                <Bot className='w-6 h-6' />
              </div>
              <div>
                <h3 className='font-black text-foreground tracking-tight'>LearnProof Assistant</h3>
                <div className='flex items-center gap-1.5'>
                  <span className='relative flex h-2 w-2'>
                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
                    <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-500'></span>
                  </span>
                  <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>
                    AI Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message List */}
        <ScrollArea className='flex-1 p-6 scroll-smooth'>
          {messages.length === 0 ? (
            <div className='h-full flex flex-col items-center justify-center text-center p-8 gap-6'>
              <div className='w-20 h-20 rounded-[2rem] bg-muted flex items-center justify-center text-muted-foreground/30'>
                <MessageCircle className='w-10 h-10' />
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-black text-foreground'>Bắt đầu cuộc trò chuyện!</p>
                <p className='text-xs text-muted-foreground font-medium leading-relaxed px-4'>
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
            <div className='space-y-4'>
              {messages.map((msg) => (
                <ChatMessageComponent key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} className='h-2' />
            </div>
          )}
        </ScrollArea>

        {/* Footer / Input */}
        <div className='shrink-0 p-6 bg-gradient-to-t from-muted/50 to-transparent border-t border-white/10'>
          <div className='mb-3 flex items-center justify-between gap-3'>
            <div className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground'>Output language</div>
            <div>
              <Select value={outputLanguage} onValueChange={(value) => setOutputLanguage(value as 'vi' | 'en')}>
                <SelectTrigger className='h-9 w-[112px] rounded-full bg-card/90 backdrop-blur-xl border border-white/15 shadow-[0_10px_24px_rgba(0,0,0,0.12)] px-3 text-xs font-bold uppercase tracking-widest text-muted-foreground'>
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
              className='w-full bg-background/50 border-2 border-transparent focus:border-primary/20 focus:bg-background h-14 pl-5 pr-14 rounded-2xl text-sm font-medium transition-all outline-none shadow-inner'
            />
            <Button
              size='icon'
              disabled={!input.trim() || isLoading}
              onClick={handleSubmit}
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
          <p className='mt-4 text-[9px] text-center font-bold text-muted-foreground uppercase tracking-[0.1em]'>
            Powered by LearnProof AI Ecosystem
          </p>
        </div>
      </div>
    </>
  )
}
