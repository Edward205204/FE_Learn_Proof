import http from '@/utils/http'

export type AdminAuditLogItem = {
  id: string
  action: string
  entity: string
  entityId: string
  details: any | null
  createdAt: string
  admin: {
    id: string
    fullName: string
    email: string
  }
}

export type AdminGetAuditLogsRes = {
  items: AdminAuditLogItem[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type GetAuditLogsParams = {
  page?: number
  limit?: number
  adminId?: string
  action?: string
  entity?: string
}

const adminAuditLogsApi = {
  getAuditLogs: (params: GetAuditLogsParams) => http.get<AdminGetAuditLogsRes>('/admin/audit-logs', { params })
}

export default adminAuditLogsApi
