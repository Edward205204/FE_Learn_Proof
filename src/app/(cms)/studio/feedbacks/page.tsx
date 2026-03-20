'use client'

import { useState, useMemo } from 'react'
import { Search, MessageSquareText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InteractionItem } from '../../_components/interaction-item'
import { useDiscussionsQuery, useReviewsQuery } from '../../_hooks/use-interaction'
import { InteractionValues, DiscussionItem, ReviewItem } from '../../_utils/zod'

// Helpers to map real items to common UI format
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

function mapReviewToInteraction(item: ReviewItem): InteractionValues {
  return {
    id: item.id,
    type: 'review',
    user: {
      name: item.user?.fullName || 'Học viên',
      avatar: item.user?.avatar || '',
      courseName: item.course?.title || '—'
    },
    content: item.comment || '(Không có nội dung)',
    rating: item.rating,
    isPinned: false,
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
  const [filter, setFilter] = useState<'all' | 'review' | 'discussion'>('all')
  const [page, setPage] = useState(1)

  const { data: discussionsData, isLoading: loadingDiscussions } = useDiscussionsQuery(page, 15)
  const { data: reviewsData, isLoading: loadingReviews } = useReviewsQuery(page, 15)

  const isLoading = loadingDiscussions || loadingReviews

  const allInteractions = useMemo(() => {
    const discussions = (discussionsData?.data || []).map(mapDiscussionToInteraction)
    const reviews = (reviewsData?.data || []).map(mapReviewToInteraction)
    
    return [...discussions, ...reviews].sort((a, b) => {
       const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
       const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
       return dateB - dateA
    })
  }, [discussionsData, reviewsData])

  const filteredItems = allInteractions.filter((item) => {
    const matchesSearch = 
      item.content.toLowerCase().includes(search.toLowerCase()) ||
      item.user.name.toLowerCase().includes(search.toLowerCase()) ||
      item.user.courseName.toLowerCase().includes(search.toLowerCase())
    
    const matchesFilter = filter === 'all' || item.type === filter
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className='flex min-h-screen bg-background/50'>
      <main className='flex-1 p-8'>
        <div className='max-w-5xl mx-auto'>
          {/* Header Area */}
          <header className='mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6'>
            <div>
              <p className='text-[11px] font-bold text-primary/80 uppercase tracking-[0.2em] mb-2'>Engagement Hub</p>
              <h1 className='text-4xl font-black tracking-tight text-foreground/90'>Phản hồi & Q&A</h1>
              <p className='text-muted-foreground font-medium mt-1 text-sm'>
                Quản lý trải nghiệm và tương tác của học viên trên các khóa học của bạn
              </p>
            </div>
            
            <div className='flex items-center gap-3 bg-muted/20 p-1 rounded-lg border border-border/50'>
                <Button variant='ghost' size='sm' className='h-8 px-3 text-xs font-bold'>Xuất báo cáo</Button>
                <div className='w-[1px] h-4 bg-border' />
                <Button variant='default' size='sm' className='h-8 px-3 text-xs font-bold'>Cài đặt tự động</Button>
            </div>
          </header>

          {/* Search & Filter Bar */}
          <div className='flex flex-col md:flex-row gap-4 mb-8 sticky top-14 z-10 py-2 bg-background/80 backdrop-blur-md'>
            <div className='relative flex-1 group'>
              <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
              <Input
                placeholder='Tìm theo học viên, khóa học hoặc nội dung...'
                className='pl-10 h-11 bg-card/50 border-border/50 shadow-sm focus:bg-card transition-all'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue='all' className='w-full md:w-auto' onValueChange={(v) => setFilter(v as any)}>
              <TabsList className='h-11 bg-muted/30 p-1 border border-border/50'>
                <TabsTrigger value='all' className='px-6 text-xs font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all'>Tất cả</TabsTrigger>
                <TabsTrigger value='review' className='px-6 text-xs font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm'>Đánh giá</TabsTrigger>
                <TabsTrigger value='discussion' className='px-6 text-xs font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm'>Thảo luận (Q&A)</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content Area */}
          <div className='grid gap-6'>
            {isLoading ? (
              <LoadingSkeleton />
            ) : filteredItems.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-24 px-4 bg-card/30 rounded-3xl border border-dashed border-border/60'>
                <div className='h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4'>
                   <MessageSquareText className='h-8 w-8 text-muted-foreground/40' />
                </div>
                <h3 className='font-bold text-lg text-foreground/80'>Không tìm thấy dữ liệu</h3>
                <p className='text-sm text-muted-foreground mt-1 max-w-[280px] text-center italic'>
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để thấy kết quả khác
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
          
          {/* Simple Pagination info */}
          {!isLoading && filteredItems.length > 0 && (
              <div className='mt-12 flex items-center justify-center gap-6'>
                  <Button variant='outline' size='sm' className='rounded-full px-6 font-bold text-xs h-9' disabled={page === 1} onClick={() => setPage(p => p - 1)}>Trang trước</Button>
                  <span className='text-xs font-black text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full'>
                      {page} / {Math.max(discussionsData?.totalPages || 1, reviewsData?.totalPages || 1)}
                  </span>
                  <Button variant='outline' size='sm' className='rounded-full px-6 font-bold text-xs h-9' disabled={page >= Math.max(discussionsData?.totalPages || 1, reviewsData?.totalPages || 1)} onClick={() => setPage(p => p + 1)}>Trang sau</Button>
              </div>
          )}
        </div>
      </main>
    </div>
  )
}

