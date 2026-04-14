'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, ArrowRight, Download, Users, Mail, Award, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PATH } from '@/constants/path'
import enrollmentApi from '@/app/(learner)/_api/enrollment.api'
import { toast } from 'sonner'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const courseIds = Array.from(new Set(searchParams.get('courseIds')?.split(',').filter(Boolean) || []))
  const [isEnrolling, setIsEnrolling] = useState(true)

  useEffect(() => {
    const enrollAll = async () => {
      if (courseIds.length === 0) {
        setIsEnrolling(false)
        return
      }

      try {
        await Promise.all(courseIds.map((id) => enrollmentApi.createEnrollment(id)))
        // toast.success('Đã kích hoạt khóa học thành công')
      } catch (error) {
        console.error('Enrollment failed:', error)
        toast.error('Có lỗi xảy ra khi kích hoạt khóa học')
      } finally {
        setIsEnrolling(false)
      }
    }

    enrollAll()
  }, [])

  return (
    <div className='min-h-screen bg-[oklch(0.98_0.005_286.32)] dark:bg-[oklch(0.12_0.005_285.823)] flex flex-col items-center justify-center py-16 px-6'>
      <div className='container max-w-[850px] flex flex-col items-center'>
        {/* Main Success Card */}
        <div className='w-full bg-white dark:bg-[oklch(0.141_0.005_285.823)] rounded-[60px] p-12 md:p-20 shadow-2xl shadow-[oklch(0.141_0.005_285.823)]/5 flex flex-col items-center text-center relative overflow-hidden'>
          {/* Decorative gradients */}
          <div className='absolute -top-24 -left-24 w-64 h-64 bg-[oklch(0.577_0.245_27.325)]/5 rounded-full blur-3xl' />
          <div className='absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl' />

          {/* Icon */}
          <div className='w-24 h-24 rounded-full bg-[oklch(0.577_0.245_27.325)] flex items-center justify-center text-white mb-10 shadow-xl shadow-[oklch(0.577_0.245_27.325)]/30 animate-in zoom-in-50 duration-500'>
            {isEnrolling ? <Loader2 size={48} className='animate-spin' /> : <Check size={48} strokeWidth={4} />}
          </div>

          <h1 className='text-4xl md:text-5xl font-extrabold text-[oklch(0.141_0.005_285.823)] dark:text-white mb-6'>
            {isEnrolling ? 'Đang kích hoạt...' : 'Thanh toán thành công!'}
          </h1>
          <p className='text-[oklch(0.552_0.016_285.938)] text-lg max-w-lg mb-12 font-medium leading-relaxed'>
            {isEnrolling
              ? 'Chúng tôi đang thiết lập khóa học cho bạn, vui lòng đợi trong giây lát.'
              : 'Chào mừng bạn đến với khóa học mới. Bạn đã có thể bắt đầu học ngay bây giờ.'}
          </p>

          {/* Receipt Summary Card (Simplified for mock) */}
          <div className='w-full max-w-xl bg-[oklch(0.577_0.245_27.325)]/5 dark:bg-[oklch(0.577_0.245_27.325)]/10 rounded-3xl p-8 mb-12 text-left border border-[oklch(0.577_0.245_27.325)]/10 relative'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8'>
              <div>
                <p className='text-[10px] uppercase tracking-widest font-black text-[oklch(0.552_0.016_285.938)] mb-2'>
                  Trạng thái
                </p>
                <h2 className='text-xl font-extrabold text-[oklch(0.141_0.005_285.823)] dark:text-white'>
                  {isEnrolling ? 'Đang xử lý' : 'Đã đăng ký thành công'}
                </h2>
              </div>
              <div className='text-right'>
                <p className='text-3xl font-black text-[oklch(0.577_0.245_27.325)]'>
                  {courseIds.length} khóa học
                </p>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-8 pt-6 border-t border-[oklch(0.577_0.245_27.325)]/20'>
              <div>
                <p className='text-[10px] uppercase tracking-widest font-black text-[oklch(0.552_0.016_285.938)] mb-1.5'>
                  Mã giao dịch
                </p>
                <p className='font-bold text-gray-900 dark:text-white'>#LP-{Math.floor(Math.random() * 90000000 + 10000000)}</p>
              </div>
              <div>
                <p className='text-[10px] uppercase tracking-widest font-black text-[oklch(0.552_0.016_285.938)] mb-1.5'>
                  Ngày thanh toán
                </p>
                <p className='font-bold text-gray-900 dark:text-white'>{new Date().toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-5 w-full max-w-md'>
            <Button
              asChild
              disabled={isEnrolling}
              className='flex-1 h-16 bg-[oklch(0.577_0.245_27.325)] hover:bg-[oklch(0.477_0.245_27.325)] text-white gap-2 rounded-2xl font-black text-lg shadow-lg shadow-[oklch(0.577_0.245_27.325)]/20 transition-all active:scale-[0.98]'
            >
              <Link href={PATH.MY_COURSES}>
                Bắt đầu học ngay <ArrowRight size={20} />
              </Link>
            </Button>
            <Button
              variant='outline'
              className='flex-1 h-16 border-slate-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-2xl font-black text-lg gap-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all'
            >
              <Download size={20} />
              Hóa đơn
            </Button>
          </div>
        </div>

        {/* Next Steps Section */}
        <div className='mt-20 w-full text-center'>
          <p className='text-[10px] uppercase tracking-[0.4em] font-black text-[oklch(0.552_0.016_285.938)] mb-12'>
            Các bước tiếp theo
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='bg-[oklch(0.577_0.245_27.325)]/5 dark:bg-[oklch(0.141_0.005_285.823)] p-8 rounded-[40px] border border-transparent hover:border-[oklch(0.577_0.245_27.325)]/20 transition-all group'>
              <div className='w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-[oklch(0.577_0.245_27.325)] mb-6 mx-auto shadow-sm group-hover:scale-110 transition-transform'>
                <Users size={24} />
              </div>
              <p className='font-extrabold text-gray-900 dark:text-white mb-2'>Join Community</p>
              <p className='text-xs text-[oklch(0.552_0.016_285.938)] font-medium leading-relaxed'>
                Kết nối với 5000+ học viên cùng đam mê biên tập.
              </p>
            </div>

            <div className='bg-[oklch(0.577_0.245_27.325)]/5 dark:bg-[oklch(0.141_0.005_285.823)] p-8 rounded-[40px] border border-transparent hover:border-[oklch(0.577_0.245_27.325)]/20 transition-all group'>
              <div className='w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-green-500 mb-6 mx-auto shadow-sm group-hover:scale-110 transition-transform'>
                <Mail size={24} />
              </div>
              <p className='font-extrabold text-gray-900 dark:text-white mb-2'>Check Email</p>
              <p className='text-xs text-[oklch(0.552_0.016_285.938)] font-medium leading-relaxed'>
                Kiểm tra hộp thư đến để nhận tài liệu hướng dẫn.
              </p>
            </div>

            <div className='bg-[oklch(0.577_0.245_27.325)]/5 dark:bg-[oklch(0.141_0.005_285.823)] p-8 rounded-[40px] border border-transparent hover:border-[oklch(0.577_0.245_27.325)]/20 transition-all group'>
              <div className='w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-500 mb-6 mx-auto shadow-sm group-hover:scale-110 transition-transform'>
                <Award size={24} />
              </div>
              <p className='font-extrabold text-gray-900 dark:text-white mb-2'>Get Certificate</p>
              <p className='text-xs text-[oklch(0.552_0.016_285.938)] font-medium leading-relaxed'>
                Hoàn thành khóa học để nhận chứng chỉ chuyên nghiệp.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Logo */}
        <div className='mt-20 opacity-30'>
          <p className='text-lg font-black tracking-tighter text-[oklch(0.141_0.005_285.823)] dark:text-white grayscale'>
            LearnProof
          </p>
        </div>
      </div>
    </div>
  )
}
