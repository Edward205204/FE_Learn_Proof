'use client'

import { InteractionValues } from '../_utils/zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Pin, ExternalLink, Star, CheckCircle2 } from 'lucide-react'

// Component chung cho mỗi item tương tác
function InteractionItem({ data }: { data: InteractionValues }) {
    return (
        <Card className="border-none shadow-sm mb-6 relative overflow-hidden">
            {/* Thanh màu bên trái để phân biệt loại hoặc trạng thái */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${data.type === 'qa' ? 'bg-orange-400' : 'bg-primary'}`} />

            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-full bg-muted overflow-hidden">
                            <img src={data.user.avatar || '/default-avatar.png'} alt="avatar" className="object-cover h-full w-full" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm">{data.user.name}</h4>
                                <Badge variant="outline" className="text-[10px] uppercase">{data.type}</Badge>
                                {data.status && (
                                    <Badge className={`text-[10px] uppercase ${data.status === 'resolved' ? 'bg-emerald-500' : 'bg-slate-400'}`}>
                                        {data.status}
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">{data.user.courseName} • 2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className={data.isPinned ? "text-primary" : "text-muted-foreground"}>
                            <Pin className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Nội dung tương tác */}
                <div className="mb-4">
                    {data.rating && (
                        <div className="flex gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < data.rating! ? 'fill-primary text-primary' : 'text-muted'}`} />
                            ))}
                        </div>
                    )}
                    <p className="text-sm text-foreground/80 leading-relaxed">{data.content}</p>
                    <a href={data.lessonUrl} className="text-primary text-xs font-bold flex items-center gap-1 mt-3 hover:underline">
                        Go to Lesson <ExternalLink className="h-3 w-3" />
                    </a>
                </div>

                {/* Ô trả lời ngay tại chỗ */}
                <div className="space-y-3">
                    <Textarea
                        placeholder={data.type === 'review' ? `Cảm ơn ${data.user.name} về đánh giá này...` : "Gõ phản hồi nhanh..."}
                        className="bg-muted/30 border-none resize-none min-h-[80px]"
                    />
                    <div className="flex justify-end">
                        <Button size="sm" className="bg-primary px-6">Post Reply</Button>
                    </div>
                </div>

                {data.status === 'resolved' && (
                    <div className="flex items-center gap-1 text-emerald-600 text-[11px] font-bold absolute bottom-6 right-32">
                        <CheckCircle2 className="h-3 w-3" /> RESOLVED
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// Mock data để preview UI
const MOCK_INTERACTIONS: InteractionValues[] = [
    {
        id: '1',
        type: 'review',
        user: { name: 'Nguyen Van A', avatar: '', courseName: 'Professional Business Practices' },
        content: 'Khoá học rất hay và bổ ích! Tôi đã học được rất nhiều kiến thức thực tế.',
        rating: 4,
        lessonUrl: '/lessons/pb12-t1',
        isPinned: true
    },
    {
        id: '2',
        type: 'qa',
        user: { name: 'Tran Thi B', avatar: '', courseName: 'Professional Business Practices' },
        content: 'Phần bài tập số 3 tôi chưa hiểu rõ, thầy có thể giải thích thêm được không ạ?',
        status: 'unresolved',
        lessonUrl: '/lessons/pb12-t2',
        isPinned: false
    },
    {
        id: '3',
        type: 'qa',
        user: { name: 'Le Van C', avatar: '', courseName: 'Business English' },
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
                        <p className='text-sm text-muted-foreground uppercase tracking-wider'>Content Management</p>
                        <h1 className='text-3xl font-extrabold tracking-tight'>Feedback & Q&A</h1>
                        <p className='text-muted-foreground italic'>Manage student reviews and questions</p>
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