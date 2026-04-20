'use client'

import { useId, useRef, useState } from 'react'
import { Camera, ImageIcon, Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useGetCourseBaseInfoQuery, useUpdateCourseBaseInfoMutation } from '@/app/(cms)/_hooks/use-course-mutation'
import { toMediaUrl, useUploadImageMutation } from '@/app/(cms)/_hooks/use-media'
import type { CreateCourseStep1 } from '@/app/(cms)/_utils/zod'

type EditCourseThumbnailDialogProps = {
  courseId: string
  courseTitle?: string | null
  thumbnail?: string | null
  compact?: boolean
}

function getCourseInitials(title?: string | null) {
  if (!title) return 'KH'

  return title
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

function normalizeThumbnailUrl(url?: string | null) {
  return toMediaUrl(url) ?? url ?? null
}

export function EditCourseThumbnailDialog({
  courseId,
  courseTitle,
  thumbnail,
  compact = false
}: EditCourseThumbnailDialogProps) {
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [open, setOpen] = useState(false)
  const [uploadedThumbnail, setUploadedThumbnail] = useState<string | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)

  const { data: baseInfo, isLoading: isLoadingBaseInfo } = useGetCourseBaseInfoQuery(open ? courseId : '')
  const updateCourseBaseInfoMutation = useUpdateCourseBaseInfoMutation(courseId)

  const currentThumbnail = normalizeThumbnailUrl(thumbnail)
  const persistedThumbnail = normalizeThumbnailUrl(baseInfo?.thumbnail ?? thumbnail)
  const previewThumbnail = uploadedThumbnail ?? persistedThumbnail
  const resolvedTitle = courseTitle?.trim() || baseInfo?.title || 'Khóa học'

  const { mutate: uploadImage, isPending: isUploading } = useUploadImageMutation({
    onUploaded: (url) => {
      setUploadedThumbnail(normalizeThumbnailUrl(url))
    }
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh hợp lệ.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh vượt quá 5MB, vui lòng chọn ảnh nhỏ hơn.')
      return
    }

    setSelectedFileName(file.name)
    uploadImage(file)
  }

  const handleSave = async () => {
    if (!baseInfo) {
      toast.error('Không thể tải thông tin khóa học để lưu ảnh.')
      return
    }

    const payload: CreateCourseStep1 = {
      title: baseInfo.title,
      categoryId: baseInfo.categoryId,
      level: baseInfo.level,
      shortDesc: baseInfo.shortDesc,
      fullDesc: baseInfo.fullDesc,
      thumbnail: previewThumbnail
    }

    if (previewThumbnail === persistedThumbnail) {
      setOpen(false)
      return
    }

    try {
      await updateCourseBaseInfoMutation.mutateAsync(payload)
      setOpen(false)
      setUploadedThumbnail(null)
      setSelectedFileName(null)
    } catch {
      return
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)

    if (!nextOpen) {
      setUploadedThumbnail(null)
      setSelectedFileName(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {compact ? (
        <button
          type='button'
          onClick={() => setOpen(true)}
          className='group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-colors hover:bg-muted/50 cursor-pointer'
          aria-label='Chỉnh sửa ảnh khóa học'
          title='Cập nhật ảnh khóa học'
        >
          <Avatar className='size-8 ring-1 ring-border/60'>
            {currentThumbnail ? (
              <AvatarImage src={currentThumbnail} alt={resolvedTitle} className='object-cover' />
            ) : null}
            <AvatarFallback className='bg-primary/10 text-[10px] font-semibold text-primary'>
              {getCourseInitials(resolvedTitle)}
            </AvatarFallback>
          </Avatar>
          <span className='absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm'>
            <Camera className='size-2.5' />
          </span>
        </button>
      ) : (
        <button
          type='button'
          onClick={() => setOpen(true)}
          className='group flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-3 py-2 shadow-sm transition-colors hover:bg-muted/40'
          aria-label='Chỉnh sửa ảnh khóa học'
        >
          <div className='relative'>
            <Avatar className='size-14 rounded-2xl ring-1 ring-border/60'>
              {currentThumbnail ? (
                <AvatarImage src={currentThumbnail} alt={resolvedTitle} className='object-cover' />
              ) : null}
              <AvatarFallback className='rounded-2xl bg-primary/10 font-semibold text-primary'>
                {getCourseInitials(resolvedTitle)}
              </AvatarFallback>
            </Avatar>
            <span className='absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm'>
              <Camera className='size-3' />
            </span>
          </div>
          <div className='hidden text-left sm:block'>
            <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Ảnh khóa học</p>
            <p className='text-sm font-medium text-foreground group-hover:text-primary'>Đổi ảnh</p>
          </div>
        </button>
      )}

      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>Cập nhật ảnh khóa học</DialogTitle>
          <DialogDescription>
            Chọn ảnh mới để upload trước. Hệ thống chỉ cập nhật khóa học khi bạn nhấn lưu.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='overflow-hidden rounded-2xl border bg-muted'>
            {previewThumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewThumbnail} alt={resolvedTitle} className='h-64 w-full object-cover' />
            ) : (
              <div className='flex h-64 w-full flex-col items-center justify-center gap-3 text-muted-foreground'>
                <ImageIcon className='size-10 opacity-60' />
                <p className='text-sm'>Khóa học này chưa có ảnh.</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            id={inputId}
            type='file'
            accept='image/*'
            className='hidden'
            disabled={isUploading}
            onChange={handleFileChange}
          />

          <div className='flex flex-col gap-3 rounded-2xl border border-dashed border-border/70 bg-muted/20 p-4'>
            <div className='flex flex-col gap-1 text-sm'>
              <span className='font-medium text-foreground'>Ảnh hiển thị trên trang khóa học</span>
              <span className='text-muted-foreground'>Khuyến nghị ảnh ngang, tối đa 5MB.</span>
            </div>

            <div className='flex flex-wrap items-center gap-3'>
              <Button
                type='button'
                variant='outline'
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className='mr-2 size-4 animate-spin' />
                    Đang upload...
                  </>
                ) : (
                  <>
                    <Upload className='mr-2 size-4' />
                    Change
                  </>
                )}
              </Button>

              {selectedFileName ? (
                <span className='text-sm text-muted-foreground'>Đã chọn: {selectedFileName}</span>
              ) : null}
            </div>
          </div>
        </div>

        <DialogFooter className='gap-2'>
          <Button
            type='button'
            variant='ghost'
            onClick={() => setOpen(false)}
            disabled={isUploading || updateCourseBaseInfoMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            type='button'
            onClick={handleSave}
            disabled={isLoadingBaseInfo || isUploading || updateCourseBaseInfoMutation.isPending || !baseInfo}
          >
            {updateCourseBaseInfoMutation.isPending ? (
              <>
                <Loader2 className='mr-2 size-4 animate-spin' />
                Đang lưu...
              </>
            ) : (
              'Lưu ảnh'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
