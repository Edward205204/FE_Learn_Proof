import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@/@types/user'
import { clearRoleCookie, setRoleCookie } from '@/utils/cookie'

interface AuthState {
  user: User | null
  accessToken: string
  refreshToken: string
  setAuth: (data: { user: User; accessToken: string; refreshToken: string }) => void
  updateUser: (data: Partial<User>) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: '',
      refreshToken: '',
      setAuth: ({ user, accessToken, refreshToken }) => {
        set({ user, accessToken, refreshToken })
        setRoleCookie(user.role)
      },
      updateUser: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null
        }))
      },
      clearAuth: () => {
        set({ user: null, accessToken: '', refreshToken: '' })
        clearRoleCookie()
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage
        return undefined as unknown as Storage
      })
    }
  )
)
