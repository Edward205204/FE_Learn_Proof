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
    <Card className='border border-border/60 shadow-sm rounded-3xl overflow-hidden bg-card'>
      <div className='p-6 sm:p-10 space-y-8'>
        <div className='flex items-start gap-5'>
          <div className='h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 ring-1 ring-primary/20 shadow-sm'>
            <Tag className='h-7 w-7' />
          </div>
          <div className='pt-1'>
            <h3 className='font-extrabold text-2xl tracking-tight text-foreground'>Chiến lược giá</h3>
            <p className='text-muted-foreground font-medium mt-1'>{description}</p>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='flex items-center justify-between border border-border/50 rounded-2xl p-5 bg-muted/10 hover:bg-muted/30 transition-colors'>
            <div className='flex items-center gap-4'>
              <div className='p-3 bg-background rounded-xl shadow-sm border border-border/50 text-muted-foreground'>
                <Banknote size={24} />
              </div>
              <div>
                <p className='font-bold text-lg text-foreground'>Khóa học có phí</p>
                <p className='text-sm text-muted-foreground font-medium mt-0.5'>
                  Yêu cầu học viên thanh toán để tham gia.
                </p>
              </div>
            </div>
            <Switch
              checked={!isFree}
              onCheckedChange={(checked) => setValue('isFree', !checked)}
              className='data-[state=checked]:bg-primary scale-125 mr-2'
            />
          </div>

          {!isFree && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-border/50 rounded-2xl bg-background shadow-sm animate-in fade-in slide-in-from-top-2'>
              <div className='flex gap-2 flex-col'>
                <Label htmlFor='price' className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
                  {priceLabel}
                </Label>
                <Controller
                  control={control}
                  name='price'
                  render={({ field }) => (
                    <div className='relative'>
                      <MoneyInput
                        id='price'
                        placeholder='299.000'
                        value={typeof field.value === 'number' ? field.value : 0}
                        onValueChange={(v) => field.onChange(v ?? 0)}
                        className='h-12 text-lg font-bold rounded-xl pr-12 focus-visible:ring-primary/20'
                      />
                      <span className='absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground select-none'>
                        ₫
                      </span>
                    </div>
                  )}
                />
              </div>

              <div className='flex gap-2 flex-col'>
                <Label
                  htmlFor='discount'
                  className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'
                >
                  Giá khuyến mãi (Tùy chọn)
                </Label>
                <Controller
                  control={control}
                  name='originalPrice'
                  render={({ field }) => (
                    <div className='relative'>
                      <MoneyInput
                        id='discount'
                        placeholder='Để trống nếu không có'
                        value={field.value ?? null}
                        onValueChange={(v) => field.onChange(v)}
                        className='h-12 text-lg font-bold rounded-xl pr-12 focus-visible:ring-primary/20'
                      />
                      <span className='absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground select-none'>
                        ₫
                      </span>
                    </div>
                  )}
                />
                <p className='text-[13px] text-muted-foreground font-medium flex items-center gap-1.5 mt-1'>
                  <span className='inline-block w-1.5 h-1.5 rounded-full bg-primary/40'></span>
                  Học viên sẽ thấy giá gốc bị gạch bỏ.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
