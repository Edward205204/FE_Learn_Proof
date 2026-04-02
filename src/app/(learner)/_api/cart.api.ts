import http from '@/utils/http'

export interface CartItem {
  id: string
  courseId: string
  course: {
    id: string
    title: string
    price: number
    originalPrice: number | null
    thumbnail: string | null
    creator: {
      fullName: string
    }
    overallAnalytics?: {
      totalStudents: number
    }
  }
}

export interface CartResponse {
  id: string
  userId: string
  items: CartItem[]
}

export const cartApi = {
  getCart: () => http.get<CartResponse>('/cart'),
  addToCart: (courseId: string) => http.post<CartResponse>('/cart/items', { courseId }),
  removeFromCart: (courseId: string) => http.delete<CartResponse>(`/cart/items/${courseId}`)
}

export default cartApi
