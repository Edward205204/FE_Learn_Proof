import { User } from '@/@types/user'

export interface AuthResponse {
  tokens: {
    accessToken: string
    refreshToken: string
  }
  user: User
}

export interface ApiFieldError {
  message: string
  path: string
}

export interface ApiErrorResponse {
  message: ApiFieldError[] | string
  statusCode: number
  error?: string
}
