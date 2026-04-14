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
    <div className='space-y-4'>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className='flex items-center gap-3 group bg-muted/20 p-2 rounded-xl border border-transparent focus-within:border-border/50 focus-within:bg-card transition-all'
        >
          <div className='pl-2'>
            <Checkbox
              checked={form.watch(`questions.${questionIndex}.answers.${index}.isCorrect`)}
              onCheckedChange={(checked) =>
                form.setValue(`questions.${questionIndex}.answers.${index}.isCorrect`, !!checked)
              }
              className='h-5 w-5 rounded-md data-[state=checked]:bg-primary data-[state=checked]:border-primary shadow-sm'
            />
          </div>
          <div className='relative flex-1'>
            <Input
              {...form.register(`questions.${questionIndex}.answers.${index}.text`)}
              placeholder={`Nhập đáp án ${index + 1}...`}
              className='pr-28 border-none shadow-none bg-transparent h-11 focus-visible:ring-0 px-2'
            />
            {form.watch(`questions.${questionIndex}.answers.${index}.isCorrect`) && (
              <span className='absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary uppercase bg-primary/15 px-2.5 py-1 rounded-md tracking-wider'>
                Đáp án đúng
              </span>
            )}
          </div>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => remove(index)}
            className='opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      ))}
      <Button
        type='button'
        variant='outline'
        size='sm'
        onClick={() => append({ text: '', isCorrect: false })}
        className='text-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/20 mt-2 border-border/50 shadow-sm rounded-lg h-9 px-4'
      >
        <Plus className='mr-1.5 h-4 w-4 text-muted-foreground' /> Thêm đáp án
      </Button>
    </div>
  )
}
