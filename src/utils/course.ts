import { config } from '@/constants/config'

export const getCourseThumbnailUrl = (thumbnail: string | null | undefined) => {
  if (!thumbnail) return 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80'
  if (thumbnail.startsWith('http')) return thumbnail
  // Nếu thumbnail đã là đường dẫn tuyệt đối dạng '/media/...' (do BE trả về), không thêm '/media/' nữa
  if (thumbnail.startsWith('/')) return `${config.BE_URL}${thumbnail}`
  return `${config.BE_URL}/media/${thumbnail}`
}

export const getVideoUrl = (url: string | null | undefined) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  // Nếu url đã là đường dẫn tuyệt đối dạng '/media/...' (do BE trả về), không thêm '/media/' nữa
  if (url.startsWith('/')) return `${config.BE_URL}${url}`
  return `${config.BE_URL}/media/${url}`
}
