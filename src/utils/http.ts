import axios, { AxiosError, AxiosInstance } from 'axios'
import { HttpStatusCode } from '@/constants/http-status'
import { toast } from 'sonner'
import { config } from '@/constants/config'
import { useAuthStore } from '@/store/auth.store'

class Http {
  instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: config.BE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use((config) => {
      const { accessToken } = useAuthStore.getState()
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
      return config
    })

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url?.endsWith('/auth/login') || url?.endsWith('/auth/register')) {
          const { tokens, user } = response.data
          useAuthStore.getState().setAuth({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user
          })
        }
        return response
      },
      (error: AxiosError<{ message: string | { message: string }[]; statusCode: number }>) => {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const data = error.response?.data
          let message = error.message

          if (data?.message) {
            message = Array.isArray(data.message) ? data.message.map((e) => e.message).join(', ') : data.message
          }

          toast.error(message)

          if (error.response?.status === HttpStatusCode.Unauthorized) {
            useAuthStore.getState().clearAuth()
          }
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
