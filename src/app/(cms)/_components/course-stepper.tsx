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
    <div className='space-y-4 mb-8'>
      <div className='flex items-center justify-between text-sm font-medium px-1'>
        <span className='uppercase text-muted-foreground tracking-widest text-[11px] font-bold'>Tiến trình</span>
        <span className='text-muted-foreground text-[11px] font-bold'>
          BƯỚC {currentStep} / {STEPS.length}
        </span>
      </div>
      <div className='grid grid-cols-3 gap-2 p-1.5 bg-muted/50 rounded-2xl border border-border/50'>
        {STEPS.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isDone = stepNumber < currentStep

          return (
            <div
              key={stepNumber}
              className={`flex items-center justify-center py-3 px-2 md:px-4 rounded-xl text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-background text-foreground shadow-sm ring-1 ring-border/50 font-bold'
                  : isDone
                    ? 'text-foreground/80 hover:bg-background/50 font-medium'
                    : 'text-muted-foreground font-medium'
              }`}
            >
              <span
                className={`mr-2.5 flex h-6 w-6 shrink-0 flex-col items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : isDone
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted-foreground/10 text-muted-foreground'
                }`}
              >
                {stepNumber}
              </span>
              <span className="truncate">{step.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
