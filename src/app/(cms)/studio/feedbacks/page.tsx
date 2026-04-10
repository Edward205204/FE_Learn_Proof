'use client'

import { useState } from 'react'
import { Search, MessageSquareText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InteractionItem } from '../../_components/interaction-item'
import { useDiscussionsQuery } from '../../_hooks/use-interaction'
import { InteractionValues, DiscussionItem } from '../../_utils/zod'

function mapDiscussionToInteraction(item: DiscussionItem): InteractionValues {
  return {
    id: item.id,
    type: 'discussion',
    user: {
      name: item.user?.fullName || 'Học viên',
      avatar: item.user?.avatar || '',
      courseName: item.lesson?.chapter?.course?.title || '—'
    },
    content: item.content,
    status: (item.replies?.length ?? 0) > 0 ? 'resolved' : 'unresolved',
    lessonUrl: `/courses/${item.courseId}/lessons/${item.lessonId}`,
    isPinned: item.isPinned,
    createdAt: item.createdAt
  }
}

function LoadingSkeleton() {
  return (
    <div className='space-y-4'>
      {[...Array(3)].map((_, i) => (
        <div key={i} className='h-[180px] w-full rounded-xl bg-muted/20 animate-pulse border border-border/50' />
      ))}
    </div>
  )
}

export default function FeedbackListPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'discussion'>('all')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useDiscussionsQuery(page, 15)

  const allInteractions: InteractionValues[] = (data?.data || []).map(mapDiscussionToInteraction)

  const filteredItems = allInteractions.filter((item) => {
    const matchesSearch =
      item.content.toLowerCase().includes(search.toLowerCase()) ||
      item.user.name.toLowerCase().includes(search.toLowerCase()) ||
      item.user.courseName.toLowerCase().includes(search.toLowerCase())

    const matchesFilter = filter === 'all' || item.type === filter

    return matchesSearch && matchesFilter
  })

  return (
    <div className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
      {/* Header Area */}
      <header className='flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-6'>
        <div>
          <p className='text-[11px] font-bold text-primary uppercase tracking-[0.2em] mb-2'>Engagement Hub</p>
          <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground'>Phản hồi & Q&A</h1>
          <p className='text-muted-foreground font-medium mt-1 text-sm'>
            Quản lý trải nghiệm và tương tác của học viên trên các khóa học của bạn
          </p>
        </div>

        <div className='flex items-center gap-3 bg-muted/40 p-1.5 rounded-xl border border-border/50 shadow-sm'>
          <Button variant='ghost' size='sm' className='h-9 px-4 text-xs font-bold hover:bg-background'>
            Xuất báo cáo
          </Button>
          <div className='w-[1px] h-5 bg-border/50' />
          <Button variant='default' size='sm' className='h-9 px-4 text-xs font-bold shadow-md'>
            Cài đặt tự động
          </Button>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className='flex flex-col md:flex-row items-center gap-4 bg-muted/20 p-2 sm:p-3 rounded-2xl border border-border/50 sticky top-[56px] z-10 backdrop-blur-md'>
        <div className='relative flex-1 w-full group'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
          <Input
            placeholder='Tìm theo học viên, khóa học hoặc nội dung...'
            className='pl-11 h-12 bg-background border-border/40 shadow-sm hover:border-primary/20 focus:border-primary/50 transition-all rounded-xl w-full'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Tabs
          defaultValue='all'
          className='w-full md:w-auto shrink-0'
          onValueChange={(v) => setFilter(v as 'all' | 'discussion')}
        >
          <TabsList className='h-12 bg-background p-1 border border-border/40 rounded-xl w-full sm:w-auto shadow-sm'>
            <TabsTrigger
              value='all'
              className='px-6 text-xs font-bold data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-lg h-10 w-1/2 sm:w-auto transition-all'
            >
              Tất cả
            </TabsTrigger>
            <TabsTrigger
              value='discussion'
              className='px-6 text-xs font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg h-10 w-1/2 sm:w-auto transition-all'
            >
              Thảo luận (Q&A)
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content Area */}
      <div className='grid gap-6'>
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredItems.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-32 px-4 bg-muted/10 rounded-3xl border border-dashed border-border flex-1'>
            <div className='h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6 ring-1 ring-primary/10'>
              <MessageSquareText className='h-10 w-10 text-primary/40' />
            </div>
            <h3 className='font-extrabold text-xl text-foreground'>Không tìm thấy dữ liệu</h3>
            <p className='text-sm text-muted-foreground mt-2 max-w-[300px] text-center'>
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để thấy được nhiều kết quả Q&A hơn.
            </p>
          </div>
        ) : (
          <div className='space-y-5'>
            {filteredItems.map((item) => (
              <InteractionItem key={item.id} data={item} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && filteredItems.length > 0 && (
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
            disabled={page >= (data?.totalPages || 1)}
            onClick={() => setPage((p) => p + 1)}
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  )
}
