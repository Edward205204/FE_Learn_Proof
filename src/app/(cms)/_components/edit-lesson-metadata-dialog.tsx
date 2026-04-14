'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import { useGetLessonDetailQuery, useUpdateLessonMutation } from '@/app/(cms)/_hooks/use-lesson'

// ─── Schema ──────────────────────────────────────────────────────────────────
const lessonMetadataSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống').max(200, 'Tiêu đề không được vượt quá 200 ký tự'),
  shortDesc: z.string().max(500, 'Mô tả không được vượt quá 500 ký tự').optional().or(z.literal(''))
})

type LessonMetadataForm = z.infer<typeof lessonMetadataSchema>

// ─── Props ───────────────────────────────────────────────────────────────────
interface Props {
  lessonId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ─── Component ───────────────────────────────────────────────────────────────
export function EditLessonMetadataDialog({ lessonId, open, onOpenChange }: Props) {
  // Chỉ fetch khi dialog mở và có lessonId
  const { data: lessonDetail, isLoading: isLoadingDetail } = useGetLessonDetailQuery(open && lessonId ? lessonId : '')
  const updateMutation = useUpdateLessonMutation(lessonId ?? '')

  const form = useForm<LessonMetadataForm>({
    resolver: zodResolver(lessonMetadataSchema),
    defaultValues: { title: '', shortDesc: '' }
  })

  // Prefill form khi lessonDetail về
  useEffect(() => {
    if (!lessonDetail) return
    form.reset({
      title: lessonDetail.title,
      shortDesc: lessonDetail.shortDesc ?? ''
    })
  }, [lessonDetail, form])

  // Reset form khi đóng dialog
  useEffect(() => {
    if (!open) form.reset({ title: '', shortDesc: '' })
  }, [open, form])

  const onSubmit = async (data: LessonMetadataForm) => {
    if (!lessonDetail) return
    await updateMutation.mutateAsync({
      type: lessonDetail.type,
      title: data.title,
      shortDesc: data.shortDesc || undefined
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='text-lg font-bold'>Chỉnh sửa thông tin bài học</DialogTitle>
          <DialogDescription className='text-sm text-muted-foreground'>
            Cập nhật nhanh tiêu đề và mô tả ngắn. Nội dung bài học không bị ảnh hưởng.
          </DialogDescription>
        </DialogHeader>

        {isLoadingDetail ? (
          <div className='flex items-center justify-center py-10 gap-2 text-muted-foreground'>
            <Loader2 className='size-5 animate-spin' />
            <span className='text-sm'>Đang tải thông tin bài học...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 py-2'>
              {/* Tiêu đề */}
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>
                      Tiêu đề bài học <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Ví dụ: Giới thiệu khái niệm cơ bản' {...field} className='h-10' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mô tả ngắn */}
              <FormField
                control={form.control}
                name='shortDesc'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>Mô tả ngắn</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Mô tả ngắn về nội dung bài học này...'
                        className='min-h-[90px] resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className='pt-2 gap-2'>
                <Button
                  type='button'
                  variant='ghost'
                  onClick={() => onOpenChange(false)}
                  disabled={updateMutation.isPending}
                >
                  Hủy
                </Button>
                <Button type='submit' disabled={updateMutation.isPending || isLoadingDetail} className='min-w-[110px]'>
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className='size-4 animate-spin mr-2' />
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu thay đổi'
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
