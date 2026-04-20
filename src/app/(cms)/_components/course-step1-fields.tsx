'use client'

import { useId, useRef, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { CloudUpload, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SimpleEditor } from '@/components/common/simple-editor'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { LEVEL_OPTIONS } from '@/app/(cms)/_constants/course-workflow'
import type { Categories, CreateCourseStep1 } from '@/app/(cms)/_utils/zod'
import mediaApi from '@/app/(cms)/_api/media.api'
import { config } from '@/constants/config'

type Props = {
  form: UseFormReturn<CreateCourseStep1>
  categories?: Categories[]
  shortDescriptionLength: number
  thumbnailUrl?: string | null
}

export function CourseStep1Fields({ form, categories, shortDescriptionLength, thumbnailUrl }: Props) {
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [hasPickedFile, setHasPickedFile] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Dùng form.watch để trigger re-render khi giá trị thay đổi
  const watchThumbnail = form.watch('thumbnail')
  const displayThumbnailUrl = watchThumbnail || thumbnailUrl

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const res = await mediaApi.uploadImage(file)
      // res.data.url hoặc res.url tuỳ theo axios config response interceptor
      const url = res.data?.url || (res as unknown as { url: string }).url || ''
      if (url) {
        // Lắp config.BE_URL nếu là đường dẫn tương đối để pass Zod schema "url()"
        const fullUrl = url.startsWith('http') ? url : `${config.BE_URL}${url}`
        form.setValue('thumbnail', fullUrl, { shouldValidate: true })
        setHasPickedFile(true)
        toast.success('Upload ảnh bìa thành công')
      }
    } catch (error) {
      console.error('Upload lỗi:', error)
      toast.error('Upload ảnh thất bại, vui lòng thử lại!')
    } finally {
      setIsUploading(false)
      // reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
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


      <div className='space-y-3'>
        <label className='text-sm font-semibold'>Ảnh bìa khóa học</label>

        {displayThumbnailUrl ? (
          <div className='rounded-xl overflow-hidden ring-1 ring-border/50 bg-muted'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={displayThumbnailUrl} alt='Thumbnail hiện tại' className='w-full max-h-[220px] object-cover' />
          </div>
        ) : null}

        <input
          ref={fileInputRef}
          id={inputId}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={handleFileChange}
          disabled={isUploading}
        />

        <div
          className={`border-2 border-dashed border-muted-foreground/20 rounded-xl p-10 flex flex-col items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-colors ${
            isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer group'
          }`}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          role='button'
          tabIndex={0}
          onKeyDown={(e) => {
            if (!isUploading && (e.key === 'Enter' || e.key === ' ')) fileInputRef.current?.click()
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
              <span>Đang tải lên...</span>
            ) : (
              <span>
                <span className='text-primary hover:underline'>Nhấn để tải lên</span> hoặc kéo thả vào đây
              </span>
            )}
          </p>
          <p className='text-xs text-muted-foreground mt-1'>Khuyến nghị: 1280x720px. Tối đa 5MB (JPG, PNG).</p>
          {hasPickedFile && displayThumbnailUrl && !isUploading ? (
            <p className='text-xs text-green-600 mt-2 font-medium'>Đã upload ảnh thành công.</p>
          ) : null}
        </div>
      </div>
    </>
  )
}
