'use client'

import { useState, useTransition, useRef, useEffect, Fragment } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getSearchSuggestionsAction } from '@/actions/course-search'
import { useDebounce } from '@/hooks/use-debounce'
import { SearchSuggestion } from '@/app/(public)/_api/course.api'

interface SearchInputProps {
  className?: string
  placeholder?: string
}

function HighlightedText({ text, keyword }: { text: string; keyword: string }) {
  if (!keyword.trim()) return <>{text}</>
  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <span key={i} className='text-[oklch(0.577_0.245_27.325)] font-bold'>
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </span>
  )
}

export default function SearchInput({
  className = '',
  placeholder = 'Tìm kiếm khóa học thực chiến...'
}: SearchInputProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    if (debouncedSearchQuery.trim().length >= 2) {
      startTransition(async () => {
        try {
          const result = await getSearchSuggestionsAction(debouncedSearchQuery)
          if (result.success) {
            setSuggestions(result.data)
            setIsSuggestionsOpen(true)
            setSelectedIndex(-1)
          }
        } catch (error) {
          console.error('Failed to fetch suggestions:', error)
        }
      })
    } else {
      startTransition(() => {
        setSuggestions([])
        setIsSuggestionsOpen(false)
        setSelectedIndex(-1)
      })
    }
  }, [debouncedSearchQuery])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        if (!isSuggestionsOpen || suggestions.length === 0) return
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        if (!isSuggestionsOpen || suggestions.length === 0) return
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (isSuggestionsOpen && selectedIndex >= 0 && suggestions.length > 0) {
          const selectedCourse = suggestions[selectedIndex]
          router.push(`/courses/${selectedCourse.slug}`)
        } else if (searchQuery.trim().length > 0) {
          router.push(`/search?search=${encodeURIComponent(searchQuery)}`)
        }
        setIsSuggestionsOpen(false)
        break
      case 'Escape':
        setIsSuggestionsOpen(false)
        break
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSuggestionsOpen(false)
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`} ref={searchRef} onKeyDown={handleKeyDown}>
      <div
        className={`group relative flex h-11 items-center transition-all duration-300 ease-in-out
          ${isFocused ? 'w-full md:w-[320px]' : 'w-full md:w-64'}
          bg-[oklch(0.967_0.001_0)] dark:bg-[oklch(0.21_0.006_285.885)] 
          border ${isFocused ? 'border-[oklch(0.577_0.245_27.325)] shadow-[0_0_15px_rgba(234,88,12,0.1)]' : 'border-transparent'} 
          rounded-full px-4 overflow-hidden`}
      >
        <div className='flex items-center justify-center text-[oklch(0.552_0.016_285.938)] transition-colors group-focus-within:text-[oklch(0.577_0.245_27.325)]'>
          {isPending ? <Loader2 size={18} className='animate-spin' /> : <Search size={18} />}
        </div>

        <Input
          className='w-full border-none bg-transparent px-3 text-sm font-medium focus-visible:ring-0 placeholder:text-[oklch(0.552_0.016_285.938)]/70'
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true)
            if (searchQuery.length >= 2) setIsSuggestionsOpen(true)
          }}
        />

        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('')
              setIsSuggestionsOpen(false)
            }}
            className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors'
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Results Dropdown - Glassmorphism UI */}
      {isSuggestionsOpen && searchQuery.length >= 2 && (
        <div
          className='absolute top-full left-0 mt-3 w-full md:w-[420px] 
            bg-white/90 dark:bg-[oklch(0.141_0.005_285.823)]/95 
            backdrop-blur-xl border border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)] 
            rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[60] overflow-hidden 
            animate-in fade-in slide-in-from-top-3 duration-300'
        >
          <div className='p-2'>
            <p className='px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[oklch(0.552_0.016_285.938)]'>
              Kết quả gợi ý
            </p>

            {suggestions.length > 0 ? (
              <div className='space-y-1'>
                {suggestions.map((course, index) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group
                      ${
                        selectedIndex === index
                          ? 'bg-[oklch(0.577_0.245_27.325)]/10 translate-x-1'
                          : 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:translate-x-1'
                      }`}
                    onClick={() => setIsSuggestionsOpen(false)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className='relative h-14 w-24 flex-shrink-0 overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-shadow'>
                      <Image
                        fill
                        src={
                          course.thumbnail ||
                          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80'
                        }
                        alt={course.title}
                        className='object-cover transition-transform duration-500 group-hover:scale-110'
                      />
                    </div>
                    <div className='flex flex-col min-w-0 flex-1 gap-0.5'>
                      <h4 className='text-sm font-bold text-[oklch(0.141_0.005_285.823)] dark:text-white truncate leading-tight transition-colors group-hover:text-[oklch(0.577_0.245_27.325)]'>
                        <HighlightedText text={course.title} keyword={searchQuery} />
                      </h4>
                      <p className='text-xs font-bold text-[oklch(0.577_0.245_27.325)]'>
                        {course.price === 0 || !course.price ? 'Miễn phí' : `${course.price.toLocaleString()} IDRT`}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className='p-8 text-center flex flex-col items-center gap-3'>
                <div className='p-4 bg-orange-50 dark:bg-orange-900/10 rounded-full text-[oklch(0.577_0.245_27.325)]'>
                  <Search size={24} />
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-bold text-[oklch(0.141_0.005_285.823)] dark:text-white'>
                    Không tìm thấy kết quả
                  </p>
                  <p className='text-xs text-[oklch(0.552_0.016_285.938)]'>
                    Hãy thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả.
                  </p>
                </div>
              </div>
            )}
          </div>

          {suggestions.length > 0 && (
            <Link
              href={`/search?search=${encodeURIComponent(searchQuery)}`}
              className='flex items-center justify-center w-full py-4 bg-gray-50/80 dark:bg-white/5 hover:bg-[oklch(0.577_0.245_27.325)] hover:text-white text-xs font-bold text-[oklch(0.552_0.016_285.938)] transition-all gap-2 group/all'
              onClick={() => setIsSuggestionsOpen(false)}
            >
              Xem tất cả kết quả
              <Search size={14} className='transition-transform group-hover/all:translate-x-1' />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
