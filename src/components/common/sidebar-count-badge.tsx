'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type SidebarCountBadgeProps = {
  count?: number | null
  className?: string
}

export function SidebarCountBadge({ count, className }: SidebarCountBadgeProps) {
  const displayValue = typeof count === 'number' ? (count > 99 ? '99+' : count) : '...'

  return (
    <Badge
      variant='outline'
      className={cn(
        'ml-auto min-w-6 h-6 rounded-full px-1.5 text-[11px] font-semibold tabular-nums border-transparent',
        className
      )}
    >
      {displayValue}
    </Badge>
  )
}
