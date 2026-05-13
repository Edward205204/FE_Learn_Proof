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
    <div className='space-y-1.5 mb-2'>
      <button
        type='button'
        onClick={onBack}
        className='flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:-translate-x-1 duration-200 w-fit mb-4'
      >
        <ChevronLeft className='w-4 h-4 mr-0.5' />
        {backLabel}
      </button>
      <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground'>{title}</h1>
      <p className='text-muted-foreground text-sm sm:text-base'>{description}</p>
    </div>
  )
}
