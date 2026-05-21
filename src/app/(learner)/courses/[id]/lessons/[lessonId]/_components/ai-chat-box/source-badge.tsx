'use client'

import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface SourceBadgeProps {
  content: string
  score: number
}

export const SourceBadge = ({ content, score }: SourceBadgeProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Badge
            variant='secondary'
            className='max-w-[140px] truncate cursor-help rounded-full border border-border bg-muted px-3 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground'
          >
            {content}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side='top' className='max-w-xs rounded-xl border border-border bg-card p-4 shadow-lg'>
          <div className='space-y-3'>
            <div className='flex items-center justify-between gap-4'>
              <span className='text-[10px] font-semibold uppercase tracking-widest text-foreground'>Source Evidence</span>
              <Badge className='border border-border bg-muted text-[10px] font-medium text-foreground'>
                {(score * 100).toFixed(0)}% MATCH
              </Badge>
            </div>
            <p className='text-sm leading-relaxed text-foreground/80 italic'>&quot;{content}&quot;</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
