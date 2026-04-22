'use client'

import * as React from 'react'

import { AdminHeader } from '@/app/admin/_components/admin-header'
import { AdminSidebar } from '@/app/admin/_components/admin-sidebar'

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <AdminHeader />
      <div className='flex flex-1 flex-col md:flex-row'>
        <AdminSidebar variant='desktop' />
        <div className='flex flex-1 flex-col min-w-0 bg-muted/30'>
          <AdminSidebar variant='mobile' />
          <main className='flex-1 p-4 md:p-8 lg:p-10 w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500'>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
