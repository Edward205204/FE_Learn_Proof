'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Star } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CategoryWithCount } from '@/schemas/course.schema'
import { Suspense } from 'react'

interface FilterSidebarProps {
  categories: CategoryWithCount[]
}

export default function FilterSidebar({ categories }: FilterSidebarProps) {
  return (
    <Suspense
      fallback={
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-slate-100 rounded w-1/2'></div>
          <div className='h-64 bg-slate-50 rounded'></div>
        </div>
      }
    >
      <FilterContent categories={categories} />
    </Suspense>
  )
}

function FilterContent({ categories }: { categories: CategoryWithCount[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const clearFilters = () => {
    router.push('/courses', { scroll: false })
  }

  return (
    <div className='flex flex-col gap-8 pr-4' suppressHydrationWarning>
      <div className='flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md py-2 z-10'>
        <h2 className='text-2xl font-black text-slate-900 tracking-tight'>Bộ lọc</h2>
        <button
          onClick={clearFilters}
          className='text-sm font-bold text-primary hover:text-primary/80 transition-colors bg-primary/5 px-3 py-1.5 rounded-full'
        >
          Xóa tất cả
        </button>
      </div>

      <Accordion type='multiple' defaultValue={['category', 'rating', 'level', 'feature']} className='w-full'>
        {/* Danh mục */}
        <AccordionItem value='category' className='border-b border-slate-100 py-3'>
          <AccordionTrigger className='hover:no-underline py-2 px-0 group'>
            <span className='font-black text-[17px] text-slate-800 group-hover:text-primary transition-colors'>
              Danh mục
            </span>
          </AccordionTrigger>
          <AccordionContent className='pt-2 pb-5'>
            <div className='flex flex-col gap-4'>
              {categories.map((cat) => (
                <div key={cat.id} className='flex items-center space-x-3 group cursor-pointer'>
                  <Checkbox
                    id={cat.id}
                    className='border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all'
                    checked={searchParams.get('category') === cat.slug}
                    onCheckedChange={(checked) => {
                      updateFilters('category', checked ? cat.slug : null)
                    }}
                  />
                  <Label
                    htmlFor={cat.id}
                    className='text-sm font-bold text-slate-600 group-hover:text-slate-900 leading-none cursor-pointer flex justify-between w-full transition-colors'
                  >
                    <span>{cat.name}</span>
                    <span className='text-slate-400 font-medium bg-slate-50 px-2 rounded-md'>{cat._count.courses}</span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Xếp hạng */}
        <AccordionItem value='rating' className='border-b border-slate-100 py-3'>
          <AccordionTrigger className='hover:no-underline py-2 px-0 group'>
            <span className='font-black text-[17px] text-slate-800 group-hover:text-primary transition-colors'>
              Xếp hạng
            </span>
          </AccordionTrigger>
          <AccordionContent className='pt-2 pb-5'>
            <div className='flex flex-col gap-4'>
              {[4.5, 4.0, 3.5, 3.0].map((star) => (
                <div key={star} className='flex items-center space-x-3 group cursor-pointer'>
                  <Checkbox
                    id={`star-${star}`}
                    className='border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all'
                    checked={searchParams.get('rating') === star.toString()}
                    onCheckedChange={(checked) => {
                      updateFilters('rating', checked ? star.toString() : null)
                    }}
                  />
                  <Label
                    htmlFor={`star-${star}`}
                    className='text-sm font-bold text-slate-600 group-hover:text-slate-900 leading-none cursor-pointer flex items-center gap-2.5 transition-colors'
                  >
                    <div className='flex items-center gap-0.5 text-amber-400 drop-shadow-sm'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          fill={i < Math.floor(star) ? 'currentColor' : 'none'}
                          className={i < Math.floor(star) ? '' : 'text-slate-200'}
                          strokeWidth={i < star ? 0 : 2}
                        />
                      ))}
                    </div>
                    <span className='pt-0.5'>{star} trở lên</span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tính năng */}
        <AccordionItem value='feature' className='border-b border-slate-100 py-3'>
          <AccordionTrigger className='hover:no-underline py-2 px-0 group'>
            <span className='font-black text-[17px] text-slate-800 group-hover:text-primary transition-colors'>
              Tính năng
            </span>
          </AccordionTrigger>
          <AccordionContent className='pt-2 pb-5'>
            <div className='flex flex-col gap-4'>
              {[
                { label: 'Trắc nghiệm', value: 'QUIZ' },
                { label: 'Bài kiểm tra', value: 'PRACTICE' }
              ].map((f) => (
                <div key={f.value} className='flex items-center space-x-3 group cursor-pointer'>
                  <Checkbox
                    id={`feat-${f.value}`}
                    className='border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all'
                    checked={searchParams.get('feature') === f.value}
                    onCheckedChange={(checked) => {
                      updateFilters('feature', checked ? f.value : null)
                    }}
                  />
                  <Label
                    htmlFor={`feat-${f.value}`}
                    className='text-sm font-bold text-slate-600 group-hover:text-slate-900 leading-none cursor-pointer transition-colors'
                  >
                    {f.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Trình độ */}
        <AccordionItem value='level' className='border-b border-slate-100 py-3'>
          <AccordionTrigger className='hover:no-underline py-2 px-0 group'>
            <span className='font-black text-[17px] text-slate-800 group-hover:text-primary transition-colors'>
              Trình độ
            </span>
          </AccordionTrigger>
          <AccordionContent className='pt-2 pb-5'>
            <div className='flex flex-col gap-4'>
              {[
                { label: 'Cơ bản', value: 'BEGINNER' },
                { label: 'Trung cấp', value: 'INTERMEDIATE' },
                { label: 'Nâng cao', value: 'ADVANCED' }
              ].map((lvl) => (
                <div key={lvl.value} className='flex items-center space-x-3 group cursor-pointer'>
                  <Checkbox
                    id={lvl.value}
                    className='border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all'
                    checked={searchParams.get('level') === lvl.value}
                    onCheckedChange={(checked) => {
                      updateFilters('level', checked ? lvl.value : null)
                    }}
                  />
                  <Label
                    htmlFor={lvl.value}
                    className='text-sm font-bold text-slate-600 group-hover:text-slate-900 leading-none cursor-pointer transition-colors'
                  >
                    {lvl.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
