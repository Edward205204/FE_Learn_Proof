import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import mediaApi, { MediaUploadResponse } from '../_api/media.api'
import { config } from '@/constants/config'
import type { BaseErrorResponse } from '@/app/(learner)/_hooks/use-enrollment'

/**
 * Helper: Chuyển đường dẫn tương đối từ BE thành URL đầy đủ để hiển thị ảnh.
 * Ví dụ: "/media/abc.webp" → "http://localhost:3000/media/abc.webp"
 */
export function toMediaUrl(relativePath: string | null | undefined): string | null {
  if (!relativePath) return null
  // Nếu đã là URL đầy đủ (http/https) thì giữ nguyên
  if (relativePath.startsWith('http')) return relativePath
  return `${config.BE_URL}${relativePath}`
}

// ─── Hook nội bộ để tái sử dụng logic ─────────────────────────────────────────

function useUploadMutation(
  uploadFn: (file: File) => Promise<{ data: MediaUploadResponse }>,
  { onUploaded }: { onUploaded?: (url: string) => void } = {}
) {
  return useMutation({
    mutationFn: (file: File) => uploadFn(file).then((res) => res.data),
    onSuccess: (data) => {
      toast.success('Tải ảnh lên thành công!')
      onUploaded?.(data.url)
    },
    onError: (error: AxiosError<BaseErrorResponse>) => {
      const data = error.response?.data
      let message = 'Tải ảnh lên thất bại.'
      if (data?.message) {
        message = Array.isArray(data.message) ? data.message.map((e) => e.message).join(', ') : data.message
      }
      toast.error(message)
    }
  })
}

// ─── POST /media/image  ────────────────────────────────────────────────────────

/**
 * Hook upload ảnh thông thường (thumbnail khóa học, ảnh nội dung bài giảng).
 *
 * @param onUploaded - Callback nhận đường dẫn tương đối "/media/<filename>" để lưu vào form.
 *
 * @example
 * const { mutate: uploadImage, isPending } = useUploadImageMutation({
 *   onUploaded: (url) => form.setValue('thumbnail', url)
 * })
 * // Trong input: onChange={(e) => uploadImage(e.target.files[0])}
 */
export function useUploadImageMutation(opts?: { onUploaded?: (url: string) => void }) {
  return useUploadMutation((file) => mediaApi.uploadImage(file), opts)
}

// ─── POST /media/avatar ────────────────────────────────────────────────────────

/**
 * Hook upload ảnh đại diện (avatar profile).
 *
 * @param onUploaded - Callback nhận đường dẫn tương đối "/media/<filename>" để lưu vào form.
 *
 * @example
 * const { mutate: uploadAvatar, isPending } = useUploadAvatarMutation({
 *   onUploaded: (url) => form.setValue('avatar', url)
 * })
 */
export function useUploadAvatarMutation(opts?: { onUploaded?: (url: string) => void }) {
  return useUploadMutation((file) => mediaApi.uploadAvatar(file), opts)
}

// ─── POST /media/avatar-thumbnail ─────────────────────────────────────────────

/**
 * Hook upload thumbnail nhỏ của avatar (dùng trong danh sách, bình luận).
 *
 * @param onUploaded - Callback nhận đường dẫn tương đối "/media/<filename>" để lưu vào form.
 */
export function useUploadAvatarThumbnailMutation(opts?: { onUploaded?: (url: string) => void }) {
  return useUploadMutation((file) => mediaApi.uploadAvatarThumbnail(file), opts)
}
