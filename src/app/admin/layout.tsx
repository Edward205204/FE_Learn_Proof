import type { Metadata } from 'next'

import { AdminShell } from './_components/admin-shell'
import { AdminGuard } from './_components/admin-guard'

export const metadata: Metadata = {
  title: 'Admin Dashboard'
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  )
}
