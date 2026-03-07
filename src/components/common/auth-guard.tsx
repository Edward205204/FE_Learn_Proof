// 'use client'
// import { useEffect } from 'react'
// import { usePathname, useRouter } from 'next/navigation'
// import { useAuthStore } from '@/store/auth.store'
// import { clearRoleCookie, getRoleCookie, setRoleCookie } from '@/utils/cookie'
// import { PATH } from '@/constants/path'

// const AUTH_ONLY_PATHS = [PATH.LOGIN, PATH.REGISTER, PATH.FORGOT_PASSWORD, PATH.RESET_PASSWORD]

// /**
//  * AuthGuard là fallback client-side khi proxy bị bypass bởi Next.js router cache.
//  * Chạy lại mỗi khi pathname thay đổi
//  *
//  * Ba case cần xử lý:
//  * 1. Cookie có role nhưng Zustand rỗng → localStorage bị xóa ngoài → force logout
//  * 2. Zustand có user nhưng cookie mất → cookie hết hạn → re-sync cookie + redirect nếu cần
//  * 3. Đã đăng nhập nhưng đang ở auth-only path → redirect về HOME (proxy bị bypass)
//  */
// export function AuthGuard({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname()
//   const router = useRouter()

//   useEffect(() => {
//     const { user, accessToken, clearAuth } = useAuthStore.getState()
//     const roleCookie = getRoleCookie()

//     if (roleCookie && (!user || !accessToken)) {
//       // Cookie nói đã login nhưng localStorage không còn data → force logout
//       clearAuth()
//       clearRoleCookie()
//       window.location.href = PATH.LOGIN
//       return
//     }

//     if (!roleCookie && user) {
//       // Zustand có data nhưng cookie mất (hết hạn 30 ngày) → re-sync
//       setRoleCookie(user.role)
//     }

//     // Fallback: proxy bị bypass bởi router cache → guard tự redirect
//     const isLoggedIn = Boolean(user && accessToken)
//     const isAuthOnlyPath = AUTH_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
//     if (isLoggedIn && isAuthOnlyPath) {
//       router.replace(PATH.HOME)
//     }
//   }, [pathname, router])

//   return <>{children}</>
// }
