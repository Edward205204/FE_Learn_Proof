'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Tag, Globe, Banknote, Check } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { PATH } from '@/constants/path'
import { createCourseStep3Schema, CreateCourseStep3Values } from '@/app/(content-management)/_utils/zod'
import { CourseStepper } from '@/app/(content-management)/_components/course-stepper'

export default function CreateCourseStep3Page() {
  const router = useRouter()

  const { register, watch, setValue, handleSubmit } = useForm<CreateCourseStep3Values>({
    resolver: zodResolver(createCourseStep3Schema),
    defaultValues: {
      isFree: false,
      price: 299000,
      discount: undefined,
      status: 'PUBLISHED'
    }
  })

  const isFree = watch('isFree')

  const onSubmit = (data: CreateCourseStep3Values) => {
    // TODO: Gộp data từ step1 + step2 + step3 rồi gọi createCourseMutation khi có BE
    console.log('Bước 3:', data)
    toast.success('Đã tạo khóa học thành công!')
    router.push(PATH.COURSE_NEW_FINISH)
  }

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-8'>
      <div className='space-y-2'>
        <button
          type='button'
          onClick={() => router.push(PATH.COURSE_NEW_STEP2)}
          className='flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors'
        >
          <ChevronLeft className='w-4 h-4 mr-1' />
          Quay lại bước trước
        </button>
        <h1 className='text-3xl font-bold tracking-tight'>Tạo khóa học mới</h1>
        <p className='text-muted-foreground'>Thiết lập giá và trạng thái xuất bản cho khóa học.</p>
      </div>

      <CourseStepper currentStep={3} />

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <Card className='p-6 space-y-6'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <Tag size={18} className='text-muted-foreground' />
              <h3 className='font-semibold text-lg'>Chiến lược giá</h3>
            </div>
            <p className='text-sm text-muted-foreground'>Cấu hình cách tính phí cho khóa học này.</p>
          </div>

          <div className='flex items-center justify-between border rounded-lg p-4'>
            <div className='flex items-center gap-3'>
              <Banknote size={18} className='text-muted-foreground' />
              <div>
                <p className='font-medium'>Khóa học có phí</p>
                <p className='text-sm text-muted-foreground'>Học viên phải thanh toán để đăng ký học.</p>
              </div>
            </div>
            <Switch
              checked={!isFree}
              onCheckedChange={(checked) => setValue('isFree', !checked)}
            />
          </div>

          {!isFree && (
            <div className='grid md:grid-cols-2 gap-4'>
              <div className='flex gap-2 flex-col'>
                <Label htmlFor='price'>Giá gốc (VNĐ)</Label>
                <Input
                  id='price'
                  type='number'
                  min={0}
                  placeholder='299000'
                  {...register('price', { valueAsNumber: true })}
                />
              </div>

              <div className='flex gap-2 flex-col'>
                <Label htmlFor='discount'>Giá khuyến mãi (Tuỳ chọn)</Label>
                <Input
                  id='discount'
                  type='number'
                  min={0}
                  placeholder='Để trống nếu không giảm giá'
                  {...register('discount', { valueAsNumber: true })}
                />
                <p className='text-xs text-muted-foreground'>Học viên sẽ thấy giá này trên trang khóa học.</p>
              </div>
            </div>
          )}
        </Card>

        <Card className='p-6 space-y-6'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <Globe size={18} className='text-muted-foreground' />
              <h3 className='font-semibold text-lg'>Trạng thái xuất bản</h3>
            </div>
            <p className='text-sm text-muted-foreground'>Xác định thời điểm khóa học của bạn được công khai.</p>
          </div>

          <RadioGroup
            defaultValue='PUBLISHED'
            onValueChange={(v) => setValue('status', v as CreateCourseStep3Values['status'])}
          >
            <div className='border rounded-lg p-4 flex items-start gap-3'>
              <RadioGroupItem value='PUBLISHED' id='status-published' />
              <div>
                <Label htmlFor='status-published' className='font-medium cursor-pointer'>
                  Xuất bản ngay
                </Label>
                <p className='text-sm text-muted-foreground mt-0.5'>
                  Khóa học sẽ được công khai và mở đăng ký ngay sau khi hoàn tất.
                </p>
              </div>
            </div>

            <div className='border rounded-lg p-4 flex items-start gap-3'>
              <RadioGroupItem value='DRAFT' id='status-draft' />
              <div>
                <Label htmlFor='status-draft' className='font-medium cursor-pointer'>
                  Lưu bản nháp
                </Label>
                <p className='text-sm text-muted-foreground mt-0.5'>
                  Khóa học sẽ ở trạng thái ẩn. Bạn có thể tiếp tục chỉnh sửa và xuất bản sau.
                </p>
              </div>
            </div>
          </RadioGroup>
        </Card>

        <div className='flex border-t justify-between pt-6'>
          <Button variant='outline' type='button' onClick={() => router.push(PATH.COURSE_NEW_STEP2)}>
            <ChevronLeft className='w-4 h-4 mr-1' />
            Quay lại
          </Button>

          <div className='flex gap-3'>
            <Button variant='outline' type='button'>
              Lưu bản nháp
            </Button>
            <Button type='submit'>
              <Check className='w-4 h-4 mr-1' />
              Hoàn tất
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
