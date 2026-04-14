import type { Metadata } from 'next'

import { ContentManagementShell } from './_components/content-management-shell'

export const metadata: Metadata = {
  title: 'Content Management'
}

export default function ContentManagementLayout({ children }: { children: React.ReactNode }) {
  return <ContentManagementShell>{children}</ContentManagementShell>
}
