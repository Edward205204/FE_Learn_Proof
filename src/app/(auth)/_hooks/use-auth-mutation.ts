import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import authApi from '@/app/(auth)/_api/auth.api'
import { PATH } from '@/constants/path'
import { useAuthStore } from '@/store/auth.store'

export function useGetMeQuery() {
  const { accessToken, setAuth, refreshToken } = useAuthStore()
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await authApi.getMe()
      // sync store để giữ user luôn up-to-date với DB
      setAuth({ user: res.data, accessToken, refreshToken })
      return res.data
    },
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5 // 5 phút
  })
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()
  const { user, accessToken, refreshToken, setAuth } = useAuthStore()
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      setAuth({ user: { ...user!, ...res.data }, accessToken, refreshToken })
    }
  })
}

export function useLoginMutation() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const { user, tokens } = response.data
      setAuth({ user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken })

      toast.success('Đăng nhập thành công!')
      router.refresh()

      if (user.role === 'CONTENT_MANAGER') {
        router.replace(PATH.STUDIO_COURSES)
      } else if (user.role === 'ADMIN') {
        router.replace(PATH.ADMIN)
      } else {
        router.replace(PATH.HOME)
      }
    }
  })
}

export function useRegisterMutation() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      const { user, tokens } = response.data
      setAuth({ user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken })

      toast.success('Đăng ký thành công!')
      router.refresh()

      if (user.role === 'CONTENT_MANAGER') {
        router.replace(PATH.STUDIO_COURSES)
      } else if (user.role === 'ADMIN') {
        router.replace(PATH.ADMIN)
      } else {
        router.replace(PATH.HOME)
      }
    }
  })
}

export function useSendOtpMutation() {
  return useMutation({
    mutationFn: authApi.sendOtpRegister,
    onSuccess: (response) => {
      toast.success(response.data.message)
    }
  })
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (response) => {
      toast.success(response.data.message || 'Yêu cầu đặt lại mật khẩu đã được gửi!')
    }
  })
}

export function useForgotPasswordVerifyMutation() {
  return useMutation({
    mutationFn: authApi.forgotPasswordVerify
  })
}

export function useResetPasswordMutation() {
  const router = useRouter()
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (response) => {
      toast.success(response.data.message || 'Mật khẩu đã được đặt lại thành công!')
      router.push(PATH.LOGIN)
    }
  })
}
