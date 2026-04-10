'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { Role } from '@/@types/user'
import { PATH } from '@/constants/path'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user)
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // If we're loaded and we don't have a user or user is not Admin, redirect
    if (!user) {
      router.replace(PATH.LOGIN)
    } else if (user.role !== Role.ADMIN) {
      router.replace(PATH.HOME) // Redirect to home if not admin
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsReady(true)
    }
  }, [user, router])

  if (!isReady) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
      </div>
    )
  }

  return <>{children}</>
}
