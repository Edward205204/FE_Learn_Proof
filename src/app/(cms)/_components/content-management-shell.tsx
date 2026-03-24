'use client'

import * as React from 'react'

import { ContentManagementHeader } from './content-management-header'
import { ContentManagementSidebar } from './content-management-sidebar'

export function ContentManagementShell({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <ContentManagementHeader />
      <div className='flex flex-1 flex-col md:flex-row'>
        <ContentManagementSidebar variant='desktop' />
        <div className='flex flex-1 flex-col min-w-0 bg-muted/50'>
          <ContentManagementSidebar variant='mobile' />
          <main className='flex-1 p-4 md:p-8 lg:p-12 w-full max-w-6xl mx-auto'>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
