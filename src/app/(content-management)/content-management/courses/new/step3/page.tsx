'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Tag, Globe, Wallet, Check, ArrowLeft, Banknote } from 'lucide-react'

type PricingForm = {
  paid: boolean
  price: number
  discountPrice?: number
  status: 'publish' | 'draft'
}

export default function CreateCoursePricing() {
  const form = useForm<PricingForm>({
    defaultValues: {
      paid: true,
      price: 99,
      discountPrice: 49,
      status: 'publish'
    }
  })

  const { register, watch, setValue, handleSubmit } = form
  const paid = watch('paid')

  const onSubmit = (data: PricingForm) => {
    console.log(data)
    toast.success('Course created successfully!')
  }

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-8'>
      {/* Header */}
      <div className='space-y-2'>
        <button className='flex items-center text-sm text-muted-foreground hover:text-foreground'>
          <ChevronLeft className='w-4 h-4 mr-1' />
          Back
        </button>

        <h1 className='text-3xl font-bold'>Create Course - Step 3: Pricing & Status</h1>

        <p className='text-muted-foreground'>
          Set the price and visibility status of your new course before publishing.
        </p>
      </div>

      {/* Progress */}
      <div className='space-y-2'>
        <div className='flex justify-between text-sm'>
          <span>Course Creation Process</span>
          <span>Step 3 of 3</span>
        </div>

        <div className='w-full bg-secondary h-2 rounded-full'>
          <div className='bg-blue-600 h-2 rounded-full w-full'></div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Pricing Strategy */}
        <Card className='p-6 space-y-6'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <Tag size={20} />
              <h3 className='font-semibold text-lg'>Pricing Strategy</h3>
            </div>
            <p className='text-sm text-muted-foreground'>Configure how you want to charge for this course.</p>
          </div>

          <div className='flex items-center justify-between border rounded-lg p-4'>
            <div className='flex items-center gap-3'>
              <Banknote size={20} />
              <div>
                <p className='font-medium'>Paid Course</p>
                <p className='text-sm text-muted-foreground'>Require payment for students to enroll.</p>
              </div>
            </div>

            <Switch checked={paid} onCheckedChange={(value) => setValue('paid', value)} />
          </div>

          {paid && (
            <div className='grid md:grid-cols-2 gap-4'>
              <div className='flex gap-2 flex-col'>
                <Label>Original Price (USD)</Label>
                <Input type='number' {...register('price')} />
              </div>

              <div className='flex gap-2 flex-col'>
                <Label>Discounted/Display Price (Optional)</Label>
                <Input type='number' {...register('discountPrice')} />
                <p className='text-xs text-muted-foreground mt-1'>
                  Leave blank if no discount. Students will see this price.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Course Status */}
        <Card className='p-6 space-y-6'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <Globe size={20} />
              <h3 className='font-semibold text-lg'>Course Status</h3>
            </div>

            <p className='text-sm text-muted-foreground'>Determine when your course becomes available.</p>
          </div>

          <RadioGroup defaultValue='publish' onValueChange={(v) => setValue('status', v as 'publish' | 'draft')}>
            <div className='border rounded-lg p-4 flex items-start gap-3'>
              <RadioGroupItem value='publish' id='publish' />
              <div>
                <Label htmlFor='publish' className='font-medium'>
                  Publish Immediately
                </Label>
                <p className='text-sm text-muted-foreground'>
                  The course will be live and open for enrollment right after you finish.
                </p>
              </div>
            </div>

            <div className='border rounded-lg p-4 flex items-start gap-3'>
              <RadioGroupItem value='draft' id='draft' />
              <div>
                <Label htmlFor='draft' className='font-medium'>
                  Save as Draft
                </Label>
                <p className='text-sm text-muted-foreground'>
                  Keep the course hidden. You can continue editing and publish it later.
                </p>
              </div>
            </div>
          </RadioGroup>
        </Card>

        {/* Footer */}
        <div className='flex  border-t justify-between pt-6'>
          <Button variant='outline'>
            <ArrowLeft className='w-4 h-4 mr-1' />
            Back
          </Button>

          <div className='flex gap-3'>
            <Button variant='outline'>Save Draft</Button>

            <Button type='submit' className='bg-blue-600 hover:bg-blue-700'>
              <Check className='w-4 h-4 ' />
              Finish
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
