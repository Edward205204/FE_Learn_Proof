'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { PATH } from '@/constants/path'
import { Role } from '@/@types/user'

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    // Chỉ áp dụng Onboarding cho role LEARNER
    if (user && user.role === Role.LEARNER && !user.isOnboardingCompleted) {
      if (!pathname.startsWith('/onboarding') && pathname !== '/logout') {
        router.replace(`${PATH.ONBOARDING}/survey/step-1`)
      }
    }
  }, [user, pathname, router])

  // Chặn render nội dung nếu đang cần Onboarding mà lại ở trang khác
  if (user && user.role === Role.LEARNER && !user.isOnboardingCompleted && !pathname.startsWith('/onboarding') && pathname !== '/logout') {
    return null 
  }

  return <>{children}</>
}
