import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Eye, Check, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { QuizDraft } from '@/app/(cms)/_types/ai'

interface Props {
  draft: QuizDraft
  onPreview: () => void
  onPublish: (id: string) => void
  onReject: () => void
  isSubmitting: boolean
}

export function QuizDraftCard({ draft, onPreview, onPublish, onReject, isSubmitting }: Props) {
  const questionCount = draft.validatedOutput?.questions?.length || 0

  return (
    <Card className='border-indigo-500/20 bg-indigo-500/5 shadow-sm overflow-hidden'>
      <CardContent className='p-4 sm:p-6'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div className='space-y-1.5'>
            <div className='flex items-center gap-2'>
              <Badge className='bg-indigo-600 hover:bg-indigo-600'>AI Draft</Badge>
              <span className='text-xs text-muted-foreground flex items-center gap-1'>
                <Clock className='h-3 w-3' />
                {formatDistanceToNow(new Date(draft.createdAt), { addSuffix: true, locale: vi })}
              </span>
            </div>
            <h3 className='font-bold text-foreground'>Bản nháp Quiz tự động</h3>
            <p className='text-sm text-muted-foreground'>
              AI đã tạo ra <span className='font-bold text-indigo-600'>{questionCount}</span> câu hỏi dựa trên nội dung
              bài học.
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='h-9 gap-1.5 border-indigo-200 hover:bg-indigo-100/50'
              onClick={onPreview}
              disabled={isSubmitting}
            >
              <Eye className='h-3.5 w-3.5' />
              Xem trước
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='h-9 w-9 text-destructive hover:bg-destructive/10'
              onClick={() => onReject()}
              disabled={isSubmitting}
              title='Từ chối'
            >
              <X className='h-4 w-4' />
            </Button>
            <Button
              size='sm'
              className='h-9 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white'
              onClick={() => onPublish(draft.id)}
              disabled={isSubmitting}
            >
              <Check className='h-3.5 w-3.5' />
              Duyệt
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
