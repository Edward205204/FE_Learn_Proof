import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Pin, ExternalLink, Star, CheckCircle2, Clock } from 'lucide-react'
import { InteractionValues } from '../_utils/zod'
import { cn } from '@/lib/utils'

function relativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (days >= 1) return `${days} ngày trước`
  if (hours >= 1) return `${hours} giờ trước`
  if (minutes >= 1) return `${minutes} phút trước`
  return 'Vừa xong'
}

const TYPE_LABEL: Record<'discussion' | 'review', string> = {
  discussion: 'Q&A',
  review: 'ĐÁNH GIÁ'
}

interface InteractionItemProps {
  data: InteractionValues
}

export function InteractionItem({ data }: InteractionItemProps) {
  const isResolved = data.status === 'resolved'
  const accentColor = data.type === 'review' ? 'bg-primary' : 'bg-orange-400'

  return (
    <Card className='border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group bg-card/50 backdrop-blur-sm'>
      {/* Accent strip */}
      <div className={cn('absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-1.5', accentColor)} />

      <CardContent className='p-6'>
        {/* Header Section */}
        <div className='flex justify-between items-start mb-5 gap-4'>
          <div className='flex gap-3.5 items-start'>
            <Avatar className='h-10 w-10 ring-2 ring-background shadow-sm'>
              <AvatarImage src={data.user.avatar} />
              <AvatarFallback className='bg-muted text-xs font-bold'>
                {data.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col gap-0.5'>
              <div className='flex items-center gap-2 flex-wrap'>
                <h4 className='font-bold text-[15px] text-foreground/90'>{data.user.name}</h4>
                <Badge variant='outline' className='text-[10px] h-5 font-bold uppercase tracking-wider text-muted-foreground bg-muted/20'>
                  {TYPE_LABEL[data.type]}
                </Badge>
                {data.type === 'discussion' && (
                  <Badge
                    variant={isResolved ? 'default' : 'secondary'}
                    className={cn(
                      'text-[9px] h-4 uppercase font-bold px-1.5',
                      isResolved ? 'bg-emerald-500/10 text-emerald-600 border-none' : 'bg-muted text-muted-foreground border-none'
                    )}
                  >
                    {isResolved ? 'Đã giải quyết' : 'Chưa giải quyết'}
                  </Badge>
                )}
              </div>
              <div className='flex items-center gap-2 text-xs text-muted-foreground/80 font-medium'>
                <span className='hover:text-primary transition-colors cursor-default'>{data.user.courseName}</span>
                <span>·</span>
                <span className='flex items-center gap-1'>
                  <Clock className='h-3 w-3 opacity-60' />
                  {data.createdAt ? relativeTime(data.createdAt) : 'vừa xong'}
                </span>
              </div>
            </div>
          </div>

          <Button 
            variant='ghost' 
            size='icon' 
            className={cn(
              'h-8 w-8 transition-colors',
              data.isPinned ? 'text-primary bg-primary/5' : 'text-muted-foreground/40 hover:text-primary'
            )}
          >
            <Pin className={cn('h-4 w-4', data.isPinned && 'fill-current')} />
          </Button>
        </div>

        {/* Content Section */}
        <div className='mb-6 pl-0.5'>
          {data.type === 'review' && data.rating && (
            <div className='flex gap-0.5 mb-2.5'>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    'h-3.5 w-3.5 transition-colors',
                    i < data.rating! ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'
                  )} 
                />
              ))}
            </div>
          )}
          <p className='text-[14px] text-foreground/85 leading-relaxed tracking-tight font-medium'>
            {data.content}
          </p>
          {data.lessonUrl && (
            <a
              href={data.lessonUrl}
              className='inline-flex items-center gap-1.5 mt-3.5 text-[11px] font-bold text-primary hover:text-primary/80 transition-all group/link'
            >
              Đến bài học 
              <ExternalLink className='h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform' />
            </a>
          )}
        </div>

        {/* Action Section/Quick Reply */}
        <div className='relative group/reply'>
          <Textarea
            placeholder={
              data.type === 'review' ? `Cảm ơn ${data.user.name} về đánh giá này...` : 'Nhập phản hồi nhanh...'
            }
            className='bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all resize-none min-h-[50px] max-h-[120px] text-sm pr-20 py-3 scrollbar-hide'
            defaultValue={data.reply || ''}
          />
          <div className='absolute right-2 bottom-2 flex items-center gap-2'>
             <Button size='sm' className='h-7 py-0 px-3 text-[11px] font-bold shadow-sm bg-primary hover:bg-primary/90 transition-all'>
               Gửi phản hồi
             </Button>
          </div>
        </div>

        {isResolved && (
          <div className='flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold mt-3 opacity-80'>
            <CheckCircle2 className='h-3.5 w-3.5' /> ĐÃ GIẢI QUYẾT
          </div>
        )}
      </CardContent>
    </Card>
  )
}

