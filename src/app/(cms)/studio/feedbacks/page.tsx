'use client'

import { InteractionItem } from '../../_components/interaction-item'
import { InteractionValues } from '../../_utils/zod'

const MOCK_INTERACTIONS: InteractionValues[] = [
  {
    id: '1',
    type: 'review',
    user: { name: 'Nguyễn Văn A', avatar: '', courseName: 'Professional Business Practices' },
    content: 'Khóa học rất hay và bổ ích! Tôi đã học được rất nhiều kiến thức thực tế.',
    rating: 4,
    lessonUrl: '/lessons/pb12-t1',
    isPinned: true
  },
  {
    id: '2',
    type: 'discussion',
    user: { name: 'Trần Thị B', avatar: '', courseName: 'Professional Business Practices' },
    content: 'Phần bài tập số 3 tôi chưa hiểu rõ, thầy có thể giải thích thêm được không ạ?',
    status: 'unresolved',
    lessonUrl: '/lessons/pb12-t2',
    isPinned: false
  },
  {
    id: '3',
    type: 'discussion',
    user: { name: 'Lê Văn C', avatar: '', courseName: 'Business English' },
    content: 'Em đã hiểu bài rồi, cảm ơn thầy đã giải đáp!',
    status: 'resolved',
    lessonUrl: '/lessons/be-01',
    isPinned: false
  }
]

export default function FeedbackListPage() {
  return (
    <div className='flex min-h-screen bg-background'>
      <main className='flex-1 p-8'>
        <div className='max-w-4xl mx-auto'>
          <header className='mb-8'>
            <p className='text-sm text-muted-foreground uppercase tracking-wider'>Quản lý nội dung</p>
            <h1 className='text-3xl font-extrabold tracking-tight'>Phản hồi & Q&A</h1>
            <p className='text-muted-foreground italic'>Quản lý đánh giá và câu hỏi của học viên</p>
          </header>

          <div className='space-y-4'>
            {MOCK_INTERACTIONS.map((item) => (
              <InteractionItem key={item.id} data={item} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
