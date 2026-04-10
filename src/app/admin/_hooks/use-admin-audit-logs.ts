import { useQuery } from '@tanstack/react-query'
import adminAuditLogsApi, { GetAuditLogsParams } from '../_api/admin-audit-logs.api'

export function useAdminAuditLogs(params: GetAuditLogsParams) {
  return useQuery({
    queryKey: ['admin-audit-logs', params],
    queryFn: async () => {
      const res = await adminAuditLogsApi.getAuditLogs(params)
      return res.data
    }
  })
}
