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
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant='outline'
            className='max-w-[200px] truncate cursor-help text-[10px] py-0 px-1.5 font-normal bg-muted/50'
          >
            {content}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side='top' className='max-w-xs break-words'>
          <div className='space-y-1'>
            <p className='text-[10px] font-bold text-primary'>Độ liên quan: {(score * 100).toFixed(1)}%</p>
            <p className='text-xs'>{content}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
