import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Pin, ExternalLink, Star, CheckCircle2 } from 'lucide-react'
import { InteractionValues } from '../_utils/zod'

const TYPE_LABEL: Record<'discussion' | 'review', string> = {
  discussion: 'Q&A',
  review: 'Đánh giá'
}

interface InteractionItemProps {
  data: InteractionValues
}

export function InteractionItem({ data }: InteractionItemProps) {
  return (
    <Card className='border-none shadow-sm relative overflow-hidden'>
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${data.type === 'discussion' ? 'bg-orange-400' : 'bg-primary'}`} />

      <CardContent className='p-6'>
        <div className='flex justify-between items-start mb-4'>
          <div className='flex gap-4'>
            <div className='h-12 w-12 rounded-full bg-muted overflow-hidden shrink-0'>
              <img
                src={data.user.avatar || '/default-avatar.png'}
                alt={data.user.name}
                className='object-cover h-full w-full'
              />
            </div>
            <div>
              <div className='flex items-center gap-2 flex-wrap'>
                <h4 className='font-bold text-sm'>{data.user.name}</h4>
                <Badge variant='outline' className='text-[10px] uppercase'>
                  {TYPE_LABEL[data.type]}
                </Badge>
                {data.status && (
                  <Badge
                    className={`text-[10px] uppercase ${data.status === 'resolved' ? 'bg-emerald-500' : 'bg-slate-400'}`}
                  >
                    {data.status === 'resolved' ? 'Đã giải quyết' : 'Chưa giải quyết'}
                  </Badge>
                )}
              </div>
              <p className='text-xs text-muted-foreground'>
                {data.user.courseName} · 2 giờ trước
              </p>
            </div>
          </div>

          <Button
            variant='ghost'
            size='icon'
            className={data.isPinned ? 'text-primary' : 'text-muted-foreground'}
          >
            <Pin className='h-4 w-4' />
          </Button>
        </div>

        <div className='mb-4'>
          {data.rating && (
            <div className='flex gap-1 mb-2'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < data.rating! ? 'fill-primary text-primary' : 'text-muted'}`}
                />
              ))}
            </div>
          )}
          <p className='text-sm text-foreground/80 leading-relaxed'>{data.content}</p>
          {data.lessonUrl && (
            <a
              href={data.lessonUrl}
              className='text-primary text-xs font-bold flex items-center gap-1 mt-3 hover:underline'
            >
              Đến bài học <ExternalLink className='h-3 w-3' />
            </a>
          )}
        </div>

        <div className='space-y-3'>
          <Textarea
            placeholder={
              data.type === 'review'
                ? `Cảm ơn ${data.user.name} về đánh giá này...`
                : 'Nhập phản hồi nhanh...'
            }
            className='bg-muted/30 border-none resize-none min-h-[80px]'
          />
          <div className='flex justify-end'>
            <Button size='sm'>Gửi phản hồi</Button>
          </div>
        </div>

        {data.status === 'resolved' && (
          <div className='flex items-center gap-1 text-emerald-600 text-[11px] font-bold absolute bottom-6 right-32'>
            <CheckCircle2 className='h-3 w-3' /> ĐÃ GIẢI QUYẾT
          </div>
        )}
      </CardContent>
    </Card>
  )
}
