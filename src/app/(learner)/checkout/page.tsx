'use client'

import { useState, useMemo } from 'react'
import {
  CreditCard,
  Wallet,
  QrCode,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  BadgeCheck,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartQuery, useCreatePaymentFromCartMutation } from '../_hooks/use-cart'
import { toast } from 'sonner'

const PAYMENT_METHODS = [
  {
    id: 'qr',
    name: 'QR Pay',
    description: 'Chuyển khoản ngân hàng 24/7',
    icon: <QrCode size={24} />
  },
  {
    id: 'card',
    name: 'Thẻ quốc tế',
    description: 'Visa, Mastercard, JCB',
    icon: <CreditCard size={24} />
  },
  {
    id: 'momo',
    name: 'Ví MoMo',
    description: 'Thanh toán nhanh qua ứng dụng',
    icon: <Wallet size={24} className='text-pink-500' />
  },
  {
    id: 'zalopay',
    name: 'Ví ZaloPay',
    description: 'Ưu đãi hoàn tiền hấp dẫn',
    icon: <Wallet size={24} className='text-blue-500' />
  }
]

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('qr')
  const { data: cartData, isLoading: isCartLoading } = useCartQuery()
  const createPaymentMutation = useCreatePaymentFromCartMutation()

  const cartItems = useMemo(() => cartData?.items || [], [cartData])
  const totalPrice = useMemo(() => cartItems.reduce((sum, item) => sum + item.course.price, 0), [cartItems])
  const totalOriginalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.course.originalPrice || item.course.price), 0),
    [cartItems]
  )
  const totalDiscount = totalOriginalPrice - totalPrice

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống')
      return
    }

    createPaymentMutation.mutate(undefined, {
      onSuccess: (res) => {
        const paymentUrl = res.data.paymentUrl
        if (!paymentUrl) {
          toast.error('Không thể khởi tạo phiên thanh toán')
          return
        }
        window.location.href = paymentUrl
      },
      onError: () => {
        toast.error('Đã xảy ra lỗi khi tạo phiên thanh toán')
      }
    })
  }

  if (isCartLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-[oklch(0.98_0.005_286.32)] dark:bg-[oklch(0.12_0.005_285.823)]'>
        <Loader2 className='animate-spin text-primary' size={48} />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[oklch(0.98_0.005_286.32)] dark:bg-[oklch(0.12_0.005_285.823)] py-3 px-6 md:py-12'>
      <div className='container mx-auto max-w-[1100px]'>
        {/* Header Section */}
        <div className='mb-12'>
          <h1 className='text-4xl font-extrabold text-[oklch(0.141_0.005_285.823)] dark:text-white mb-3'>Thanh toán</h1>
          <p className='text-[oklch(0.552_0.016_285.938)] font-medium text-lg'>
            Hoàn tất đăng ký để bắt đầu hành trình học tập của bạn.
          </p>
        </div>

        <div className='flex flex-col lg:flex-row gap-12'>
          {/* Main Content Side */}
          <div className='lg:w-[62%] flex flex-col gap-10'>
            {/* Step 1: Payment Method */}
            <section>
              <div className='flex items-center gap-3 mb-6'>
                <div className='flex items-center justify-center w-8 h-8 rounded-full bg-[oklch(0.577_0.245_27.325)] text-white text-sm font-black'>
                  1
                </div>
                <h2 className='text-xl font-bold text-[oklch(0.141_0.005_285.823)] dark:text-white'>
                  Phương thức thanh toán
                </h2>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`relative flex items-center p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 bg-white dark:bg-[oklch(0.141_0.005_285.823)] hover:shadow-md ${
                      paymentMethod === method.id
                        ? 'border-[oklch(0.577_0.245_27.325)] ring-1 ring-[oklch(0.577_0.245_27.325)]/20'
                        : 'border-transparent dark:border-[oklch(0.274_0.006_286.033)]'
                    }`}
                  >
                    <input
                      type='radio'
                      name='payment'
                      className='hidden'
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                    />

                    <div className='flex items-start gap-4'>
                      <div
                        className={`p-3 rounded-2xl transition-colors ${
                          paymentMethod === method.id
                            ? 'bg-[oklch(0.577_0.245_27.325)]/10 text-[oklch(0.577_0.245_27.325)]'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {method.icon}
                      </div>
                      <div>
                        <p className='font-bold text-gray-900 dark:text-white mb-0.5'>{method.name}</p>
                        <p className='text-xs text-[oklch(0.552_0.016_285.938)]'>{method.description}</p>
                      </div>
                    </div>

                    <div
                      className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        paymentMethod === method.id
                          ? 'border-[oklch(0.577_0.245_27.325)] bg-[oklch(0.577_0.245_27.325)]'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {paymentMethod === method.id && <div className='w-2 h-2 rounded-full bg-white' />}
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Step 2: Discount Code */}
            <section>
              <div className='flex items-center gap-3 mb-6'>
                <div className='flex items-center justify-center w-8 h-8 rounded-full bg-[oklch(0.577_0.245_27.325)] text-white text-sm font-black'>
                  2
                </div>
                <h2 className='text-xl font-bold text-[oklch(0.141_0.005_285.823)] dark:text-white'>Mã giảm giá</h2>
              </div>

              <div className='flex gap-4 p-4 rounded-3xl bg-white dark:bg-[oklch(0.141_0.005_285.823)] border border-transparent dark:border-[oklch(0.274_0.006_286.033)] shadow-sm max-w-md'>
                <input
                  type='text'
                  placeholder='Nhập mã ưu đãi...'
                  className='bg-transparent border-none outline-none flex-1 px-4 text-gray-900 dark:text-white placeholder:text-[oklch(0.552_0.016_285.938)]'
                />
                <Button className='bg-[oklch(0.577_0.245_27.325)] text-white hover:bg-[oklch(0.477_0.245_27.325)] rounded-2xl px-6 font-bold'>
                  Áp dụng
                </Button>
              </div>
            </section>
          </div>

          {/* Sidebar Side */}
          <div className='lg:w-[38%] flex flex-col gap-6'>
            <div className='bg-white dark:bg-[oklch(0.141_0.005_285.823)] p-8 rounded-[40px] border border-transparent dark:border-[oklch(0.274_0.006_286.033)] shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden'>
              <h2 className='text-xl font-extrabold text-gray-900 dark:text-white mb-8'>Tóm tắt đơn hàng</h2>

              {/* Course Info List */}
              <div className='flex flex-col gap-6 mb-8'>
                {cartItems.map((item) => (
                  <div key={item.id} className='flex gap-5'>
                    <div className='w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm'>
                      <img
                        src={item.course.thumbnail || '/placeholder-course.png'}
                        alt={item.course.title}
                        className='object-cover w-full h-full'
                      />
                    </div>
                    <div>
                      <h3 className='font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 mb-1.5 text-sm'>
                        {item.course.title}
                      </h3>
                      <p className='text-[10px] text-[oklch(0.552_0.016_285.938)] font-medium uppercase tracking-tight'>
                        {item.course.creator.fullName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className='space-y-4 mb-8'>
                <div className='flex justify-between text-sm font-medium'>
                  <span className='text-[oklch(0.552_0.016_285.938)]'>Giá gốc</span>
                  <span className='text-gray-900 dark:text-white line-through'>
                    {totalOriginalPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                {totalDiscount > 0 && (
                  <div className='flex justify-between text-sm font-black'>
                    <span className='text-[oklch(0.45_0.1_160)]'>Tổng giảm giá</span>
                    <span className='text-[oklch(0.45_0.1_160)]'>-{totalDiscount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className='border-t border-slate-100 dark:border-slate-800 pt-6 mb-10'>
                <div className='flex items-center justify-between'>
                  <span className='text-lg font-bold text-gray-900 dark:text-white'>Tổng thanh toán</span>
                  <span className='text-3xl font-black text-[oklch(0.577_0.245_27.325)]'>
                    {totalPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                  disabled={createPaymentMutation.isPending || cartItems.length === 0}
                className='w-full h-16 bg-[oklch(0.577_0.245_27.325)] hover:bg-[oklch(0.477_0.245_27.325)] text-white gap-2 rounded-3xl font-black text-lg shadow-lg shadow-[oklch(0.577_0.245_27.325)]/20 transition-all active:scale-[0.98]'
              >
                  {createPaymentMutation.isPending ? (
                  <Loader2 className='animate-spin' />
                ) : (
                  <>
                    Thanh toán ngay <ArrowRight size={22} />
                  </>
                )}
              </Button>

              {/* Trust Information */}
              <div className='mt-8 space-y-4'>
                <div className='flex items-center gap-3 text-xs font-semibold text-[oklch(0.552_0.016_285.938)]'>
                  <div className='p-1 rounded-full bg-green-500/10 text-green-600'>
                    <ShieldCheck size={14} />
                  </div>
                  <span>Giao dịch an toàn & Bảo mật 256-bit</span>
                </div>
                <div className='flex items-center gap-3 text-xs font-semibold text-[oklch(0.552_0.016_285.938)]'>
                  <div className='p-1 rounded-full bg-blue-500/10 text-blue-600'>
                    <BadgeCheck size={14} />
                  </div>
                  <span>Chứng chỉ Blockchain verified khi hoàn thành</span>
                </div>
              </div>
            </div>

            {/* Need Help Section */}
            <div className='bg-white dark:bg-[oklch(0.141_0.005_285.823)] p-6 rounded-3xl border border-transparent dark:border-[oklch(0.274_0.006_286.033)] shadow-md flex items-center justify-between group cursor-pointer hover:border-[oklch(0.577_0.245_27.325)]/30 transition-all'>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 rounded-2xl bg-[oklch(0.577_0.245_27.325)]/5 flex items-center justify-center text-[oklch(0.577_0.245_27.325)] shadow-inner'>
                  <HelpCircle size={22} />
                </div>
                <div>
                  <p className='font-extrabold text-gray-900 dark:text-white text-sm'>Cần hỗ trợ?</p>
                  <p className='text-[10px] text-[oklch(0.552_0.016_285.938)] font-bold'>
                    Chúng tôi luôn sẵn sàng 24/7
                  </p>
                </div>
              </div>
              <ChevronRight
                size={18}
                className='text-slate-300 group-hover:text-[oklch(0.577_0.245_27.325)] group-hover:translate-x-1 transition-all'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
