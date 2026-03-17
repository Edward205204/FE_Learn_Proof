'use client'

import * as React from 'react'

import { ContentManagementHeader } from './content-management-header'
import { ContentManagementSidebar } from './content-management-sidebar'

export function ContentManagementShell({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-background'>
      <ContentManagementHeader />
      <ContentManagementSidebar variant='mobile' />

      <div className='mx-auto max-w-7xl md:flex'>
        <ContentManagementSidebar />
        <main className='flex-1 min-w-0 p-4 md:p-6'>{children}</main>
      </div>
    </div>
  )
}
