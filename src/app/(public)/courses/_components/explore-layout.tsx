'use client'

import { useState } from 'react'
import FilterToolbar from './filter-toolbar'
import FilterSidebar from './filter-sidebar'
import { CategoryWithCount } from '@/schemas/course.schema'

interface ExploreLayoutProps {
  categories: CategoryWithCount[]
  children: React.ReactNode
}

export default function ExploreLayout({ categories, children }: ExploreLayoutProps) {
  const [showSidebar, setShowSidebar] = useState(true)

  return (
    <div className='max-w-[1400px] mx-auto px-6 py-8'>
      {/* Top Toolbar */}
      <FilterToolbar 
        showSidebar={showSidebar} 
        onToggleSidebar={() => setShowSidebar(!showSidebar)} 
      />

      <div className='flex flex-col md:flex-row gap-10'>
        {/* Sidebar */}
        {showSidebar && (
          <aside className='w-full md:w-[280px] flex-shrink-0 animate-in fade-in slide-in-from-left-4 duration-300'>
            <FilterSidebar categories={categories} />
          </aside>
        )}

        {/* Results Area */}
        <section className='flex-1 min-w-0 transition-all duration-300'>
          {children}
        </section>
      </div>
    </div>
  )
}
