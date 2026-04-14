'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useUpdateCourseStatusMutation, useGetManagerCourseDetailQuery } from '@/app/(cms)/_hooks/use-course-mutation'

const statusSchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
})

type StatusFormValues = z.infer<typeof statusSchema>

interface Props {
  courseId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCourseStatusDialog({ courseId, open, onOpenChange }: Props) {
  const { data: courseDetail, isLoading } = useGetManagerCourseDetailQuery(open && courseId ? courseId : '')
  const statusMutation = useUpdateCourseStatusMutation(courseId ?? '')

  const form = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      status: 'DRAFT'
    }
  })

  // Prefill form
  useEffect(() => {
    if (!courseDetail) return
    form.reset({
      status: courseDetail.status as any
    })
  }, [courseDetail, form])

  const onSubmit = async (data: StatusFormValues) => {
    if (data.status !== courseDetail?.status) {
      await statusMutation.mutateAsync(data.status)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[400px]'>
        <DialogHeader>
          <DialogTitle className='text-lg font-bold'>Chỉnh sửa trạng thái hiển thị</DialogTitle>
          <DialogDescription className='text-sm text-muted-foreground'>
            Cập nhật trạng thái để khóa học có thể hiển thị hoặc ẩn đi với người dùng học viên.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className='flex items-center justify-center py-12 gap-2 text-muted-foreground'>
            <Loader2 className='size-5 animate-spin' />
            <span className='text-sm'>Đang tải thông tin...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 pt-4'>
              {/* Trạng thái */}
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>Trạng thái khóa học</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='h-10'>
                          <SelectValue placeholder='Chọn trạng thái' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='DRAFT'>Bản nháp (Đang soạn thảo)</SelectItem>
                        <SelectItem value='PUBLISHED'>Xuất bản (Hiển thị công khai)</SelectItem>
                        <SelectItem value='ARCHIVED'>Lưu trữ (Đóng đăng ký)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className='pt-2 gap-2'>
                <Button
                  type='button'
                  variant='ghost'
                  onClick={() => onOpenChange(false)}
                  disabled={statusMutation.isPending}
                >
                  Hủy
                </Button>
                <Button type='submit' disabled={statusMutation.isPending || isLoading} className='min-w-[110px]'>
                  {statusMutation.isPending ? (
                    <>
                      <Loader2 className='size-4 animate-spin mr-2' />
                      Đang lưu...
                    </>
                  ) : (
                    'Cập nhật'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
