import { config } from '@/constants/config'
import http from '@/utils/http'

// hooks/useGoogleLogin.ts
export const useGoogleLogin = async () => {
  const res = await http.get(config.GOOGLE_LOGIN_URL)
  const url = res.data
  window.location.href = url
}
