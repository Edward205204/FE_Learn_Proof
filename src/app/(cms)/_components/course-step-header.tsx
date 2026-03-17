'use client'

import { ChevronLeft } from 'lucide-react'

type Props = {
  backLabel: string
  title: string
  description: string
  onBack: () => void
}

export function CourseStepHeader({ backLabel, title, description, onBack }: Props) {
  return (
    <div className='space-y-2'>
      <button
        type='button'
        onClick={onBack}
        className='flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors'
      >
        <ChevronLeft className='w-4 h-4 mr-1' />
        {backLabel}
      </button>
      <h1 className='text-3xl font-bold tracking-tight'>{title}</h1>
      <p className='text-muted-foreground'>{description}</p>
    </div>
  )
}

