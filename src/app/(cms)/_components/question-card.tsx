import { Trash2 } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { QuizFormValues } from '../_utils/zod'
import { AnswerList } from './answer-list'

interface QuestionCardProps {
  index: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>
  onRemove: (index: number) => void
  showAnswers?: boolean
}

export function QuestionCard({ index, form, onRemove, showAnswers = true }: QuestionCardProps) {
  return (
    <Card className='relative overflow-visible border border-border/60 shadow-sm rounded-2xl bg-card focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/30 transition-all duration-300'>
      <CardContent className='p-6 sm:p-8'>
        <div className='flex justify-between items-start mb-6'>
          <span className='bg-primary/15 text-primary h-10 w-10 min-w-10 rounded-xl flex items-center justify-center font-extrabold text-base ring-1 ring-primary/20 shadow-sm'>
            {index + 1}
          </span>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => onRemove(index)}
            className='text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-2 -mr-2 h-9 w-9 rounded-full'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>

        <div className='space-y-6'>
          <div>
            <label className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 block'>Nội dung câu hỏi</label>
            <Input
              {...form.register(`questions.${index}.questionText`)}
              placeholder='VD: Tính chất OOP nào dưới đây cho phép...'
              className='text-base font-medium py-6 bg-muted/10 border-border/50 focus-visible:ring-primary/20 rounded-xl'
            />
          </div>

          {showAnswers && (
            <div className='space-y-3 pt-2 border-t border-border/30'>
              <label className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2 mt-4'>Các đáp án</label>
              <AnswerList questionIndex={index} form={form as UseFormReturn<QuizFormValues>} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
