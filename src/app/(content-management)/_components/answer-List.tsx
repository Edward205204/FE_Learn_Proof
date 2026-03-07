import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { QuizFormValues } from '../_utils/zod'

interface AnswerListProps {
  questionIndex: number
  form: UseFormReturn<QuizFormValues>
}

export function AnswerList({ questionIndex, form }: AnswerListProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `questions.${questionIndex}.answers` as const
  })

  return (
    <div className='space-y-3'>
      {fields.map((field, index) => (
        <div key={field.id} className='flex items-center gap-3 group'>
          <Checkbox
            checked={form.watch(`questions.${questionIndex}.answers.${index}.isCorrect`)}
            onCheckedChange={(checked) =>
              form.setValue(`questions.${questionIndex}.answers.${index}.isCorrect`, !!checked)
            }
            className='data-[state=checked]:bg-primary data-[state=checked]:border-primary'
          />
          <div className='relative flex-1'>
            <Input
              {...form.register(`questions.${questionIndex}.answers.${index}.text`)}
              placeholder={`Đáp án ${index + 1}`}
              className='pr-10'
            />
            {form.watch(`questions.${questionIndex}.answers.${index}.isCorrect`) && (
              <span className='absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary uppercase'>
                Correct Answer
              </span>
            )}
          </div>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => remove(index)}
            className='opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      ))}
      <Button
        type='button'
        variant='ghost'
        size='sm'
        onClick={() => append({ text: '', isCorrect: false })}
        className='text-primary hover:text-primary hover:bg-primary/10 mt-2'
      >
        <Plus className='mr-2 h-4 w-4' /> Thêm đáp án
      </Button>
    </div>
  )
}
