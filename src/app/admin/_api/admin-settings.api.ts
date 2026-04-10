import http from '@/utils/http'

export type SystemSetting = {
  key: string
  value: unknown
  updatedAt: string
}

const adminSettingsApi = {
  getSettings: () => http.get<SystemSetting[]>('/admin/settings'),
  updateSetting: (key: string, value: unknown) => http.patch<SystemSetting>('/admin/settings', { key, value })
}

export default adminSettingsApi
