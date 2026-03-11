import { Trash2 } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AnswerList } from './answer-List'
import { QuizFormValues } from '../_utils/zod'

interface QuestionCardProps {
  index: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>
  onRemove: (index: number) => void
  showAnswers?: boolean
}

export function QuestionCard({ index, form, onRemove, showAnswers = true }: QuestionCardProps) {
  return (
    <Card className='relative overflow-hidden border-2 focus-within:border-primary transition-all'>
      <div className='absolute left-0 top-0 bottom-0 w-1 bg-primary' />
      <CardContent className='p-6'>
        <div className='flex justify-between items-start mb-4'>
          <span className='bg-primary text-primary-foreground h-8 w-8 rounded-md flex items-center justify-center font-bold text-sm'>
            {index + 1}
          </span>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => onRemove(index)}
            className='text-destructive hover:text-destructive'
          >
            <Trash2 className='h-5 w-5' />
          </Button>
        </div>

        <div className='space-y-4'>
          <div>
            <label className='text-xs font-bold uppercase text-muted-foreground mb-1 block'>Nội dung câu hỏi</label>
            <Input
              {...form.register(`questions.${index}.questionText`)}
              placeholder='Nhập câu hỏi tại đây...'
              className='text-base py-5'
            />
          </div>

          {showAnswers && (
            <div className='space-y-3'>
              <label className='text-xs font-bold uppercase text-muted-foreground block'>Các đáp án</label>
              <AnswerList questionIndex={index} form={form as UseFormReturn<QuizFormValues>} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
