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
            className='max-w-[140px] truncate cursor-help text-[10px] py-1 px-3 font-bold bg-muted/30 border-white/5 hover:bg-primary/20 hover:text-primary transition-all rounded-full'
          >
            {content}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side='top' className='max-w-xs p-4 bg-card/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl'>
          <div className='space-y-3'>
            <div className='flex items-center justify-between gap-4'>
              <span className='text-[10px] font-black uppercase tracking-widest text-primary'>Source Evidence</span>
              <Badge className='text-[10px] font-black bg-emerald-500/10 text-emerald-500 border-none'>
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
