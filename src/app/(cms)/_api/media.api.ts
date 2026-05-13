import http from '@/utils/http'

/**
 * Response chung cho mọi endpoint upload của BE.
 * url là đường dẫn tương đối, ví dụ: "/media/abc123.webp"
 * Để hiển thị ảnh, cần prepend config.BE_URL: `${config.BE_URL}${url}`
 */
export type MediaUploadResponse = {
  url: string
}

/**
 * Helper: Tạo FormData với field "file" — đúng theo BE dùng FileInterceptor('file').
 */
function buildFormData(file: File): FormData {
  const form = new FormData()
  form.append('file', file)
  return form
}

const mediaApi = {
  /**
   * POST /media/image — Upload ảnh thông thường (thumbnail khóa học, ảnh nội dung).
   * Giới hạn 5MB. BE tự convert sang WebP. Trả về { url: "/media/<filename>" }.
   */
  uploadImage: (file: File) =>
    http.post<MediaUploadResponse>('/media/image', buildFormData(file), {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  /**
   * POST /media/avatar — Upload ảnh đại diện (avatar profile).
   * Giới hạn 5MB. Trả về { url: "/media/<filename>" }.
   */
  uploadAvatar: (file: File) =>
    http.post<MediaUploadResponse>('/media/avatar', buildFormData(file), {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  /**
   * POST /media/avatar-thumbnail — Upload thumbnail nhỏ của avatar (dùng trong danh sách, bình luận).
   * Giới hạn 2MB. Trả về { url: "/media/<filename>" }.
   */
  uploadAvatarThumbnail: (file: File) =>
    http.post<MediaUploadResponse>('/media/avatar-thumbnail', buildFormData(file), {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
}

export default mediaApi
