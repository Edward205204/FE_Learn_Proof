'use client'

import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface SourceBadgeProps {
  source: string
}

export const SourceBadge = ({ source }: SourceBadgeProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant='outline'
            className='max-w-[200px] truncate cursor-help text-[10px] py-0 px-1.5 font-normal bg-muted/50'
          >
            {source}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side='top' className='max-w-xs break-words'>
          <p>{source}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
