import http from '@/utils/http'
import { User } from '@/@types/user'
import { AuthResponse } from '../_types/auth'

const authApi = {
  login: (body: { email: string; password: string }) => http.post<AuthResponse>('/auth/login', body),

  register: (body: { email: string; fullName: string; password: string; confirmPassword: string; code: string }) =>
    http.post<AuthResponse>('/auth/register', body),

  sendOtpRegister: (body: { email: string }) => http.post<{ message: string }>('/auth/otp/register', body),

  forgotPassword: (body: { email: string }) => http.post<{ message: string }>('/auth/forgot-password', body),

  forgotPasswordVerify: (body: { email: string; code: string }) =>
    http.post<{ message: string }>('/auth/forgot-password/verify', body),

  resetPassword: (body: { email: string; password: string; confirmPassword: string }) =>
    http.post<{ message: string }>('/auth/reset-password', body),

  getProfile: (accessToken: string) =>
    http.get<User>('/auth/me', { headers: { Authorization: `Bearer ${accessToken}` } }),

  getMe: () => http.get<User>('/auth/me'),

  updateProfile: (body: {
    fullName?: string
    bio?: string | null
    headline?: string | null
    website?: string | null
    isOnboardingCompleted?: boolean
  }) => http.patch<User>('/auth/me', body)
}

export default authApi
