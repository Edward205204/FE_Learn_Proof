'use client'

import { BookOpen, Clock, AlignLeft, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import type { HeadingItem } from '@/components/common/professional-editor'

// ─── TOC Tree ─────────────────────────────────────────────────────────────────

interface TocNode {
  heading: HeadingItem
  children: TocNode[]
}

function buildTocTree(headings: HeadingItem[]): TocNode[] {
  const roots: TocNode[] = []
  const stack: TocNode[] = []

  for (const heading of headings) {
    const node: TocNode = { heading, children: [] }

    // Pop stack until we find a proper parent
    while (stack.length > 0 && stack[stack.length - 1].heading.level >= heading.level) {
      stack.pop()
    }

    if (stack.length === 0) {
      roots.push(node)
    } else {
      stack[stack.length - 1].children.push(node)
    }
    stack.push(node)
  }

  return roots
}

// ─── TOC Node Renderer ────────────────────────────────────────────────────────

function TocNodeItem({
  node,
  activeId,
  onClickHeading
}: {
  node: TocNode
  activeId: string | null
  onClickHeading: (id: string) => void
}) {
  const isActive = activeId === node.heading.id
  const hasChildren = node.children.length > 0

  return (
    <li>
      <button
        type='button'
        onClick={() => onClickHeading(node.heading.id)}
        className={cn(
          'w-full text-left text-sm py-1 px-2 rounded-lg transition-all duration-150 truncate group',
          node.heading.level === 1 && 'font-semibold',
          node.heading.level === 2 && 'pl-4 text-[13px]',
          node.heading.level === 3 && 'pl-7 text-[12px] text-muted-foreground',
          isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
        )}
      >
        {node.heading.level === 1 && (
          <span className='inline-block w-1.5 h-1.5 rounded-full bg-current mr-1.5 mb-0.5 opacity-60' />
        )}
        {node.heading.text}
      </button>

      {hasChildren && (
        <ul className='space-y-0.5 mt-0.5'>
          {node.children.map((child) => (
            <TocNodeItem key={child.heading.id} node={child} activeId={activeId} onClickHeading={onClickHeading} />
          ))}
        </ul>
      )}
    </li>
  )
}

// ─── Word Counter ─────────────────────────────────────────────────────────────

function countWords(html: string): number {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return 0
  return text.split(' ').length
}

function estimateReadingTime(wordCount: number): string {
  const minutes = Math.ceil(wordCount / 200) // avg 200 words/min
  if (minutes < 1) return '< 1 phút'
  return `${minutes} phút`
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface LessonTocSidebarProps {
  headings: HeadingItem[]
  shortDesc: string
  onShortDescChange: (value: string) => void
  contentHtml: string
  /** Called when user clicks a TOC item — scrolls the editor to the heading */
  onScrollToHeading: (headingId: string) => void
  activeHeadingId: string | null
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LessonTocSidebar({
  headings,
  shortDesc,
  onShortDescChange,
  contentHtml,
  onScrollToHeading,
  activeHeadingId
}: LessonTocSidebarProps) {
  const tocTree = buildTocTree(headings)
  const wordCount = countWords(contentHtml)
  const readingTime = estimateReadingTime(wordCount)

  return (
    <aside className='w-[280px] shrink-0 border-l border-border bg-background/60 backdrop-blur-sm flex flex-col h-full overflow-hidden'>
      {/* ── Mục lục TOC ─────────────────────────────────────────── */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 border-b border-border/50'>
          <div className='flex items-center gap-2 mb-3'>
            <BookOpen className='size-3.5 text-primary' />
            <p className='text-[11px] font-bold text-muted-foreground uppercase tracking-wider'>Mục lục</p>
          </div>

          {tocTree.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-6 text-center'>
              <FileText className='size-8 text-muted-foreground/30 mb-2' />
              <p className='text-[12px] text-muted-foreground/60 leading-relaxed'>
                Thêm tiêu đề H1/H2/H3 để xây dựng mục lục tự động
              </p>
            </div>
          ) : (
            <nav aria-label='Mục lục bài học'>
              <ul className='space-y-0.5'>
                {tocTree.map((node) => (
                  <TocNodeItem
                    key={node.heading.id}
                    node={node}
                    activeId={activeHeadingId}
                    onClickHeading={onScrollToHeading}
                  />
                ))}
              </ul>
            </nav>
          )}
        </div>

        {/* ── Stats ─────────────────────────────────────────────── */}
        <div className='p-4 border-b border-border/50'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1.5 text-muted-foreground'>
              <AlignLeft className='size-3.5' />
              <span className='text-xs'>{wordCount.toLocaleString()} từ</span>
            </div>
            <div className='flex items-center gap-1.5 text-muted-foreground'>
              <Clock className='size-3.5' />
              <span className='text-xs'>{readingTime} đọc</span>
            </div>
          </div>
        </div>

        {/* ── Mô tả ngắn ───────────────────────────────────────── */}
        <div className='p-4'>
          <div className='flex items-center gap-2 mb-2'>
            <AlignLeft className='size-3.5 text-primary' />
            <p className='text-[11px] font-bold text-muted-foreground uppercase tracking-wider'>Mô tả ngắn</p>
          </div>
          <Textarea
            value={shortDesc}
            onChange={(e) => onShortDescChange(e.target.value)}
            placeholder='Giới thiệu ngắn về nội dung bài học này...'
            className='min-h-[100px] resize-none text-sm text-foreground bg-muted/30 border-border/50 focus-visible:ring-primary/20 rounded-xl transition-all'
            maxLength={500}
          />
          <p className='text-[10px] text-muted-foreground/60 mt-1 text-right'>{shortDesc.length}/500</p>
        </div>
      </div>
    </aside>
  )
}
