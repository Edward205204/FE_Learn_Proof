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
    <div className='max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <CourseStepHeader backLabel={backLabel} title={title} description={description} onBack={onBack} />
      <CourseStepper currentStep={currentStep} />
      {useCard ? (
        <Card className='p-6 md:p-10 border border-border/50 shadow-sm rounded-2xl bg-card'>{children}</Card>
      ) : (
        children
      )}
    </div>
  )
}
