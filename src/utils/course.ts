import { config } from '@/constants/config'

export const getCourseThumbnailUrl = (thumbnail: string | null | undefined) => {
  if (!thumbnail) return 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80'
  if (thumbnail.startsWith('http')) return thumbnail
  return `${config.BE_URL}/media/${thumbnail}`
}
