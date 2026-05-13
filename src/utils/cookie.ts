const ROLE_COOKIE = 'role'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 ngày

export function setRoleCookie(role: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

export function clearRoleCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0`
}

export function getRoleCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${ROLE_COOKIE}=`))
    ?.split('=')[1]
}
