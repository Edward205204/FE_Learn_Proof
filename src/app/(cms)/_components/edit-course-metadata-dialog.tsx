'use client'

import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SimpleEditor } from '@/components/common/simple-editor'

import { LEVEL_OPTIONS } from '@/app/(cms)/_constants/course-workflow'
import {
  updateCourseBaseInfoSchema,
  type UpdateCourseBaseInfo,
  type CreateCourseStep1,
  type Categories
} from '@/app/(cms)/_utils/zod'
import {
  useGetCourseBaseInfoQuery,
  useGetCategoriesQuery,
  useUpdateCourseBaseInfoMutation
} from '../_hooks/use-course-mutation'

interface Props {
  courseId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCourseMetadataDialog({ courseId, open, onOpenChange }: Props) {
  // Chỉ fetch khi dialog mở và có courseId
  const { data: baseInfo, isLoading: isLoadingInfo } = useGetCourseBaseInfoQuery(open && courseId ? courseId : '')
  const { data: categories } = useGetCategoriesQuery()
  const updateMutation = useUpdateCourseBaseInfoMutation(courseId ?? '')

  const form = useForm<UpdateCourseBaseInfo>({
    resolver: zodResolver(updateCourseBaseInfoSchema),
    defaultValues: {
      title: '',
      categoryId: '',
      level: 'BEGINNER',
      shortDesc: '',
      fullDesc: '',
      thumbnail: null,
      isFree: true,
      price: 0,
      originalPrice: null
    }
  })

  // Prefill form khi baseInfo về
  useEffect(() => {
    if (!baseInfo) return
    form.reset({
      title: baseInfo.title,
      categoryId: baseInfo.categoryId,
      level: baseInfo.level,
      shortDesc: baseInfo.shortDesc,
      fullDesc: baseInfo.fullDesc,
      thumbnail: baseInfo.thumbnail ?? null,
      isFree: baseInfo.isFree ?? true,
      price: baseInfo.price ?? 0,
      originalPrice: baseInfo.originalPrice ?? null
    })
  }, [baseInfo, form])

  // Reset form khi đóng dialog
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  const shortDescValue = useWatch({ control: form.control, name: 'shortDesc' })
  const shortDescLen = shortDescValue?.length ?? 0

  const onSubmit = async (data: UpdateCourseBaseInfo) => {
    await updateMutation.mutateAsync(data as unknown as CreateCourseStep1)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-lg font-bold'>Chỉnh sửa thông tin khóa học</DialogTitle>
          <DialogDescription className='text-sm text-muted-foreground'>
            Cập nhật nhanh metadata cơ bản. Các thay đổi về chương học và giá sẽ không bị ảnh hưởng.
          </DialogDescription>
        </DialogHeader>

        {isLoadingInfo ? (
          <div className='flex items-center justify-center py-12 gap-2 text-muted-foreground'>
            <Loader2 className='size-5 animate-spin' />
            <span className='text-sm'>Đang tải thông tin khóa học...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5 py-2'>
              {/* Tiêu đề */}
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>
                      Tiêu đề khóa học <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Ví dụ: Tiếng Anh thương mại cho người đi làm' {...field} className='h-10' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Danh mục + Trình độ */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='categoryId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>Danh mục</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger className='h-10'>
                            <SelectValue placeholder='Chọn danh mục' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(categories ?? []).map((cat: Category) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='level'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>Trình độ</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger className='h-10'>
                            <SelectValue placeholder='Chọn trình độ' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LEVEL_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Mô tả ngắn */}
              <FormField
                control={form.control}
                name='shortDesc'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex justify-between items-end'>
                      <FormLabel className='font-semibold'>Mô tả ngắn</FormLabel>
                      <span className='text-[10px] uppercase font-bold text-muted-foreground tracking-tighter'>
                        {shortDescLen}/250
                      </span>
                    </div>
                    <FormControl>
                      <SimpleEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder='Mô tả ngắn gọn nội dung và lợi ích khóa học...'
                        minHeight='min-h-[90px]'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Giá cả */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='price'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>Giá bán (VNĐ)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='0 = Miễn phí'
                          {...field}
                          onChange={(e) => {
                            const val = Number(e.target.value)
                            field.onChange(val)
                            form.setValue('isFree', val === 0)
                          }}
                          className='h-10'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='originalPrice'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>Giá gốc (VNĐ) (Tùy chọn)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='Để trống không giảm giá'
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                          className='h-10'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className='pt-2 gap-2'>
                <Button
                  type='button'
                  variant='ghost'
                  onClick={() => onOpenChange(false)}
                  disabled={updateMutation.isPending}
                >
                  Hủy
                </Button>
                <Button type='submit' disabled={updateMutation.isPending || isLoadingInfo} className='min-w-[110px]'>
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
