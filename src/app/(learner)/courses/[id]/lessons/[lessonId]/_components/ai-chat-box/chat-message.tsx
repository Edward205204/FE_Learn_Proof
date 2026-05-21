'use client'

import { cn } from '@/lib/utils'
import { SourceBadge } from './source-badge'

export interface ChatSource {
  content: string
  score: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources: ChatSource[]
  isLoading: boolean
  isError: boolean
}

interface ChatMessageProps {
  message: ChatMessage
}

export const ChatMessageComponent = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex w-full mb-4 group/msg', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-xl px-4 py-3 text-sm transition-colors',
          isUser
            ? 'rounded-tr-none bg-primary text-primary-foreground'
            : 'rounded-tl-none border border-border bg-card text-foreground'
        )}
      >
        {message.isLoading ? (
          <div className='flex items-center gap-2 py-1 px-2'>
            <div className='flex space-x-1.5'>
              <div className='w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s] opacity-70'></div>
              <div className='w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s] opacity-85'></div>
              <div className='w-2 h-2 bg-current rounded-full animate-bounce'></div>
            </div>
            <span className='text-[10px] font-black uppercase tracking-widest opacity-50 ml-2'>AI is thinking</span>
          </div>
        ) : (
          <>
            <p className={cn('whitespace-pre-wrap leading-relaxed', message.isError && 'text-destructive')}>
              {message.content}
            </p>
            {message.sources.length > 0 && (
              <div className='mt-4 pt-3 border-t border-current/10'>
                <div className='flex items-center gap-2 mb-2'>
                  <div className='w-1 h-3 bg-primary rounded-full' />
                  <span className='text-[10px] font-black uppercase tracking-widest opacity-60'>Sources</span>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {message.sources.map((source, index) => (
                    <SourceBadge key={index} content={source.content} score={source.score} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
