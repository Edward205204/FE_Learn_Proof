'use client'

import { useChatBox } from './use-chat-box'
import { ChatMessageComponent } from './chat-message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, Send, X, MessageCircle, Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AiChatBoxProps {
  lessonId: string
  authToken: string
}

export const AiChatBox = ({ lessonId, authToken }: AiChatBoxProps) => {
  const { messages, input, isLoading, isOpen, setInput, setIsOpen, handleSubmit, messagesEndRef } = useChatBox({
    lessonId,
    authToken
  })

  return (
    <>
      {/* Floating Button with Pulse Effect */}
      <div className='fixed bottom-6 right-6 z-[100] group'>
        {!isOpen && (
          <div className='absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
        )}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'relative w-14 h-14 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] z-10 transition-all duration-500 hover:scale-110 active:scale-95',
            isOpen
              ? 'bg-destructive hover:bg-destructive/90 rotate-90'
              : 'bg-gradient-to-br from-primary via-primary/90 to-orange-500 hover:shadow-primary/40'
          )}
        >
          {isOpen ? <X className='w-6 h-6' /> : <Bot className='w-7 h-7' />}
        </Button>
      </div>

      {/* Chat Box Container */}
      <div
        className={cn(
          'fixed bottom-24 right-6 w-[400px] h-[600px] max-h-[calc(100vh-120px)] bg-card/80 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-[100] flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right',
          isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none translate-y-10'
        )}
      >
        {/* Header with Sparkles */}
        <div className='relative shrink-0 p-6 border-b border-white/10 bg-gradient-to-r from-primary/10 via-transparent to-transparent'>
          <div className='absolute top-0 right-0 p-4'>
            <Sparkles className='w-5 h-5 text-primary animate-pulse' />
          </div>
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
                <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>AI Online</span>
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
