'use client'

import { useState } from 'react'
import { Award, ShieldCheck, Lock, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CertificateActionProps {
  progress: number // Phần trăm tiến độ học tập
  courseName: string
}

export function CertificateAction({ progress, courseName }: CertificateActionProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const isEligible = progress === 100

  const handleIssueCertificate = async () => {
    if (!isEligible || isGenerating) return

    setIsGenerating(true)
    // Giả lập quá trình tạo Hash lên Blockchain
    setTimeout(() => {
      setIsGenerating(false)
      setIsSuccess(true)
    }, 3000)
  }

  return (
    <div className='max-w-4xl mx-auto space-y-10 p-6'>
      {/* TRẠNG THÁI TIẾN ĐỘ */}
      <div className='bg-white rounded-[40px] p-10 shadow-sm border border-slate-50 relative overflow-hidden'>
        <div className='relative z-10'>
          <span className='text-[10px] font-black uppercase text-primary tracking-[0.2em]'>Trạng thái hiện tại</span>
          <div className='flex justify-between items-end mt-2 mb-6'>
            <h2 className='text-4xl font-black text-slate-900'>Tiến độ học tập</h2>
            <div className='text-right'>
              <span className='text-5xl font-black text-primary leading-none'>{progress}%</span>
              <p className='text-xs font-bold text-slate-400 mt-1'>Hoàn thành khóa học</p>
            </div>
          </div>

          {/* Thanh Progress Bar bám sát thiết kế */}
          <div className='w-full bg-slate-100 h-4 rounded-full overflow-hidden'>
            <div
              className='bg-primary h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(225,29,72,0.3)]'
              style={{ width: `${progress}%` }}
            />
          </div>

          {isEligible && (
            // Đổi thẻ <p> thành <div> để chứa được thẻ <div> bên trong
            <div className='mt-6 flex items-center gap-2 text-sm font-bold text-emerald-500'>
              <div className='w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white'>
                <ShieldCheck size={12} />
              </div>
              <span>Chúc mừng! Bạn đã đủ điều kiện để nhận chứng chỉ.</span>
            </div>
          )}
        </div>
      </div>

      {/* KHU VỰC CẤP CHỨNG CHỈ */}
      <div className='bg-white rounded-[40px] p-10 shadow-sm border border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-10 items-center'>
        <div className='space-y-6'>
          <h3 className='text-2xl font-black text-slate-900 tracking-tight'>Cấp chứng chỉ khóa học {courseName}</h3>
          <p className='text-sm text-slate-500 leading-relaxed font-medium'>
            Chứng chỉ của bạn sẽ được lưu trữ vĩnh viễn và bảo mật trên Blockchain. Bạn có thể sử dụng mã Hash để xác
            thực năng lực với nhà tuyển dụng.
          </p>

          {isEligible ? (
            <div className='space-y-4'>
              <button
                onClick={handleIssueCertificate}
                disabled={isGenerating || isSuccess}
                className={cn(
                  'w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl',
                  isSuccess
                    ? 'bg-emerald-500 text-white cursor-default'
                    : 'bg-primary hover:bg-rose-600 text-white shadow-rose-100 active:scale-[0.98]'
                )}
              >
                {isGenerating ? (
                  <span className='flex items-center gap-2'>
                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    Đang tạo Hash...
                  </span>
                ) : isSuccess ? (
                  <>
                    <Sparkles size={20} /> Đã cấp chứng chỉ thành công
                  </>
                ) : (
                  <>
                    <Award size={20} /> Nhận chứng chỉ ngay
                  </>
                )}
              </button>

              {isSuccess && (
                <div className='p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3'>
                  <ShieldCheck className='text-emerald-500 shrink-0' />
                  <div className='text-[11px]'>
                    <p className='font-bold text-emerald-700'>Chứng chỉ đã được xác thực trên Blockchain!</p>
                    <p className='text-emerald-600 font-mono mt-0.5'>TxID: 0x71c...a4f2</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Nút khi chưa đủ điều kiện */
            <div className='bg-slate-50 border border-slate-100 p-6 rounded-[30px] flex items-center justify-between opacity-60 cursor-not-allowed'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400'>
                  <Lock size={20} />
                </div>
                <div>
                  <p className='text-sm font-bold text-slate-800 uppercase tracking-tight'>
                    Chưa đủ điều kiện nhận chứng chỉ
                  </p>
                  <p className='text-[10px] font-bold text-slate-400'>Hoàn thành 100% khóa học để nhận chứng chỉ</p>
                </div>
              </div>
              <button disabled className='px-6 py-3 bg-slate-200 text-slate-400 rounded-xl font-black text-xs'>
                Nhận chứng chỉ
              </button>
            </div>
          )}
        </div>

        {/* Thumbnail Preview Chứng chỉ */}
        <div className='relative group cursor-pointer'>
          <div className='absolute inset-0 bg-primary/20 blur-[60px] rounded-full opacity-30 group-hover:opacity-50 transition-opacity' />
          <div className='relative border-8 border-white shadow-2xl rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 flex items-center justify-center'>
            <Award size={64} className='text-slate-200' />
            <div className='absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent' />
          </div>
        </div>
      </div>
    </div>
  )
}
