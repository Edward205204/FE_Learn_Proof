import http from '@/utils/http'
import { AuthResponse } from '../_types/auth'

const authApi = {
  login: (body: { email: string; password: string }) => http.post<AuthResponse>('/auth/login', body),
  register: (body: { email: string; fullName: string; password: string; confirmPassword: string; code: string }) =>
    http.post<AuthResponse>('/auth/register', body),
  sendOtpRegister: (body: { email: string }) => http.post<{ message: string }>('/auth/otp/register', body),
  forgotPassword: (body: { email: string }) => http.post<{ message: string }>('/auth/forgot-password', body),
  verifyResetPassword: (body: { code: string }) => http.post<{ message: string }>('/auth/verify-reset-password', body),
  resetPassword: (body: { code: string } & any) => http.post<{ message: string }>('/auth/reset-password', body)
}

export default authApi
