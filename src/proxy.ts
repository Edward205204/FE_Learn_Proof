import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PATH } from './constants/path'
import { Role } from './@types/user'

// Redirect về / nếu đã đăng nhập
const AUTH_ONLY_PATHS = [PATH.LOGIN, PATH.REGISTER, PATH.FORGOT_PASSWORD, PATH.RESET_PASSWORD]

// Chỉ CONTENT_MANAGER và ADMIN mới vào được
const CONTENT_MANAGER_PATHS = ['/abc']

// Chỉ ADMIN mới vào được
const ADMIN_PATHS = [PATH.ADMIN]

// Yêu cầu đăng nhập, mọi role đều vào được
const PROTECTED_PATHS = [PATH.PROFILE, PATH.MY_COURSES]

function matchesPath(pathname: string, paths: string[]): boolean {
  return paths.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const role = request.cookies.get('role')?.value
  const isLoggedIn = Boolean(role)

  // ── ADMIN LOCK: Admin chỉ được ở khu vực /admin ──
  // Nếu là Admin đã đăng nhập và đang truy cập trang KHÔNG phải /admin → redirect về /admin
  if (isLoggedIn && role === Role.ADMIN) {
    // Cho phép admin ở trang login/register (để logout/re-login)
    if (matchesPath(pathname, AUTH_ONLY_PATHS)) {
      // Admin đã login mà vào trang auth → redirect về /admin
      return NextResponse.redirect(new URL(PATH.ADMIN, request.url))
    }
    // Admin ở khu vực /admin → cho phép
    if (matchesPath(pathname, ADMIN_PATHS)) {
      return NextResponse.next()
    }
    // Admin ở bất kỳ trang nào khác → redirect về /admin
    return NextResponse.redirect(new URL(PATH.ADMIN, request.url))
  }

  // ── Các role khác (LEARNER, CONTENT_MANAGER) ──

  // Auth-only: đã login thì về trang chủ
  if (matchesPath(pathname, AUTH_ONLY_PATHS)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(PATH.HOME, request.url))
    }
    return NextResponse.next()
  }

  // Content management: chỉ CONTENT_MANAGER
  if (matchesPath(pathname, CONTENT_MANAGER_PATHS)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(PATH.LOGIN, request.url))
    }
    if (role !== Role.CONTENT_MANAGER) {
      return NextResponse.redirect(new URL(PATH.HOME, request.url))
    }
    return NextResponse.next()
  }

  // Admin area: không phải ADMIN thì không vào được
  if (matchesPath(pathname, ADMIN_PATHS)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(PATH.LOGIN, request.url))
    }
    // Non-admin users → redirect home
    return NextResponse.redirect(new URL(PATH.HOME, request.url))
  }

  // Protected: cần đăng nhập, mọi role
  if (matchesPath(pathname, PROTECTED_PATHS)) {
    if (!isLoggedIn) {
      const loginUrl = new URL(PATH.LOGIN, request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)']
}
