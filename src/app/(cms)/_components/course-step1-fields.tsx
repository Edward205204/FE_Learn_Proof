'use client'

import { useId, useRef, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { CloudUpload, Loader2, Sparkles } from 'lucide-react'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SimpleEditor } from '@/components/common/simple-editor'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { LEVEL_OPTIONS } from '@/app/(cms)/_constants/course-workflow'
import type { Categories, CreateCourseStep1 } from '@/app/(cms)/_utils/zod'
import { toMediaUrl, useUploadImageMutation } from '@/app/(cms)/_hooks/use-media'

type Props = {
  form: UseFormReturn<CreateCourseStep1>
  categories?: Categories[]
  shortDescriptionLength: number
  thumbnailUrl?: string | null
}

export function CourseStep1Fields({ form, categories, shortDescriptionLength, thumbnailUrl }: Props) {
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [pickedFileName, setPickedFileName] = useState<string | null>(null)
  const thumbnailError = form.formState.errors.thumbnail?.message

  const { mutate: uploadImage, isPending: isUploading } = useUploadImageMutation({
    onUploaded: (url) => {
      const fullUrl = toMediaUrl(url) ?? url
      form.setValue('thumbnail', fullUrl, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
      form.clearErrors('thumbnail')
    }
  })

  const handlePickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      form.setError('thumbnail', { type: 'manual', message: 'Vui lòng chọn file ảnh hợp lệ.' })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      form.setError('thumbnail', { type: 'manual', message: 'Ảnh vượt quá 5MB, vui lòng chọn ảnh nhỏ hơn.' })
      return
    }

    setPickedFileName(file.name)
    form.clearErrors('thumbnail')
    uploadImage(file)
  }

  return (
    <>
      <FormField
        control={form.control}
        name='title'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='font-semibold'>
              Tiêu đề khóa học <span className='text-destructive'>*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder='Ví dụ: Tiếng Anh thương mại cho người đi làm' {...field} className='h-12' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <FormField
          control={form.control}
          name='categoryId'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>Danh mục</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className='h-12'>
                    <SelectValue placeholder='Chọn danh mục' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className='h-12'>
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

      <FormField
        control={form.control}
        name='shortDesc'
        render={({ field }) => (
          <FormItem>
            <div className='flex justify-between items-end'>
              <FormLabel className='font-semibold'>Mô tả ngắn</FormLabel>
              <span className='text-[10px] uppercase font-bold text-muted-foreground tracking-tighter'>
                {shortDescriptionLength}/250
              </span>
            </div>
            <FormControl>
              <SimpleEditor
                value={field.value}
                onChange={field.onChange}
                placeholder='Mô tả ngắn gọn nội dung và lợi ích khóa học mang lại cho học viên...'
                minHeight='min-h-[100px]'
              />
            </FormControl>
            <FormDescription className='text-xs italic'>
              Mô tả này xuất hiện trên thẻ khóa học ở trang chợ khóa học.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='bg-primary/5 border border-primary/20 rounded-xl p-6 space-y-4'>
        <div className='flex items-center gap-2 text-primary font-semibold'>
          <Sparkles className='w-4 h-4 text-primary fill-primary/20' />
          <span className='text-sm'>Ngữ cảnh cho AI Assistant</span>
        </div>
        <p className='text-sm text-primary/80 leading-relaxed'>
          Dán đề cương, ghi chú hoặc ý tưởng chi tiết vào đây. AI sẽ dùng thông tin này để tự động tạo nội dung chương
          học, mô tả bài học và câu hỏi quiz ở các bước tiếp theo.
        </p>
        <FormField
          control={form.control}
          name='fullDesc'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder='Ví dụ: Tuần 1: Giới thiệu khái niệm. Tuần 2: Thực hành chuyên sâu... Bao gồm mục tiêu học tập và kiến thức trọng tâm.'
                  className='min-h-[150px] bg-background border-primary/20 focus-visible:ring-primary/30'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className='space-y-3'>
        <label className='text-sm font-semibold'>Ảnh bìa khóa học</label>

        {thumbnailUrl ? (
          <div className='rounded-xl overflow-hidden ring-1 ring-border/50 bg-muted'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnailUrl} alt='Thumbnail hiện tại' className='w-full max-h-[220px] object-cover' />
          </div>
        ) : null}

        <input
          ref={fileInputRef}
          id={inputId}
          type='file'
          accept='image/*'
          className='hidden'
          disabled={isUploading}
          onChange={handlePickFile}
        />

        <div
          className='border-2 border-dashed border-muted-foreground/20 rounded-xl p-10 flex flex-col items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer group disabled:pointer-events-none disabled:opacity-70'
          onClick={() => {
            if (!isUploading) fileInputRef.current?.click()
          }}
          role='button'
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !isUploading) fileInputRef.current?.click()
          }}
        >
          <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
            {isUploading ? (
              <Loader2 className='w-6 h-6 text-primary animate-spin' />
            ) : (
              <CloudUpload className='w-6 h-6 text-primary' />
            )}
          </div>
          <p className='text-sm font-medium'>
            {isUploading ? (
              <span className='text-primary'>Đang tải ảnh lên...</span>
            ) : (
              <>
                <span className='text-primary hover:underline'>Nhấn để tải lên</span> hoặc kéo thả vào đây
              </>
            )}
          </p>
          <p className='text-xs text-muted-foreground mt-1'>Khuyến nghị: 1280x720px. Tối đa 5MB (JPG, PNG).</p>
          {pickedFileName ? (
            <p className='text-xs text-muted-foreground mt-2 truncate max-w-full'>Đã chọn: {pickedFileName}</p>
          ) : null}
        </div>
        {thumbnailUrl ? (
          <button
            type='button'
            className='text-xs text-muted-foreground hover:text-foreground underline underline-offset-2'
            onClick={() =>
              form.setValue('thumbnail', null, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
            }
          >
            Xóa ảnh bìa hiện tại
          </button>
        ) : null}
        {thumbnailError ? <p className='text-sm text-destructive'>{thumbnailError}</p> : null}
      </div>
    </>
  )
}
