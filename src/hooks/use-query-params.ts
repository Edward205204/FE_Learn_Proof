'use client'

import { useCallback, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { z } from 'zod'

/**
 * Hook đồng bộ query params với URL thông qua Zod schema.
 * Khi set giá trị bằng default sẽ xóa param khỏi URL để giữ URL sạch.
 */
export function useQueryParams<T extends z.ZodObject<z.ZodRawShape>>(schema: T) {
  type Output = z.infer<T>

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const queryParams = useMemo(() => {
    const raw: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      raw[key] = value
    })
    return schema.parse(raw) as Output
  }, [searchParams, schema])

  const setQueryParams = useCallback(
    (updates: Partial<Output>) => {
      const params = new URLSearchParams(searchParams.toString())
      const defaults = schema.parse({}) as Output

      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === null || value === defaults[key]) {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      }

      const qs = params.toString()
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false })
    },
    [searchParams, pathname, router, schema]
  )

  return [queryParams, setQueryParams] as const
}
