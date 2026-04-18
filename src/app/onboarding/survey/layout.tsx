'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface OnboardingData {
  field: string
  techs: string[]
  level: string
  time: string
}

interface OnboardingContextType {
  data: OnboardingData
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

export function useOnboardingData() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboardingData must be used within OnboardingLayout')
  return ctx
}

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>({
    field: '',
    techs: [],
    level: '',
    time: ''
  })

  return (
    <OnboardingContext.Provider value={{ data, setData }}>
      <div className='min-h-screen bg-white'>{children}</div>
    </OnboardingContext.Provider>
  )
}
