'use client'

import { useRouter } from 'next/navigation'
import { Sprout, TreeDeciduous, TreePine, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OnboardingHeader } from '../../_components/onboarding-header'
import { SelectionOption } from '../../_components/selection-option'
import { useOnboardingData } from '../layout'
import { PATH } from '../../../../constants/path'

const LEVELS = [
  {
    id: 'beginner',
    title: 'Mới bắt đầu',
    description: 'Bắt đầu hành trình với những kiến thức mầm non cơ bản nhất',
    icon: <Sprout className='w-6 h-6' />,
    variant: 'green' as const
  },
  {
    id: 'intermediate',
    title: 'Đã có nền tảng',
    description: 'Củng cố và vươn cao kiến thức sẵn có như cây con',
    icon: <TreeDeciduous className='w-6 h-6' />,
    variant: 'blue' as const
  },
  {
    id: 'advanced',
    title: 'Nâng cao',
    description: 'Trở thành cây cổ thụ vững chãi with kiến thức chuyên sâu',
    icon: <TreePine className='w-6 h-6' />,
    variant: 'yellow' as const
  }
]

export default function OnboardingStep3() {
  const router = useRouter()
  const { data, setData } = useOnboardingData()

  const handleSelectLevel = (level: string) => {
    setData((prev) => ({ ...prev, level }))
  }

  const goNext = () => {
    router.push(`${PATH.ONBOARDING}/step4`)
  }

  const goBack = () => {
    router.push(`${PATH.ONBOARDING}/step2`)
  }

  return (
    <>
      <OnboardingHeader step={3} totalSteps={6} progress={(3 / 6) * 100} />
      <main className='container mx-auto px-4 pb-20 pt-4'>
        <div className='animate-in fade-in slide-in-from-bottom-4 duration-700'>
          <div className='flex flex-col items-center w-full max-w-2xl mx-auto'>
            <div className='text-center mb-10 mt-8'>
              <h2 className='text-3xl font-extrabold text-foreground mb-3'>Trình độ hiện tại của bạn?</h2>
              <p className='text-muted-foreground'>
                Chọn mức độ phù hợp nhất để chúng tôi cá nhân hóa lộ trình học của bạn.
              </p>
            </div>

            <div className='w-full mb-12'>
              {LEVELS.map((level) => (
                <SelectionOption
                  key={level.id}
                  {...level}
                  selected={data.level === level.id}
                  onSelect={handleSelectLevel}
                />
              ))}
            </div>

            <div className='flex flex-col items-center w-full gap-6'>
              <Button
                onClick={goNext}
                disabled={!data.level}
                size='lg'
                className='w-full rounded-2xl py-8 text-lg font-bold shadow-xl shadow-primary/25'
              >
                Tiếp tục <ArrowRight className='ml-2 w-5 h-5' />
              </Button>
              <Button variant='ghost' onClick={goBack} className='text-muted-foreground hover:text-foreground'>
                Quay lại bước trước
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
