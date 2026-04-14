import { Bell, MessageSquare, Tag, CheckCircle, Clock } from 'lucide-react'

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'system',
    title: 'Chào mừng bạn đến với LearnProof!',
    message: 'Khám phá ngay hàng ngàn khóa học chất lượng để bắt đầu hành trình nâng cấp bản thân.',
    time: '2 giờ trước',
    unread: true,
    icon: Bell,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
  },
  {
    id: '2',
    type: 'promo',
    title: 'Giảm giá cuối tuần lên đến 50%',
    message: 'Áp dụng mã WEEKEND50 cho tất cả khóa học Lập trình. Số lượng có hạn!',
    time: 'Hôm qua',
    unread: true,
    icon: Tag,
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
  },
  {
    id: '3',
    type: 'course',
    title: 'Khóa học Next.js 14 có bài giảng mới',
    message: 'Giảng viên Nguyễn Văn A vừa cập nhật thêm Module 5: Authentication với NextAuth. Cùng vào học ngay nhé!',
    time: '3 ngày trước',
    unread: false,
    icon: MessageSquare,
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
  },
  {
    id: '4',
    type: 'success',
    title: 'Thanh toán thành công',
    message: 'Hóa đơn #100234 của bạn đã được thanh toán thành công. Khóa học "Thiết kế UI/UX Thực chiến" đã sẵn sàng!',
    time: '1 tuần trước',
    unread: false,
    icon: CheckCircle,
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
  }
]

export default function NotificationsPage() {
  return (
    <div className='container mx-auto py-10 px-6 max-w-4xl'>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-3xl font-bold text-[oklch(0.141_0.005_285.823)] dark:text-white'>Thông báo</h1>
        <button className='text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors'>
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      <div className='bg-white dark:bg-[oklch(0.141_0.005_285.823)] rounded-2xl border border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)] shadow-sm overflow-hidden'>
        {MOCK_NOTIFICATIONS.map((noti) => {
          const Icon = noti.icon
          return (
            <div
              key={noti.id}
              className={`p-5 flex gap-5 border-b border-[oklch(0.92_0.004_286.32)] dark:border-[oklch(0.274_0.006_286.033)] last:border-0 hover:bg-gray-50 dark:hover:bg-[oklch(0.21_0.006_285.885)] transition-colors ${noti.unread ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
            >
              <div className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center ${noti.color}`}>
                <Icon size={24} />
              </div>

              <div className='flex-1'>
                <div className='flex items-start justify-between gap-4 mb-1'>
                  <h3
                    className={`text-base font-semibold ${noti.unread ? 'text-gray-900 dark:text-white' : 'text-[oklch(0.552_0.016_285.938)]'}`}
                  >
                    {noti.title}
                  </h3>
                  {noti.unread && (
                    <span className='w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-1.5 shadow-sm'></span>
                  )}
                </div>

                <p
                  className={`text-sm mb-3 ${noti.unread ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-[oklch(0.552_0.016_285.938)]'}`}
                >
                  {noti.message}
                </p>

                <div className='flex items-center gap-1.5 text-xs text-[oklch(0.552_0.016_285.938)]'>
                  <Clock size={14} />
                  <span>{noti.time}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
