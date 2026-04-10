// src/app/(learner)/payment/history/_components/transaction-table.tsx
'use client'

import { Download, CreditCard } from 'lucide-react'
import { Transaction } from '../_utils/zod'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface TransactionTableProps {
  data: Transaction[]
}

export function TransactionTable({ data }: TransactionTableProps) {
  const [isClient, setIsClient] = useState(false)

  // Đảm bảo component chỉ render nội dung sau khi đã mount ở phía Client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Trong khi chờ đợi Client-side, trả về null hoặc Skeleton để tránh Hydration Mismatch
  if (!isClient) return <div className='w-full h-64 bg-slate-50 animate-pulse rounded-3xl' />

  return (
    <div className='w-full overflow-x-auto bg-white rounded-3xl border border-slate-50 shadow-sm'>
      <table className='w-full text-left border-collapse'>
        <thead>
          <tr className='border-b border-slate-50 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest'>
            <th className='px-6 py-5'>Mã đơn hàng</th>
            <th className='px-6 py-5'>Khóa học</th>
            <th className='px-6 py-5'>Ngày thanh toán</th>
            <th className='px-6 py-5'>Phương thức</th>
            <th className='px-6 py-5 text-right'>Tổng tiền</th>
            <th className='px-6 py-5 text-center'>Trạng thái</th>
            <th className='px-6 py-5 text-center'>Thao tác</th>
          </tr>
        </thead>
        <tbody className='text-sm font-medium text-slate-600'>
          {data.map((item) => (
            <tr key={item.id} className='border-b border-slate-50 hover:bg-slate-50/50 transition-colors'>
              <td className='px-6 py-6 font-bold text-slate-900'>{item.orderCode}</td>
              <td className='px-6 py-6 max-w-[200px] truncate'>{item.courseName}</td>
              <td className='px-6 py-6 text-slate-500'>{item.paymentDate}</td>
              <td className='px-6 py-6'>
                <span className='flex items-center gap-2'>
                  <div className='w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500'>
                    <CreditCard size={14} />
                  </div>
                  {item.paymentMethod}
                </span>
              </td>
              <td className='px-6 py-6 text-right font-black text-slate-900'>
                {item.amount.toLocaleString('vi-VN')}
                <span className='ml-1 text-[10px] text-slate-400 uppercase'>vnd</span>
              </td>
              <td className='px-6 py-6 text-center'>
                {/* Badge trạng thái theo thiết kế */}
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tight border inline-block min-w-[100px]',
                    item.status === 'SUCCESS'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : item.status === 'PENDING'
                        ? 'bg-amber-50 text-amber-600 border-amber-100'
                        : 'bg-rose-50 text-rose-600 border-rose-100'
                  )}
                >
                  {item.status === 'SUCCESS' ? 'Thành công' : item.status === 'PENDING' ? 'Chờ xử lý' : 'Thất bại'}
                </span>
              </td>
              <td className='px-6 py-6 text-center'>
                <button className='text-rose-500 hover:text-rose-700 transition-colors flex items-center justify-center gap-1 mx-auto font-bold text-xs group'>
                  <Download size={14} className='group-hover:translate-y-0.5 transition-transform' />
                  <span className='hidden md:inline'>Hóa đơn</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
