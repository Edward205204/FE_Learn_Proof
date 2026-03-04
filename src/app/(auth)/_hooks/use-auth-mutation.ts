import { useMutation } from '@tanstack/react-query'
import authApi from '@/app/(auth)/_api/auth.api'

export function useLoginMutation() {
  return useMutation({
    mutationFn: authApi.login
  })
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: authApi.register
  })
}
