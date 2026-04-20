'use client'

import { useEffect, useState } from 'react'
import { Brain, CheckCircle2, RefreshCw, Database } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export function AIProcessingScreen() {
  const [progress, setProgress] = useState(0)
  const [_status, setStatus] = useState('DANG_XU_LY')

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setStatus('HOAN_THANH')
          return 100
        }
        return prev + 1
      })
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='flex flex-col items-center justify-center py-12 px-6 text-center max-w-xl mx-auto'>
      {/* Animated Brain Icon Container */}
      <div className='relative w-48 h-48 mb-12 flex items-center justify-center'>
        {/* Pulsing rings */}
        <div className='absolute inset-0 border-2 border-primary/10 rounded-full animate-ping duration-[3s]' />
        <div className='absolute inset-4 border-2 border-primary/20 rounded-full animate-ping duration-[2s]' />

        {/* Orbiting dots */}
        <div className='absolute inset-0 animate-spin duration-[10s]'>
          <div className='absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]' />
        </div>

        {/* Center brain Icon */}
        <div className='w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center shadow-xl border-4 border-white'>
          <Brain className='w-16 h-16 text-primary animate-pulse' />
        </div>
      </div>

      <h2 className='text-3xl font-extrabold text-foreground mb-4'>AI đang phân tích dữ liệu...</h2>
      <p className='text-muted-foreground mb-12'>
        Đang tối ưu hóa lộ trình học tập riêng biệt cho <span className='text-primary font-bold'>bạn...</span>
      </p>

      <div className='w-full mb-8'>
        <div className='flex justify-between items-end mb-3'>
          <div className='text-left'>
            <span className='text-[10px] font-bold text-primary uppercase tracking-widest block mb-1'>Đang xử lý</span>
            <span className='text-xs text-muted-foreground font-medium'>Thuật toán Bayes & Neural Networks</span>
          </div>
          <span className='text-2xl font-black text-primary/40'>{progress}%</span>
        </div>
        <Progress value={progress} className='h-3 bg-secondary rounded-full' />
      </div>

      <div className='flex flex-wrap justify-center gap-4'>
        <StatusBadge icon={<CheckCircle2 className='w-3.5 h-3.5' />} text='Dữ liệu đầu vào' active={progress > 30} />
        <StatusBadge icon={<RefreshCw className='w-3.5 h-3.5' />} text='Cấu trúc lộ trình' active={progress > 60} />
        <StatusBadge icon={<Database className='w-3.5 h-3.5' />} text='Tạo tài liệu học' active={progress > 90} />
      </div>

      <div className='mt-16 text-[10px] text-muted-foreground/60 flex items-center gap-1'>
        <CheckCircle2 className='w-3 h-3' />
        Bảo mật dữ liệu bởi LearnProof AI Engine
      </div>
    </div>
  )
}

function StatusBadge({ icon, text, active }: { icon: React.ReactNode; text: string; active: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-500',
        active
          ? 'bg-green-50 border-green-200 text-green-600'
          : 'bg-secondary border-secondary text-muted-foreground/40'
      )}
    >
      {icon}
      {text}
    </div>
  )
}
