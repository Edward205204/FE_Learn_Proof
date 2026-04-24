'use client'

import { Search, Filter, HelpCircle, Loader2 } from 'lucide-react'
import { TransactionTable } from '../_components/transaction-table'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { paymentApi, Transaction as ApiTransaction } from '../_api/payment.api'
import { Transaction as UiTransaction } from '../_utils/zod'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export default function PaymentHistoryPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<UiTransaction[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await paymentApi.getHistory()

        // Map API data to UI model
        const mappedData: UiTransaction[] = response.data.map((item: ApiTransaction) => ({
          id: item.id,
          orderCode: item.txnRef.startsWith('LP-') ? item.txnRef : `#${item.txnRef.slice(-6).toUpperCase()}`,
          courseName: item.course.title,
          amount: item.amount,
          paymentDate: format(new Date(item.payDate || item.createdAt), 'dd MMM, yyyy', { locale: vi }),
          paymentMethod: item.provider === 'VNPAY' ? 'VNPay' : item.provider,
          status: item.status === 'COMPLETED' ? 'SUCCESS' : item.status === 'PENDING' ? 'PENDING' : 'FAILED'
        }))

        setData(mappedData)
      } catch (error) {
        console.error('Failed to fetch payment history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter data based on search term
  const filteredData = data.filter(
    (item) =>
      item.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orderCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
      {loading ? (
        <div className='flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-50 shadow-sm gap-4'>
          <Loader2 className='animate-spin text-primary' size={40} />
          <p className='text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs'>
            Đang tải dữ liệu giao dịch...
          </p>
        </div>
      ) : filteredData.length > 0 ? (
        <TransactionTable data={filteredData} />
      ) : (
        <div className='flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-50 shadow-sm text-center px-6'>
          <div className='w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6'>
            <Search size={40} />
          </div>
          <h3 className='text-xl font-bold text-slate-900 mb-2'>Không tìm thấy giao dịch nào</h3>
          <p className='text-slate-500 max-w-sm mx-auto'>
            Bạn chưa thực hiện giao dịch nào hoặc không có giao dịch phù hợp với tìm kiếm của bạn.
          </p>
        </div>
      )}

      {/* Pagination & Summary */}
      {!loading && filteredData.length > 0 && (
        <div className='flex flex-col md:flex-row items-center justify-between gap-4 pt-4'>
          <p className='text-xs font-bold text-slate-400 uppercase tracking-widest'>
            Hiển thị 1-{filteredData.length} của {filteredData.length} giao dịch
          </p>
          <div className='flex gap-2'>
            <button className='w-10 h-10 rounded-full flex items-center justify-center text-sm font-black bg-primary text-white shadow-lg shadow-rose-200'>
              1
            </button>
          </div>
        </div>
      )}

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
