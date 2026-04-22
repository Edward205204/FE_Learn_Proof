import type { Metadata } from 'next'
import { AdminShell } from '@/app/admin/_components/admin-shell'

export const metadata: Metadata = {
  title: 'Admin Control Center | LearnProof',
  description: 'Hệ thống quản trị tối cao của LearnProof'
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
