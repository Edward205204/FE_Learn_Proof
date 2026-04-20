import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'
import { FieldArrayPath, FieldValues, Path, UseFormReturn, useFieldArray } from 'react-hook-form'

type QuizAnswer = { text: string; isCorrect: boolean }
type QuizQuestion = { questionText: string; answers: QuizAnswer[] }
type QuizSectionKey = 'questions' | 'supplementalQuiz'

type QuizEditableForm = FieldValues & {
  questions: QuizQuestion[]
  supplementalQuiz?: QuizQuestion[]
}

interface AnswerListProps<TForm extends QuizEditableForm> {
  questionIndex: number
  form: UseFormReturn<TForm>
  namePrefix?: QuizSectionKey
}

export function AnswerList<TForm extends QuizEditableForm>({
  questionIndex,
  form,
  namePrefix = 'questions'
}: AnswerListProps<TForm>) {
  const base = `${namePrefix}.${questionIndex}.answers` as FieldArrayPath<TForm>
  const { fields, append, remove } = useFieldArray<TForm, typeof base>({
    control: form.control,
    name: base
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
              checked={Boolean(form.watch(`${base}.${index}.isCorrect` as Path<TForm>))}
              onCheckedChange={(checked) => {
                if (checked) {
                  fields.forEach((_, i) => {
                    form.setValue(`${base}.${i}.isCorrect` as Path<TForm>, (i === index) as never)
                  })
                } else {
                  form.setValue(`${base}.${index}.isCorrect` as Path<TForm>, false as never)
                }
              }}
              className='h-5 w-5 rounded-md data-[state=checked]:bg-primary data-[state=checked]:border-primary shadow-sm'
            />
          </div>
          <div className='relative flex-1'>
            <Input
              {...form.register(`${base}.${index}.text` as Path<TForm>)}
              placeholder={`Nhập đáp án ${index + 1}...`}
              className='pr-28 border-none shadow-none bg-transparent h-11 focus-visible:ring-0 px-2'
            />
            {Boolean(form.watch(`${base}.${index}.isCorrect` as Path<TForm>)) && (
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
        onClick={() => append({ text: '', isCorrect: false } as never)}
        className='text-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/20 mt-2 border-border/50 shadow-sm rounded-lg h-9 px-4'
      >
        <Plus className='mr-1.5 h-4 w-4 text-muted-foreground' /> Thêm đáp án
      </Button>
    </div>
  )
}
