'use client'

import { useId, useRef, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { CloudUpload } from 'lucide-react'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { SimpleEditor } from '@/components/common/simple-editor'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { LEVEL_OPTIONS } from '@/app/(cms)/_constants/course-workflow'
import type { Categories, CreateCourseStep1 } from '@/app/(cms)/_utils/zod'

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
          onChange={() => {
            // Chưa có API upload: chỉ mở picker cho UX, không thay đổi payload submit
            setHasPickedFile(true)
          }}
        />

        <div
          className='border-2 border-dashed border-muted-foreground/20 rounded-xl p-10 flex flex-col items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer group'
          onClick={() => fileInputRef.current?.click()}
          role='button'
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
          }}
        >
          <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
            <CloudUpload className='w-6 h-6 text-primary' />
          </div>
          <p className='text-sm font-medium'>
            <span className='text-primary hover:underline'>Nhấn để tải lên</span> hoặc kéo thả vào đây
          </p>
          <p className='text-xs text-muted-foreground mt-1'>Khuyến nghị: 1280x720px. Tối đa 5MB (JPG, PNG).</p>
          {hasPickedFile ? (
            <p className='text-xs text-muted-foreground mt-2'>Đã chọn file (chưa upload do chưa có API).</p>
          ) : null}
        </div>
      </div>
    </>
  )
}
