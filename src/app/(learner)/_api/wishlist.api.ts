import http from '@/utils/http'

export interface WishlistItem {
  id: string
  userId: string
  courseId: string
  course: {
    id: string
    title: string
    thumbnail: string | null
    price: number
    originalPrice: number | null
    level: string
    creator: {
      fullName: string
    }
    overallAnalytics?: {
      totalStudents: number
      avgRating: number
    }
  }
}

export const wishlistApi = {
  getWishlist: () => http.get<WishlistItem[]>('/wishlist'),
  addToWishlist: (courseId: string) => http.post<WishlistItem>(`/wishlist/${courseId}`),
  removeFromWishlist: (courseId: string) => http.delete<{ count: number }>(`/wishlist/${courseId}`)
}

export default wishlistApi
