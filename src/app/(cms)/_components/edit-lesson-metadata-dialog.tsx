'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Clock, AlignLeft } from 'lucide-react'

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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import { useGetLessonDetailQuery, useUpdateLessonMutation } from '@/app/(cms)/_hooks/use-lesson'

// ─── Type Badge Map ────────────────────────────────────────────────────────────
const TYPE_LABEL: Record<string, string> = {
  VIDEO: 'Video',
  QUIZ: 'Quiz'
}

// ─── Schema ──────────────────────────────────────────────────────────────────
// Only for VIDEO and QUIZ lessons — TEXT lessons have their own dedicated page.
const lessonMetadataSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống').max(200, 'Tiêu đề không được vượt quá 200 ký tự'),
  shortDesc: z.string().max(500, 'Mô tả không được vượt quá 500 ký tự').optional().or(z.literal('')),
  // Duration in seconds, only relevant for VIDEO
  duration: z
    .string()
    .optional()
    .refine((v) => !v || /^\d+$/.test(v), { message: 'Thời lượng phải là số nguyên (giây)' })
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

  const lessonType = lessonDetail?.type ?? null
  const isVideoLesson = lessonType === 'VIDEO'

  const form = useForm<LessonMetadataForm>({
    resolver: zodResolver(lessonMetadataSchema),
    defaultValues: { title: '', shortDesc: '', duration: '' }
  })

  // Prefill form khi lessonDetail về
  useEffect(() => {
    if (!lessonDetail) return
    const base = {
      title: lessonDetail.title,
      shortDesc: lessonDetail.shortDesc ?? '',
      duration: ''
    }
    if (lessonDetail.type === 'VIDEO') {
      base.duration = lessonDetail.duration != null ? String(lessonDetail.duration) : ''
    }
    form.reset(base)
  }, [lessonDetail, form])

  // Reset form khi đóng dialog
  useEffect(() => {
    if (!open) form.reset({ title: '', shortDesc: '', duration: '' })
  }, [open, form])

  const onSubmit = async (data: LessonMetadataForm) => {
    if (!lessonDetail) return

    const payload: Record<string, unknown> = {
      type: lessonDetail.type,
      title: data.title,
      shortDesc: data.shortDesc || undefined
    }

    // Only include duration for VIDEO (BE rejects it for others)
    if (lessonDetail.type === 'VIDEO') {
      payload.duration = data.duration ? Number(data.duration) : undefined
    }

    await updateMutation.mutateAsync(payload as Parameters<typeof updateMutation.mutateAsync>[0])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[520px]'>
        <DialogHeader>
          <div className='flex items-center gap-2.5'>
            <DialogTitle className='text-lg font-bold'>Chỉnh sửa bài học</DialogTitle>
            {lessonType && (
              <Badge variant='secondary' className='text-xs font-semibold tracking-wide shrink-0'>
                {TYPE_LABEL[lessonType] ?? lessonType}
              </Badge>
            )}
          </div>
          <DialogDescription className='text-sm text-muted-foreground'>
            Cập nhật thông tin bài học. Nội dung video / quiz không bị ảnh hưởng.
          </DialogDescription>
        </DialogHeader>

        {isLoadingDetail ? (
          <div className='flex items-center justify-center py-10 gap-2 text-muted-foreground'>
            <Loader2 className='size-5 animate-spin' />
            <span className='text-sm'>Đang tải thông tin bài học...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5 py-2'>
              {/* ─── Tiêu đề ─────────────────────────────────────────── */}
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

              {/* ─── Mô tả ngắn ──────────────────────────────────────── */}
              <FormField
                control={form.control}
                name='shortDesc'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel className='font-semibold'>
                        <AlignLeft className='inline size-3.5 mr-1 -mt-0.5' />
                        Mô tả ngắn
                      </FormLabel>
                      <span className='text-[11px] text-muted-foreground/60'>{(field.value ?? '').length}/500</span>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder='Mô tả ngắn về nội dung bài học này...'
                        className='min-h-[90px] resize-none'
                        maxLength={500}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ─── Duration — chỉ hiện khi type là VIDEO ─────────────── */}
              {isVideoLesson && (
                <>
                  <Separator />
                  <FormField
                    control={form.control}
                    name='duration'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='font-semibold'>
                          <Clock className='inline size-3.5 mr-1 -mt-0.5' />
                          Thời lượng <span className='font-normal text-muted-foreground text-xs'>(giây)</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            min={0}
                            placeholder='Ví dụ: 600 (10 phút)'
                            {...field}
                            className='h-10 max-w-[220px]'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

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
