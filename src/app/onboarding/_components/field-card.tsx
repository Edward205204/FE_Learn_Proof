'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import Image from 'next/image'
import { ReactNode } from 'react'

interface FieldCardProps {
  id: string
  title: string
  subtitle: string
  image: string
  icon: ReactNode
  selected: boolean
  onSelect: (id: string) => void
}

export function FieldCard({ id, title, subtitle, image, icon, selected, onSelect }: FieldCardProps) {
  return (
    <div
      onClick={() => onSelect(id)}
      className={cn(
        'group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-300 border-2',
        selected ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'border-transparent hover:border-primary/30'
      )}
    >
      <div className='aspect-[4/3] relative'>
        <Image
          fill
          src={image}
          alt={title}
          className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />

        {selected && (
          <div className='absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white shadow-lg animate-in zoom-in duration-300'>
            <Check className='w-4 h-4' />
          </div>
        )}

        <div className='absolute bottom-4 left-4 right-4'>
          <div className='w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2'>
            {icon}
          </div>
          <h3 className='text-lg font-bold text-white mb-0.5'>{title}</h3>
          <p className='text-xs text-white/70 line-clamp-1'>{subtitle}</p>
        </div>
      </div>
    </div>
  )
}
