'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export default function CtaSection() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setTimeout(() => {
      toast.success('Đăng ký thành công! Chào mừng bạn đến với LearnProof.')
      setEmail('')
      setLoading(false)
    }, 800)
  }

  return (
    <section className='mt-12 rounded-2xl bg-[oklch(0.141_0.005_285.823)] px-6 py-16 text-center'>
      <div className='max-w-lg mx-auto flex flex-col items-center gap-5'>
        <h2 className='text-3xl md:text-4xl font-black text-white tracking-tight leading-tight'>
          Bắt đầu hành trình ngay hôm nay
        </h2>
        <p className='text-sm text-[oklch(0.65_0.01_285)] leading-relaxed max-w-[36ch]'>
          Tham gia hơn 10.000 học viên đã tin tưởng và thực hành kỹ năng công nghệ hàng đầu thế giới.
        </p>

        <form onSubmit={handleSubmit} className='flex w-full gap-2 flex-wrap'>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Nhập email của bạn...'
            required
            aria-label='Email đăng ký'
            className='flex-1 min-w-0 h-11 px-4 rounded-md text-sm bg-[oklch(0.22_0.006_285)] border border-[oklch(0.32_0.006_286)] text-white placeholder:text-[oklch(0.5_0.01_285)] outline-none focus:border-primary transition-colors'
          />
          <button
            type='submit'
            disabled={loading}
            className='h-11 px-5 rounded-md bg-primary text-primary-foreground text-sm font-bold whitespace-nowrap hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity'
          >
            {loading ? 'Đang gửi...' : 'Bắt đầu ngay'}
          </button>
        </form>
      </div>
    </section>
  )
}
