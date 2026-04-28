'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import authApi from './(auth)/_api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { PATH } from '@/constants/path'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
            staleTime: 60 * 1000
          }
        }
      })
  )

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const { data } = await authApi.getMaintenanceStatus()
        const user = useAuthStore.getState().user
        if (data.isMaintenance && user?.role !== 'ADMIN') {
          if (window.location.pathname !== PATH.MAINTENANCE) {
            window.location.href = PATH.MAINTENANCE
          }
        }
      } catch (err) {
        // ignore errors here, http interceptor will handle 403 anyway
      }
    }
    checkMaintenance()
  }, [])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
