'use client'

import type { Control, UseFormSetValue } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { Banknote, Tag } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { MoneyInput } from '@/components/ui/money-input'
import type { PublishCourseBody } from '../_utils/zod'

type Props = {
  control: Control<PublishCourseBody>
  setValue: UseFormSetValue<PublishCourseBody>
  isFree: boolean
  priceLabel: string
  description: string
}

export function CourseStep3PricingFields({ control, setValue, isFree, priceLabel, description }: Props) {
  return (
    <Card className='p-6 space-y-6'>
      <div>
        <div className='flex items-center gap-2 mb-1'>
          <Tag size={18} className='text-muted-foreground' />
          <h3 className='font-semibold text-lg'>Chiến lược giá</h3>
        </div>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </div>

      <div className='flex items-center justify-between border rounded-lg p-4'>
        <div className='flex items-center gap-3'>
          <Banknote size={18} className='text-muted-foreground' />
          <div>
            <p className='font-medium'>Khóa học có phí</p>
            <p className='text-sm text-muted-foreground'>Học viên phải thanh toán để đăng ký học.</p>
          </div>
        </div>
        <Switch checked={!isFree} onCheckedChange={(checked) => setValue('isFree', !checked)} />
      </div>

      {!isFree && (
        <div className='grid md:grid-cols-2 gap-4'>
          <div className='flex gap-2 flex-col'>
            <Label htmlFor='price'>{priceLabel}</Label>
            <Controller
              control={control}
              name='price'
              render={({ field }) => (
                <MoneyInput
                  id='price'
                  placeholder='299.000'
                  value={typeof field.value === 'number' ? field.value : 0}
                  onValueChange={(v) => field.onChange(v ?? 0)}
                />
              )}
            />
          </div>

          <div className='flex gap-2 flex-col'>
            <Label htmlFor='discount'>Giá khuyến mãi (Tuỳ chọn)</Label>
            <Controller
              control={control}
              name='originalPrice'
              render={({ field }) => (
                <MoneyInput
                  id='discount'
                  placeholder='Để trống nếu không giảm giá'
                  value={field.value ?? null}
                  onValueChange={(v) => field.onChange(v)}
                />
              )}
            />
            <p className='text-xs text-muted-foreground'>Học viên sẽ thấy giá này trên trang khóa học.</p>
          </div>
        </div>
      )}
    </Card>
  )
}

