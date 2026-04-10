// src/app/(learner)/payment/history/page.tsx

import { Search, Filter, HelpCircle } from 'lucide-react'
import { TransactionTable } from '../_components/transaction-table'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Mock data bám sát thiết kế
const MOCK_TRANSACTIONS = [
  {
    id: '1',
    orderCode: '#LP-9921',
    courseName: 'React Native Masterclass',
    amount: 1200000,
    paymentDate: '15 Th10, 2023',
    paymentMethod: 'MoMo',
    status: 'SUCCESS'
  },
  {
    id: '2',
    orderCode: '#LP-8842',
    courseName: 'UI/UX Design Fundamentals',
    amount: 850000,
    paymentDate: '10 Th10, 2023',
    paymentMethod: 'Thẻ ngân hàng',
    status: 'SUCCESS'
  },
  {
    id: '3',
    orderCode: '#LP-7731',
    courseName: 'Advanced Python Scripting',
    amount: 2100000,
    paymentDate: '05 Th10, 2023',
    paymentMethod: 'Crypto',
    status: 'PENDING'
  }
]

export default function PaymentHistoryPage() {
  return (
    <div className='max-w-7xl mx-auto p-6 md:p-10 space-y-8'>
      {/* Header Section */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-black text-slate-900 tracking-tight'>Lịch sử thanh toán</h1>
          <p className='text-slate-500 mt-1 text-sm font-medium'>Quản lý và theo dõi các giao dịch học phí của bạn</p>
        </div>

        {/* Search & Filter */}
        <div className='flex items-center gap-3'>
          <div className='relative group'>
            <Search
              className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors'
              size={18}
            />
            <input
              placeholder='Tìm kiếm giao dịch...'
              className='pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 w-[280px] transition-all shadow-sm'
            />
          </div>
          <Button
            variant='outline'
            className='rounded-2xl border-slate-100 h-[46px] px-5 gap-2 font-bold text-slate-600'
          >
            <Filter size={18} /> Lọc
          </Button>
        </div>
      </div>

      {/* Main Table Content */}
      <TransactionTable data={MOCK_TRANSACTIONS as any} />

      {/* Pagination & Summary */}
      <div className='flex flex-col md:flex-row items-center justify-between gap-4 pt-4'>
        <p className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Hiển thị 1-4 của 24 giao dịch</p>
        <div className='flex gap-2'>
          {[1, 2, 3, '...', 9].map((p, i) => (
            <button
              key={i}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all',
                p === 1
                  ? 'bg-primary text-white shadow-lg shadow-rose-200'
                  : 'bg-white text-slate-500 hover:bg-slate-50'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Footer Info Box */}
      <div className='bg-slate-50/50 rounded-3xl p-6 border border-slate-100 flex items-start gap-4'>
        <div className='h-10 w-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm shrink-0'>
          <HelpCircle size={20} />
        </div>
        <div className='text-sm text-slate-600 leading-relaxed'>
          Bạn có thắc mắc về các giao dịch? Vui lòng liên hệ{' '}
          <span className='font-bold text-primary cursor-pointer hover:underline'>Trung tâm hỗ trợ</span> hoặc gửi email
          đến <span className='font-bold text-slate-900'>billing@learnproof.edu.vn</span> để được giải quyết nhanh nhất.
        </div>
      </div>
    </div>
  )
}
