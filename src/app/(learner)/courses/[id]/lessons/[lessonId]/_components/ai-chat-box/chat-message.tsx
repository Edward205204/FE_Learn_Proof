'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { SourceBadge } from './source-badge'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources: string[]
  isLoading: boolean
  isError: boolean
}

interface ChatMessageProps {
  message: ChatMessage
}

export const ChatMessageComponent = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex w-full mb-4', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-none'
            : 'bg-muted text-foreground rounded-tl-none border border-border'
        )}
      >
        {message.isLoading ? (
          <div className='flex space-x-1 py-1 px-1'>
            <div className='w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]'></div>
            <div className='w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]'></div>
            <div className='w-1.5 h-1.5 bg-current rounded-full animate-bounce'></div>
          </div>
        ) : (
          <>
            <p className={cn('whitespace-pre-wrap leading-relaxed', message.isError && 'text-destructive font-medium')}>
              {message.content}
            </p>
            {message.sources.length > 0 && (
              <div className='mt-2 flex flex-wrap gap-1.5 pt-2 border-t border-border/50'>
                <span className='text-[10px] text-muted-foreground w-full mb-0.5'>Nguồn tham khảo:</span>
                {message.sources.map((source, index) => (
                  <SourceBadge key={index} source={source} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
