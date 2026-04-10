'use client'

import * as React from 'react'

import { AdminHeader } from './admin-header'
import { AdminSidebar } from './admin-sidebar'

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <AdminHeader />
      <div className='flex flex-1 flex-col md:flex-row'>
        <AdminSidebar variant='desktop' />
        <div className='flex flex-1 flex-col min-w-0 bg-muted/50'>
          <AdminSidebar variant='mobile' />
          <main className='flex-1 p-4 md:p-8 lg:p-12 w-full max-w-6xl mx-auto'>{children}</main>
        </div>
      </div>
    </div>
  )
}
