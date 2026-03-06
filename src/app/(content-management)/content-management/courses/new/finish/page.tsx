'use client'

import React from 'react'
import Link from 'next/link'
import { Check, LayoutGrid, PlusCircle, Video, FileQuestion, Settings, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function CourseSuccessPage() {
  return (
    <div className='min-h-screen bg-black flex flex-col items-center justify-center p-4'>
      {/* Header Logo (Tùy chọn) */}
      <div className='absolute top-6 left-8 flex items-center gap-2 text-white'>
        <div className='bg-primary p-1.5 rounded-md'>
          <LayoutGrid className='w-5 h-5 text-primary-foreground' />
        </div>
      </div>

      <Card className='w-full max-w-[640px] p-12 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-500'>
        {/* Success Icon with Glow */}
        <div className='relative'>
          <div className='absolute inset-0 bg-green-500/20 blur-2xl rounded-full' />
          <div className='relative h-20 w-20 rounded-full bg-green-100 flex items-center justify-center border-4 border-white shadow-sm'>
            <Check className='w-10 h-10 text-green-600 stroke-[3px]' />
          </div>
        </div>

        {/* Text Content */}
        <div className='space-y-3'>
          <h1 className='text-4xl font-extrabold tracking-tight text-foreground'>Course Created Successfully!</h1>
          <p className='text-muted-foreground text-lg max-w-[480px] mx-auto leading-relaxed'>
            Fantastic work! Your new course is ready. You can now start adding modules, lessons, and managing student
            enrollments.
          </p>
        </div>

        {/* Primary Actions */}
        <div className='flex flex-col sm:flex-row gap-4 w-full justify-center pt-4'>
          <Button
            asChild
            size='lg'
            className='h-14 px-8 rounded-full font-bold text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]'
          >
            <Link href='/courses'>
              <LayoutGrid className='w-5 h-5 mr-2' />
              Go to Course Management
            </Link>
          </Button>

          <Button
            asChild
            variant='secondary'
            size='lg'
            className='h-14 px-8 rounded-full font-bold text-base bg-secondary/80 hover:bg-secondary'
          >
            <Link href='/courses/create'>
              <PlusCircle className='w-5 h-5 mr-2' />
              Create Another Course
            </Link>
          </Button>
        </div>

        <div className='w-full pt-8 border-t border-border/50'>
          <p className='text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6'>
            Quick actions for your new course
          </p>

          {/* Quick Action Icons */}
          {/* <div className='grid grid-cols-3 gap-8'>
            <QuickActionLink icon={<Video className='w-6 h-6' />} label='Add Video' href='/courses/add-video' />
            <QuickActionLink icon={<FileQuestion className='w-6 h-6' />} label='Create Quiz' href='/courses/add-quiz' />
            <QuickActionLink icon={<Settings className='w-6 h-6' />} label='Settings' href='/courses/settings' />
          </div> */}
        </div>
      </Card>
    </div>
  )
}

function QuickActionLink({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <Link href={href} className='flex flex-col items-center gap-3 group transition-all'>
      <div className='h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground shadow-sm'>
        {icon}
      </div>
      <span className='text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors'>
        {label}
      </span>
    </Link>
  )
}
