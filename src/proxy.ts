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

  // Auth-only: đã login thì về trang chủ
  if (matchesPath(pathname, AUTH_ONLY_PATHS)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(PATH.HOME, request.url))
    }
    return NextResponse.next()
  }

  // Content management: chỉ CONTENT_MANAGER và ADMIN
  if (matchesPath(pathname, CONTENT_MANAGER_PATHS)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(PATH.LOGIN, request.url))
    }
    if (role !== Role.CONTENT_MANAGER && role !== Role.ADMIN) {
      return NextResponse.redirect(new URL(PATH.HOME, request.url))
    }
    return NextResponse.next()
  }

  // Admin: chỉ ADMIN
  if (matchesPath(pathname, ADMIN_PATHS)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(PATH.LOGIN, request.url))
    }
    if (role !== Role.ADMIN) {
      return NextResponse.redirect(new URL(PATH.HOME, request.url))
    }
    return NextResponse.next()
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
