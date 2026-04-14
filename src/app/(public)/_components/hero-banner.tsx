import Link from 'next/link'

export default function HeroBanner() {
  return (
    <section className='relative overflow-hidden bg-[oklch(0.141_0.005_285.823)] rounded-b-3xl'>
      {/* Banner image */}
      <div
        className='absolute inset-0 bg-cover bg-center opacity-40'
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCuwHw3dsedRQeyFxU1F1LArDnMKnE5zlSsFTgtC9pShmdjoiLoeDYtTq2gVIpdVtqFQTvHwMPcHNm_tG88HmC9rzCIhJT2wTGaYClZD9UbJ-mUuBENnE7JjTRj17fd8eANYKbAHbHXmwLWZxsHP5BMvRYiPfL24IM1Q9NAHJywCH5Pn4P2vIBvn5sfwFmzZ2SLgc7nBLQa_SOt0Wir1lNLyeDbll9NkTmPQoSRK4o8lOPLvT6sXr4sMNc6H27s5DYOzomErmRq2mE')"
        }}
      />

      {/* Background glow orbs */}
      <div className='absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none' />
      <div className='absolute top-1/4 right-1/4 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none' />

      <div className='relative max-w-[1200px] mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
        {/* Content */}
        <div className='flex flex-col gap-6'>
          <h1 className='text-4xl md:text-5xl font-black leading-[1.1] tracking-tight text-white'>
            Chứng chỉ
            <br />
            <span className='text-primary'>xác thực Blockchain</span>
          </h1>

          <p className='text-[oklch(0.75_0.01_285)] text-base leading-relaxed max-w-[40ch]'>
            Học từ các chuyên gia hàng đầu. Nhận chứng chỉ được xác thực trên Blockchain — không thể làm giả, không thể
            mất, mãi mãi thuộc về bạn.
          </p>

          <div className='flex gap-3 flex-wrap'>
            <Link
              href='/courses'
              className='inline-flex items-center justify-center h-11 px-6 rounded-md bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/30 hover:-translate-y-0.5 hover:shadow-primary/40 transition-all'
            >
              Đăng ký ngay
            </Link>
            <Link
              href='/courses'
              className='inline-flex items-center justify-center h-11 px-6 rounded-md border border-white/20 text-white text-sm font-bold hover:bg-white/10 transition-colors'
            >
              Xem hoạt động
            </Link>
          </div>
        </div>

        {/* Decorative nodes */}
        <div className='hidden md:block relative h-72'>
          {[
            { top: '15%', left: '25%' },
            { top: '35%', left: '60%' }
          ].map((n, i) => (
            <span
              key={i}
              className='absolute w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_12px_currentColor] text-primary animate-pulse'
              style={{ top: n.top, left: n.left }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
