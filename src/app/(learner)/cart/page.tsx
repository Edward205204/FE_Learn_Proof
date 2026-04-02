'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, Trash2, Tag, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react'
import { useCartQuery, useRemoveFromCartMutation } from '../_hooks/use-cart'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { PATH } from '@/constants/path'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function CartPage() {
  const { data: cartData, isLoading } = useCartQuery()
  const removeMutation = useRemoveFromCartMutation()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const cartItems = useMemo(() => cartData?.items || [], [cartData])

  const deletingCourse = useMemo(
    () => cartItems.find((item) => item.courseId === deletingId)?.course,
    [cartItems, deletingId]
  )

  const totalPrice = useMemo(() => cartItems.reduce((sum, item) => sum + item.course.price, 0), [cartItems])
  const totalOriginalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.course.originalPrice || item.course.price), 0),
    [cartItems]
  )
  const discount = totalOriginalPrice - totalPrice

  const handleDeleteCart = () => {
    if (deletingId) {
      removeMutation.mutate(deletingId, {
        onSuccess: () => {
          setDeletingId(null)
          toast.success('Đã xóa sản phẩm khỏi giỏ hàng')
        }
      })
    }
  }


  if (isLoading) {
    return (
      <div className='container mx-auto py-10 px-6 max-w-[1200px]'>
        <div className='h-[400px] flex items-center justify-center'>
          <div className='w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin'></div>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-10 px-6 max-w-[1200px]' suppressHydrationWarning>
      <nav className='flex items-center gap-2 text-[12px] font-black tracking-widest uppercase text-slate-400 mb-8 mt-2'>
        <Link href='/' className='hover:text-[oklch(0.577_0.245_27.325)] transition-colors'>
          Trang chủ
        </Link>
        <ChevronRight size={14} />
        <span className='text-[oklch(0.577_0.245_27.325)]'>Giỏ hàng</span>
      </nav>
      <h1 className='text-3xl font-bold mb-8 text-[oklch(0.141_0.005_285.823)] dark:text-white'>
        Giỏ hàng của bạn ({cartItems.length})
      </h1>

      <div className='flex flex-col lg:flex-row gap-10'>
        {cartItems.length === 0 ? (
          <div className='w-full p-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800'>
            <div className='flex justify-center mb-4'>
              <div className='w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center'>
                <Tag size={40} className='text-slate-400' />
              </div>
            </div>
            <p className='text-lg font-medium text-slate-900 dark:text-white mb-2'>Giỏ hàng của bạn đang trống</p>
            <p className='text-slate-500 mb-6 text-sm'>
              Hãy khám phá hàng ngàn khóa học hấp dẫn để bắt đầu hành trình học tập.
            </p>
            <Button asChild className='bg-[oklch(0.577_0.245_27.325)] hover:opacity-90'>
              <Link href='/'>Khám phá khóa học ngay</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className='lg:w-2/3 flex flex-col gap-6'>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className='flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)] bg-white dark:bg-[oklch(0.141_0.005_285.823)] relative pr-12 group transition-all hover:shadow-sm'
                >
                  <div className='w-full sm:w-40 aspect-video sm:aspect-square md:aspect-[4/3] rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800 relative'>
                    <Image
                      src={item.course.thumbnail || ''}
                      alt={item.course.title}
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                  </div>

                  <div className='flex-1 flex flex-col justify-between py-1'>
                    <div>
                      <h3 className='font-semibold text-lg line-clamp-2 text-gray-900 dark:text-white hover:text-[oklch(0.577_0.245_27.325)] transition-colors'>
                        <Link href={`/courses/${item.courseId}`}>{item.course.title}</Link>
                      </h3>
                      <p className='text-sm text-[oklch(0.552_0.016_285.938)] mt-1'>
                        bởi <span className='text-blue-500'>{item.course.creator.fullName}</span>
                      </p>

                      <div className='flex items-center gap-2 mt-2'>
                        <span className='font-bold text-[oklch(0.577_0.245_27.325)] text-sm'>5.0</span>
                        <div className='flex text-[oklch(0.577_0.245_27.325)]'>
                          <Star size={14} fill='currentColor' />
                        </div>
                        <span className='text-xs text-[oklch(0.552_0.016_285.938)]'>(0 đánh giá)</span>
                      </div>
                    </div>

                    <div className='mt-4 flex sm:hidden items-center gap-3'>
                      <span className='text-xl font-bold text-[oklch(0.577_0.245_27.325)]'>
                        {item.course.price.toLocaleString('vi-VN')} đ
                      </span>
                      {(item.course.originalPrice || item.course.price) > item.course.price && (
                        <span className='text-sm text-[oklch(0.552_0.016_285.938)] line-through'>
                          {item.course.originalPrice?.toLocaleString('vi-VN')} đ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price Right side */}
                  <div className='hidden sm:flex flex-col items-end gap-2 shrink-0 w-32 justify-between'>
                    <div className='text-right'>
                      <div className='text-xl font-bold text-[oklch(0.577_0.245_27.325)] block'>
                        {item.course.price.toLocaleString('vi-VN')} đ
                      </div>
                      {(item.course.originalPrice || item.course.price) > item.course.price && (
                        <div className='text-sm text-[oklch(0.552_0.016_285.938)] line-through mt-1'>
                          {item.course.originalPrice?.toLocaleString('vi-VN')} đ
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    className='absolute top-4 right-4 text-[oklch(0.552_0.016_285.938)] hover:text-red-500 transition-colors p-1 disabled:opacity-50'
                    title='Xóa khỏi giỏ hàng'
                    onClick={() => setDeletingId(item.courseId)}
                    disabled={removeMutation.isPending}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Checkout Summary */}
            <div className='lg:w-1/3'>
              <div className='p-8 rounded-3xl border border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)] bg-white dark:bg-[oklch(0.141_0.005_285.823)] shadow-xl shadow-slate-100 dark:shadow-none'>
                <h2 className='text-xl font-black mb-8 text-gray-900 dark:text-white uppercase tracking-wider'>Tổng cộng</h2>

                <div className='space-y-4 mb-8 text-sm font-medium text-gray-600 dark:text-[oklch(0.552_0.016_285.938)]'>
                  <div className='flex items-center justify-between'>
                    <span>Tạm tính:</span>
                    <span className='font-bold text-gray-900 dark:text-white'>
                      {totalOriginalPrice.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className='flex items-center justify-between text-green-600 dark:text-green-500'>
                    <span>Giảm giá:</span>
                    <span className='font-bold'>-{discount.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className='flex items-center gap-2 pt-6 border-t border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)]'>
                    <div className='flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-xl border border-transparent focus-within:border-[oklch(0.577_0.245_27.325)]/30 transition-all'>
                      <Tag size={16} className='text-[oklch(0.552_0.016_285.938)]' />
                      <input
                        type='text'
                        placeholder='Nhập mã ưu đãi...'
                        className='bg-transparent border-none outline-none text-xs w-full focus:ring-0 dark:text-white placeholder:text-[oklch(0.552_0.016_285.938)] font-bold'
                      />
                    </div>
                    <button className='text-[oklch(0.577_0.245_27.325)] dark:text-rose-400 font-black text-xs hover:scale-105 transition-transform uppercase tracking-tighter'>
                      Áp dụng
                    </button>
                  </div>
                </div>

                <div className='pt-6 border-t border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)] mb-8'>
                  <div className='flex items-end justify-between mb-2'>
                    <span className='font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest'>
                      Thành tiền:
                    </span>
                    <span className='text-4xl font-black text-[oklch(0.577_0.245_27.325)]'>
                      {totalPrice.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <p className='text-[10px] uppercase font-black text-[oklch(0.552_0.016_285.938)] text-right tracking-widest opacity-80'>
                    Đã bao gồm phí & thuế
                  </p>
                </div>

                <Button
                  asChild
                  className='w-full h-16 bg-[oklch(0.577_0.245_27.325)] hover:opacity-90 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] mb-4 shadow-xl shadow-[oklch(0.577_0.245_27.325)]/20'
                >
                  <Link href={PATH.CHECKOUT}>
                    Tiến hành thanh toán <ArrowRight size={22} />
                  </Link>
                </Button>

                <div className='flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-[oklch(0.552_0.016_285.938)] mt-8'>
                  <ShieldCheck size={14} className='text-green-500' />
                  <span>Cam kết bảo mật & An toàn</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className='sm:max-w-md bg-white dark:bg-[oklch(0.141_0.005_285.823)] rounded-[32px] border-none shadow-2xl'>
          <DialogHeader className='pt-4'>
            <DialogTitle className='text-2xl font-black text-gray-900 dark:text-white'>Xác nhận xóa</DialogTitle>
            <DialogDescription className='text-base font-medium text-[oklch(0.552_0.016_285.938)] pt-2 leading-relaxed'>
              Bạn có chắc chắn muốn xóa khóa học{' '}
              <span className='font-black text-gray-900 dark:text-white'>&quot;{deletingCourse?.title}&quot;</span> khỏi
              giỏ hàng không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex sm:justify-end gap-3 pb-4 pt-6'>
            <Button variant='outline' onClick={() => setDeletingId(null)} className='h-12 rounded-xl font-bold border-2 px-6'>
              Hủy
            </Button>
            <Button
              variant='destructive'
              onClick={handleDeleteCart}
              disabled={removeMutation.isPending}
              className='h-12 rounded-xl font-bold px-8 bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20'
            >
              {removeMutation.isPending ? 'Đang xóa...' : 'Xác nhận xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
