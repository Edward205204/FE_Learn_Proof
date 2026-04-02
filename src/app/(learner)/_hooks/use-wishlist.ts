import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import wishlistApi from '../_api/wishlist.api'

export const WISHLIST_QUERY_KEY = ['wishlist']

export function useWishlistQuery() {
  return useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: async () => {
      const res = await wishlistApi.getWishlist()
      return res.data
    }
  })
}

export function useAddToWishlistMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: wishlistApi.addToWishlist,
    onSuccess: () => {
      toast.success('Đã thêm vào danh sách yêu thích')
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY })
    },
    onError: () => {
      toast.error('Lỗi khi thêm vào yêu thích')
    }
  })
}

export function useRemoveFromWishlistMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: wishlistApi.removeFromWishlist,
    onSuccess: () => {
      toast.success('Đã xóa khỏi danh sách yêu thích')
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY })
    },
    onError: () => {
      toast.error('Lỗi khi xóa khỏi yêu thích')
    }
  })
}
