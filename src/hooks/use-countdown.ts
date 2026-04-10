import { useState, useEffect, useCallback } from 'react'

export const useCountdown = (initialTime: number = 60) => {
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const start = useCallback(() => setCountdown(initialTime), [initialTime])

  return { countdown, start }
}
