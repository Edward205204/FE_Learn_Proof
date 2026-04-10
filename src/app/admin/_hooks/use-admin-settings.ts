import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import adminSettingsApi from '../_api/admin-settings.api'

export function useAdminSettings() {
  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const res = await adminSettingsApi.getSettings()
      return res.data
    }
  })
}

export function useUpdateSettingMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: unknown }) => adminSettingsApi.updateSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] })
      toast.success('Cập nhật cấu hình thành công!')
    },
    onError: () => {
      toast.error('Lỗi khi cập nhật cấu hình.')
    }
  })
}
