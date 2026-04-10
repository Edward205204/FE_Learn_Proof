'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

const RANGE = 2

function generatePages(currentPage: number, totalPages: number): (number | 'dots')[] {
  if (totalPages <= 0) return []
  if (totalPages <= 1) return [1]

  const pages: (number | 'dots')[] = []
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages))

  const leftBound = 1
  const rightBound = totalPages

  const rangeStart = Math.max(leftBound, safeCurrentPage - RANGE)
  const rangeEnd = Math.min(rightBound, safeCurrentPage + RANGE)

  const leftEdgeEnd = Math.min(leftBound + RANGE - 1, rightBound)
  const rightEdgeStart = Math.max(rightBound - RANGE + 1, leftBound)

  const visibleSet = new Set<number>()

  for (let i = leftBound; i <= leftEdgeEnd; i++) visibleSet.add(i)
  for (let i = rangeStart; i <= rangeEnd; i++) visibleSet.add(i)
  for (let i = rightEdgeStart; i <= rightBound; i++) visibleSet.add(i)

  const sorted = Array.from(visibleSet).sort((a, b) => a - b)

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      pages.push('dots')
    }
    pages.push(sorted[i])
  }

  return pages
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = generatePages(currentPage, totalPages)

  const minSlots = 5 + RANGE * 2
  const showSlots = Math.max(pages.length, Math.min(minSlots, totalPages))

  return (
    <nav role='navigation' aria-label='Phân trang' className='flex items-center justify-center gap-1'>
      <Button
        variant='outline'
        size='icon-sm'
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label='Trang trước'
      >
        <ChevronLeft className='size-4' />
      </Button>

      <div className='flex items-center gap-1' style={{ minWidth: `${showSlots * 2.25}rem` }}>
        <div className='flex items-center gap-1 mx-auto'>
          {pages.map((page, index) =>
            page === 'dots' ? (
              <span
                key={`dots-${index}`}
                className='flex items-center justify-center size-8 text-muted-foreground'
                aria-hidden
              >
                <MoreHorizontal className='size-4' />
              </span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? 'default' : 'ghost'}
                size='icon-sm'
                className={cn('tabular-nums', page === currentPage && 'pointer-events-none')}
                onClick={() => onPageChange(page)}
                aria-label={`Trang ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Button>
            )
          )}
        </div>
      </div>

      <Button
        variant='outline'
        size='icon-sm'
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label='Trang sau'
      >
        <ChevronRight className='size-4' />
      </Button>
    </nav>
  )
}
