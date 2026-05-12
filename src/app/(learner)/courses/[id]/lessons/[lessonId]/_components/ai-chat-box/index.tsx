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
      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl z-[100] transition-all duration-300 hover:scale-105',
          isOpen ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'
        )}
      >
        {isOpen ? <X className='w-6 h-6' /> : <Bot className='w-7 h-7' />}
      </Button>

      {/* Chat Panel */}
      <div
        className={cn(
          'fixed bottom-24 right-6 w-[380px] h-[550px] max-h-[calc(100vh-120px)] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right z-[100]',
          isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className='bg-primary p-4 flex items-center justify-between text-primary-foreground shrink-0'>
          <div className='flex items-center gap-2'>
            <Sparkles className='w-5 h-5 text-yellow-300' />
            <h3 className='font-semibold text-sm'>Hỏi về bài học</h3>
          </div>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIsOpen(false)}
            className='text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8'
          >
            <X className='w-4 h-4' />
          </Button>
        </div>

        {/* Message List */}
        <ScrollArea className='flex-1 p-4'>
          <div className='flex flex-col min-h-full'>
            {messages.length === 0 ? (
              <div className='flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 text-muted-foreground opacity-60 mt-10'>
                <div className='w-16 h-16 rounded-full bg-muted flex items-center justify-center'>
                  <MessageCircle className='w-8 h-8' />
                </div>
                <div>
                  <p className='font-medium'>Chào bạn!</p>
                  <p className='text-xs'>Hãy đặt câu hỏi về nội dung bài học này để AI hỗ trợ bạn nhé.</p>
                </div>
              </div>
            ) : (
              <div className='space-y-2'>
                {messages.map((message) => (
                  <ChatMessageComponent key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} className='h-2' />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className='p-4 border-t border-border bg-background shrink-0'>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
            className='flex items-center gap-2'
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Nhập câu hỏi của bạn...'
              disabled={isLoading}
              className='flex-1 text-sm bg-muted/30 focus-visible:ring-primary h-10'
            />
            <Button
              type='submit'
              size='icon'
              disabled={isLoading || !input.trim()}
              className='shrink-0 h-10 w-10 shadow-sm'
            >
              {isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : <Send className='w-4 h-4' />}
            </Button>
          </form>
          <p className='text-[10px] text-center text-muted-foreground mt-2 px-2'>
            AI có thể phản hồi chưa chính xác. Vui lòng kiểm tra lại thông tin quan trọng.
          </p>
        </div>
      </div>
    </>
  )
}
