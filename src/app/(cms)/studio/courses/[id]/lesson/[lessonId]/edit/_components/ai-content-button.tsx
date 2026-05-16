'use client'

import { useState } from 'react'
import { Sparkles, Loader2, Wand2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import lessonApi from '@/app/(cms)/_api/lesson.api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface AiContentButtonProps {
  lessonId: string
  onGenerated: (content: string) => void
  disabled?: boolean
}

export const AiContentButton = ({ lessonId, onGenerated, disabled }: AiContentButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async (keywords?: string) => {
    setIsLoading(true)
    const toastId = toast.loading('AI đang biên soạn nội dung...', {
      description: 'Quá trình này có thể mất 15-30 giây.'
    })

    try {
      const response = await lessonApi.generateAiContent(lessonId, keywords)
      onGenerated(response.data.content)
      toast.success('Đã tạo nội dung thành công!', { id: toastId })
    } catch (error) {
      console.error('AI generation error:', error)
      toast.error('Không thể tạo nội dung bằng AI.', { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex items-center gap-1'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            disabled={disabled || isLoading}
            className={cn(
              'gap-2 font-bold shadow-sm transition-all',
              isLoading ? 'bg-muted' : 'bg-gradient-to-r from-primary/5 to-orange-500/5 hover:from-primary/10 hover:to-orange-500/10 border-primary/20'
            )}
          >
            {isLoading ? (
              <Loader2 className='size-3.5 animate-spin text-primary' />
            ) : (
              <Wand2 className='size-3.5 text-primary' />
            )}
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500'>
              AI Assistant
            </span>
            <ChevronDown className='size-3.5 opacity-50' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-56 p-2 rounded-2xl bg-card/95 backdrop-blur-xl border-white/10 shadow-2xl'>
          <div className='px-3 py-2 mb-1'>
            <p className='text-[10px] font-black uppercase tracking-widest text-primary'>Creative Engine</p>
          </div>
          <DropdownMenuItem
            onClick={() => handleGenerate()}
            className='rounded-xl gap-3 py-2.5 focus:bg-primary/10 focus:text-primary cursor-pointer'
          >
            <Sparkles className='size-4' />
            <div className='flex flex-col'>
              <span className='font-bold text-xs'>Soạn thảo từ tiêu đề</span>
              <span className='text-[9px] opacity-60'>Tự động viết nội dung chi tiết</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator className='bg-white/5' />
          <DropdownMenuItem
            onClick={() => {
              const kw = window.prompt('Nhập các từ khóa chính (cách nhau bằng dấu phẩy):')
              if (kw) handleGenerate(kw)
            }}
            className='rounded-xl gap-3 py-2.5 focus:bg-orange-500/10 focus:text-orange-500 cursor-pointer'
          >
            <Wand2 className='size-4' />
            <div className='flex flex-col'>
              <span className='font-bold text-xs'>Viết theo từ khóa</span>
              <span className='text-[9px] opacity-60'>Tùy chỉnh nội dung theo ý muốn</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
