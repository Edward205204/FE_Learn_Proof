'use client'

import { useState, useCallback } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import { PATH } from '@/constants/path'

export const useHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const router = useRouter()

  const isLoggedIn = !!user

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
  }, [])

  const handleLogout = useCallback(() => {
    clearAuth()
    setIsMenuOpen(false)
    // Redirect to home or login page after logout
    router.push(PATH.HOME)
  }, [clearAuth, router])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  return {
    user,
    isLoggedIn,
    isMenuOpen,
    toggleMenu,
    handleLogout,
    closeMenu
  }
}
