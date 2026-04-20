import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import cartApi from '../_api/cart.api'
import paymentApi from '../_api/payment.api'

export const CART_QUERY_KEY = ['cart']

export function useCartQuery(enabled = true) {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    enabled,
    queryFn: async () => {
      const res = await cartApi.getCart()
      return res.data
    }
  })
}

export function useAddToCartMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: () => {
      toast.success('Đã thêm vào giỏ hàng')
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
    onError: () => {
      toast.error('Lỗi khi thêm vào giỏ hàng')
    }
  })
}

export function useRemoveFromCartMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cartApi.removeFromCart,
    onSuccess: () => {
      toast.success('Đã xóa khỏi giỏ hàng')
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
    onError: () => {
      toast.error('Lỗi khi xóa khỏi giỏ hàng')
    }
  })
}

export function useCheckoutMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cartApi.checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    }
  })
}

export function useCreatePaymentFromCartMutation() {
  return useMutation({
    mutationFn: paymentApi.createPaymentFromCart,
  })
}

export function useCreatePaymentMutation() {
  return useMutation({
    mutationFn: paymentApi.createPayment,
  })
}
