import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Trang tổng quan cho quản trị viên'
}

export default function AdminDashboardPage() {
  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
        <p className='text-muted-foreground'>Chào mừng quay trở lại trang Quản trị.</p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {/* Placeholder cards for dashboard */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='rounded-xl border bg-card text-card-foreground shadow-sm p-6'>
            <div className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <h3 className='tracking-tight text-sm font-medium'>
                {['Tổng số người dùng', 'Tổng doanh thu', 'Khóa học đang hoạt động', 'Học viên trực tuyến'][i]}
              </h3>
            </div>
            <div className='text-2xl font-bold'>{['+2350', '$45,231', '+573', '+201'][i]}</div>
            <p className='text-xs text-muted-foreground'>
              {['+180 tuần này', '+20% so với tháng trước', '+21 tháng này', 'Đang cập nhật...'][i]}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
