import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-react'

interface Props {
  onGenerate: () => void
  isGenerating: boolean
  disabled?: boolean
}

export function GenerateButton({ onGenerate, isGenerating, disabled }: Props) {
  return (
    <Button
      onClick={onGenerate}
      disabled={disabled || isGenerating}
      className='bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-none shadow-lg shadow-indigo-500/20'
    >
      {isGenerating ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Đang tạo Quiz...
        </>
      ) : (
        <>
          <Sparkles className='mr-2 h-4 w-4' />
          Sinh Quiz bằng AI
        </>
      )}
    </Button>
  )
}
