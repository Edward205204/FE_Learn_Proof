import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import authApi from '@/app/(auth)/_api/auth.api'

export function useLoginMutation() {
  const router = useRouter()
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      toast.success('Đăng nhập thành công!')
      router.push('/')
    }
  })
}

export function useRegisterMutation() {
  const router = useRouter()
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success('Đăng ký thành công!')
      router.push('/')
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
      router.push('/login')
    }
  })
}
