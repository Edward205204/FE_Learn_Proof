'use client'

import { useRouter } from 'next/navigation'
import { OnboardingHeader } from '../../_components/onboarding-header'
import { FieldCard } from '../../_components/field-card'
import { Code2, Smartphone, Cpu, ShieldCheck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOnboardingData } from '../layout'
import { PATH } from '../../../../constants/path'

const FIELDS = [
  {
    id: 'web',
    title: 'Phát triển Web',
    subtitle: 'Frontend, Backend & Fullstack',
    image: '/images/onboarding/web_dev.png',
    icon: <Code2 className='w-5 h-5' />
  },
  {
    id: 'mobile',
    title: 'Ứng dụng di động',
    subtitle: 'iOS, Android & Flutter',
    image: '/images/onboarding/mobile_dev.png',
    icon: <Smartphone className='w-5 h-5' />
  },
  {
    id: 'ai',
    title: 'Trí tuệ nhân tạo (AI)',
    subtitle: 'Machine Learning & Data Science',
    image: '/images/onboarding/ai_field.png',
    icon: <Cpu className='w-5 h-5' />
  },
  {
    id: 'blockchain',
    title: 'Blockchain & Security',
    subtitle: 'Web3, Security & Cryptography',
    image: '/images/onboarding/blockchain_field.png',
    icon: <ShieldCheck className='w-5 h-5' />
  }
]

export default function OnboardingStep1() {
  const router = useRouter()
  const { data, setData } = useOnboardingData()

  const handleSelectField = (field: string) => {
    setData((prev) => ({ ...prev, field }))
  }

  const goNext = () => {
    router.push(`${PATH.ONBOARDING}/step2`)
  }

  return (
    <>
      <OnboardingHeader step={1} totalSteps={6} progress={(1 / 6) * 100} />
      <main className='container mx-auto px-4 pb-20 pt-4'>
        <div className='animate-in fade-in slide-in-from-bottom-4 duration-700'>
          <div className='flex flex-col items-center'>
            <div className='text-center mb-10 mt-8'>
              <h2 className='text-3xl font-extrabold text-foreground mb-3'>Lĩnh vực bạn muốn chinh phục là gì?</h2>
              <p className='text-muted-foreground'>
                Chọn một lĩnh vực để bắt đầu lộ trình học tập cá nhân hóa của bạn.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-12'>
              {FIELDS.map((field) => (
                <FieldCard key={field.id} {...field} selected={data.field === field.id} onSelect={handleSelectField} />
              ))}
            </div>

            <Button
              onClick={goNext}
              disabled={!data.field}
              size='lg'
              className='rounded-full px-12 py-7 text-lg font-bold shadow-xl shadow-primary/25 hover:scale-105 transition-transform'
            >
              Tiếp tục <ArrowRight className='ml-2 w-5 h-5' />
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}
