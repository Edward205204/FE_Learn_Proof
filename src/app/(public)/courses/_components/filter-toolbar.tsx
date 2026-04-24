'use client'

import { Button } from '@/components/ui/button'
import { SlidersHorizontal, ChevronDown, HelpCircle, FileCheck } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useRouter, useSearchParams } from 'next/navigation'

interface FilterToolbarProps {
  onToggleSidebar: () => void
  showSidebar: boolean
}

const QUICK_FILTERS = [
  { label: 'Trắc nghiệm', icon: <HelpCircle size={16} />, value: 'QUIZ' },
  { label: 'Bài kiểm tra', icon: <FileCheck size={16} />, value: 'PRACTICE' }
]

export default function FilterToolbar({ onToggleSidebar, showSidebar }: FilterToolbarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort') || 'relevant'
  const currentFeature = searchParams.get('feature')

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className='flex items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200/60 overflow-x-auto no-scrollbar'>
      <div className='flex items-center gap-4'>
        {/* Main Filter Toggle */}
        <Button
          variant='outline'
          onClick={onToggleSidebar}
          className={`h-11 px-6 rounded-full border-slate-200 shadow-sm font-bold gap-2.5 transition-all duration-300 ${
            showSidebar
              ? 'bg-slate-900 text-white border-slate-900 shadow-slate-200'
              : 'bg-white hover:bg-slate-50 hover:border-slate-300 hover:shadow-md'
          }`}
        >
          <SlidersHorizontal size={18} />
          <span className='whitespace-nowrap'>Tất cả bộ lọc</span>
        </Button>

        <div className='h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block' />

        {/* Quick Pills */}
        <div className='flex items-center gap-2.5'>
          {QUICK_FILTERS.map((f) => {
            const isActive = currentFeature === f.value
            return (
              <Button
                key={f.value}
                variant='outline'
                onClick={() => updateFilters('feature', isActive ? null : f.value)}
                className={`h-11 px-6 rounded-full font-bold gap-2.5 whitespace-nowrap transition-all duration-300 shadow-sm ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-primary/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <span className={isActive ? 'text-primary-foreground/90' : 'text-primary/80'}>{f.icon}</span>
                {f.label}
              </Button>
            )
          })}
        </div>

        {/* Action Dropdowns */}
        <div className='flex items-center gap-2.5'>
          {/* Xếp hạng */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='h-11 px-6 rounded-full border-slate-200 bg-white shadow-sm font-bold gap-2.5 whitespace-nowrap transition-all hover:bg-slate-50 hover:shadow-md hover:border-slate-300'
              >
                Xếp hạng{' '}
                <ChevronDown size={16} className='text-slate-400 group-hover:text-slate-600 transition-colors' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='rounded-2xl p-2 w-56 shadow-2xl border-slate-200/60'>
              {[4.5, 4.0, 3.5, 3.0].map((r) => (
                <DropdownMenuItem
                  key={r}
                  onClick={() => updateFilters('rating', r.toString())}
                  className='rounded-xl font-bold py-3 px-4 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors'
                >
                  Từ {r} sao trở lên
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cấp độ */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='h-11 px-6 rounded-full border-slate-200 bg-white shadow-sm font-bold gap-2.5 whitespace-nowrap transition-all hover:bg-slate-50 hover:shadow-md hover:border-slate-300'
              >
                Cấp độ <ChevronDown size={16} className='text-slate-400 group-hover:text-slate-600 transition-colors' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='rounded-2xl p-2 w-56 shadow-2xl border-slate-200/60'>
              {[
                { label: 'Cơ bản', value: 'BEGINNER' },
                { label: 'Trung cấp', value: 'INTERMEDIATE' },
                { label: 'Nâng cao', value: 'ADVANCED' }
              ].map((l) => (
                <DropdownMenuItem
                  key={l.value}
                  onClick={() => updateFilters('level', l.value)}
                  className='rounded-xl font-bold py-3 px-4 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors'
                >
                  {l.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Sort Section */}
      <div className='flex items-center gap-3 ml-auto shrink-0 bg-slate-50/50 p-1.5 pl-5 rounded-full border border-slate-100 shadow-sm'>
        <span className='text-sm font-bold text-slate-500 uppercase tracking-tight'>Sắp xếp theo</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-10 font-black gap-2 pr-4 hover:bg-transparent text-primary group'>
              {sort === 'newest'
                ? 'Mới nhất'
                : sort === 'popular'
                  ? 'Phổ biến nhất'
                  : sort === 'rating_desc'
                    ? 'Đánh giá cao nhất'
                    : 'Liên quan nhất'}
              <ChevronDown size={16} className='group-hover:translate-y-0.5 transition-transform' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='rounded-2xl p-2 w-56 shadow-2xl border-slate-200/60'>
            {[
              { label: 'Liên quan nhất', value: 'relevant' },
              { label: 'Phổ biến nhất', value: 'popular' },
              { label: 'Đánh giá cao nhất', value: 'rating_desc' },
              { label: 'Mới nhất', value: 'newest' }
            ].map((s) => (
              <DropdownMenuItem
                key={s.value}
                onClick={() => updateFilters('sort', s.value)}
                className='rounded-xl font-bold py-3 px-4 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors'
              >
                {s.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
