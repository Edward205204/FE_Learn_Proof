'use client'

import { useState } from 'react'
import { Pin, MessageSquareReply, BookOpen, Clock, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useDiscussionsQuery, useReplyMutation, usePinMutation } from '../../_hooks/use-interaction'
import type { DiscussionItem } from '../../_utils/zod'

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (days >= 1) return `${days} ngày trước`
  if (hours >= 1) return `${hours} giờ trước`
  if (minutes >= 1) return `${minutes} phút trước`
  return 'Vừa xong'
}

function DiscussionCard({ item }: { item: DiscussionItem }) {
  const [replyText, setReplyText] = useState('')
  const [showReplies, setShowReplies] = useState(false)

  const { mutate: reply, isPending: replying } = useReplyMutation()
  const { mutate: togglePin, isPending: pinning } = usePinMutation()

  const courseName = item.lesson?.chapter?.course?.title ?? '—'
  const lessonTitle = item.lesson?.title ?? '—'
  const replyCount = item.replies?.filter((r) => !r.isDeleted).length ?? 0

  function handleReply() {
    if (!replyText.trim()) return
    reply(
      { commentId: item.id, content: replyText },
      { onSuccess: () => setReplyText('') }
    )
  }

  return (
    <Card className='border-none shadow-sm relative overflow-hidden'>
      <div className='absolute left-0 top-0 bottom-0 w-1 bg-orange-400' />
      <CardContent className='p-6'>
        {/* Header */}
        <div className='flex items-start justify-between mb-3 gap-2'>
          <div className='flex items-start gap-3 min-w-0'>
            <Avatar className='h-9 w-9 shrink-0'>
              <AvatarImage src={item.user?.avatar ?? ''} />
              <AvatarFallback>{item.user?.fullName?.[0] ?? '?'}</AvatarFallback>
            </Avatar>
            <div className='min-w-0'>
              <div className='flex items-center gap-2 flex-wrap'>
                <span className='font-semibold text-sm'>{item.user?.fullName ?? 'Học viên'}</span>
                <Badge variant='outline' className='text-[10px] uppercase'>Q&A</Badge>
                {item.isPinned && (
                  <Badge className='text-[10px] bg-primary/10 text-primary border-primary/30'>Đã ghim</Badge>
                )}
              </div>
              <div className='flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap'>
                <span className='flex items-center gap-1'>
                  <BookOpen className='h-3 w-3' />
                  {courseName}
                </span>
                <span className='text-muted-foreground/50'>·</span>
                <span className='truncate max-w-[160px]'>{lessonTitle}</span>
                <span className='text-muted-foreground/50'>·</span>
                <span className='flex items-center gap-1'>
                  <Clock className='h-3 w-3' />
                  {relativeTime(item.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant='ghost'
            size='icon'
            className={item.isPinned ? 'text-primary' : 'text-muted-foreground'}
            onClick={() => togglePin({ commentId: item.id, isPinned: item.isPinned })}
            disabled={pinning}
          >
            <Pin className='h-4 w-4' />
          </Button>
        </div>

        {/* Content */}
        <p className='text-sm text-foreground/80 leading-relaxed mb-4'>{item.content}</p>

        {/* Show replies */}
        {replyCount > 0 && (
          <button
            className='flex items-center gap-1 text-xs font-medium text-primary hover:underline mb-3'
            onClick={() => setShowReplies((v) => !v)}
          >
            {showReplies ? <ChevronUp className='h-3 w-3' /> : <ChevronDown className='h-3 w-3' />}
            {replyCount} phản hồi
          </button>
        )}
        {showReplies && (
          <div className='ml-4 space-y-2 mb-4 border-l-2 border-muted pl-3'>
            {item.replies?.filter((r) => !r.isDeleted).map((r) => (
              <div key={r.id} className='flex gap-2'>
                <Avatar className='h-6 w-6 shrink-0'>
                  <AvatarImage src={r.user?.avatar ?? ''} />
                  <AvatarFallback className='text-[10px]'>{r.user?.fullName?.[0] ?? '?'}</AvatarFallback>
                </Avatar>
                <div className='bg-muted/40 rounded-md px-3 py-2 flex-1'>
                  <p className='text-xs font-semibold'>{r.user?.fullName ?? 'Giảng viên'}</p>
                  <p className='text-xs text-foreground/80 mt-0.5'>{r.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reply box */}
        <div className='space-y-2'>
          <Textarea
            placeholder='Nhập câu trả lời của bạn...'
            className='bg-muted/30 border-none resize-none min-h-[72px] text-sm'
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className='flex justify-end'>
            <Button
              size='sm'
              onClick={handleReply}
              disabled={replying || !replyText.trim()}
              className='gap-1.5'
            >
              <MessageSquareReply className='h-3.5 w-3.5' />
              {replying ? 'Đang gửi...' : 'Gửi phản hồi'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DiscussionSkeleton() {
  return (
    <div className='rounded-xl border border-border bg-card shadow-sm p-6 space-y-3 animate-pulse'>
      <div className='flex items-center gap-3'>
        <div className='h-9 w-9 rounded-full bg-muted' />
        <div className='space-y-1.5 flex-1'>
          <div className='h-3.5 w-32 rounded bg-muted' />
          <div className='h-3 w-48 rounded bg-muted' />
        </div>
      </div>
      <div className='h-4 w-full rounded bg-muted' />
      <div className='h-4 w-3/4 rounded bg-muted' />
      <div className='h-20 w-full rounded-md bg-muted' />
    </div>
  )
}

export default function DiscussionsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useDiscussionsQuery(page, 10)

  const filtered = data?.data?.filter((item) =>
    search
      ? item.content.toLowerCase().includes(search.toLowerCase()) ||
        item.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        item.lesson?.chapter?.course?.title?.toLowerCase().includes(search.toLowerCase())
      : true
  )

  return (
    <div className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
      {/* Header Area */}
      <header className='flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-6'>
        <div>
          <p className='text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-2'>Engagement Hub</p>
          <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground'>Hỏi Đáp (Q&A)</h1>
          <p className='text-muted-foreground font-medium mt-1 text-sm'>
            Giải đáp trực tiếp các câu hỏi mở và bình luận thảo luận của học viên.
          </p>
        </div>
      </header>

        {/* Search + Filter */}
        <div className='flex flex-col md:flex-row items-center gap-4 bg-muted/20 p-2 sm:p-3 rounded-2xl border border-border/50 sticky top-[56px] z-10 backdrop-blur-md'>
          <div className='relative flex-1 w-full group'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
            <Input
              className='pl-11 h-12 bg-background border-border/40 shadow-sm hover:border-primary/20 focus:border-primary/50 transition-all rounded-xl w-full'
              placeholder='Tìm theo học viên, khóa học, nội dung...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {data && (
            <div className='pl-2 pr-2'>
              <span className='text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap'>
                {filtered?.length ?? 0} câu hỏi
              </span>
            </div>
          )}
        </div>

        {/* List */}
        <div className='space-y-4'>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <DiscussionSkeleton key={i} />)
          ) : (filtered?.length ?? 0) === 0 ? (
            <div className='flex flex-col items-center justify-center py-32 px-4 bg-muted/10 rounded-3xl border border-dashed border-border flex-1'>
              <div className='h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6 ring-1 ring-primary/10'>
                <MessageSquareReply className='h-10 w-10 text-primary/40' />
              </div>
              <h3 className='font-extrabold text-xl text-foreground'>Chưa có câu hỏi nào</h3>
              <p className='text-sm text-muted-foreground mt-2 max-w-[300px] text-center'>
                Câu hỏi của học viên sẽ hiển thị ở đây
              </p>
            </div>
          ) : (
            (filtered ?? []).map((item) => <DiscussionCard key={item.id} item={item} />)
          )}
        </div>

        {data && filtered && filtered.length > 0 && (
          <div className='mt-8 pt-8 border-t flex items-center justify-center gap-4'>
            <Button
              variant='outline'
              size='sm'
              className='rounded-xl px-6 font-bold text-xs h-10 hover:bg-muted transition-colors'
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Trang trước
            </Button>
            <span className='text-xs font-black text-foreground bg-muted/50 px-4 py-2 rounded-xl ring-1 ring-border/50'>
              {page} / {data?.totalPages || 1}
            </span>
            <Button
              variant='outline'
              size='sm'
              className='rounded-xl px-6 font-bold text-xs h-10 hover:bg-muted transition-colors'
              disabled={(data.data.length ?? 0) < 10}
              onClick={() => setPage((p) => p + 1)}
            >
              Trang sau
            </Button>
          </div>
        )}
    </div>
  )
}
