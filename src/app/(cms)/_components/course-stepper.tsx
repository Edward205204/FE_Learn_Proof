interface Step {
  label: string
}

const STEPS: Step[] = [
  { label: 'Thông tin cơ bản' },
  { label: 'Chương học' },
  { label: 'Giá & Xuất bản' }
]

interface CourseStepperProps {
  currentStep: 1 | 2 | 3
}

export function CourseStepper({ currentStep }: CourseStepperProps) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between text-sm font-medium'>
        <span className='uppercase text-muted-foreground tracking-wider'>Tiến trình</span>
        <span>
          Bước {currentStep} / {STEPS.length}
        </span>
      </div>
      <div className='grid grid-cols-3 gap-2 p-1 bg-secondary/50 rounded-xl border'>
        {STEPS.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isDone = stepNumber < currentStep

          return (
            <div
              key={stepNumber}
              className={`flex items-center justify-center py-2.5 px-4 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : isDone
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground'
              }`}
            >
              <span
                className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full text-xs border ${
                  isActive
                    ? 'border-primary-foreground/30'
                    : isDone
                      ? 'border-primary/40'
                      : 'border-muted-foreground/30'
                }`}
              >
                {stepNumber}
              </span>
              {step.label}
            </div>
          )
        })}
      </div>
    </div>
  )
}
