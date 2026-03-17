'use client'

import type { ReactNode } from 'react'

import { Card } from '@/components/ui/card'
import { CourseStepper } from './course-stepper'
import { CourseStepHeader } from './course-step-header'

type Props = {
  currentStep: 1 | 2 | 3
  backLabel: string
  title: string
  description: string
  onBack: () => void
  children: ReactNode
  useCard?: boolean
}

export function CoursePageShell({
  currentStep,
  backLabel,
  title,
  description,
  onBack,
  children,
  useCard = true
}: Props) {
  return (
    <div className='max-w-5xl mx-auto p-6 space-y-8'>
      <CourseStepHeader backLabel={backLabel} title={title} description={description} onBack={onBack} />
      <CourseStepper currentStep={currentStep} />
      {useCard ? <Card className='p-8 border-none shadow-sm ring-1 ring-border/50'>{children}</Card> : children}
    </div>
  )
}
