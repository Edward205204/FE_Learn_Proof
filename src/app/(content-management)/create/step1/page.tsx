'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, CloudUpload, Sparkles, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createCourseSchema, CreateCourseValues } from '../../_utils/zod'

export default function CreateCourseBasicInfo() {
  const form = useForm<CreateCourseValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: '',
      category: '',
      difficulty: 'Beginner',
      shortDescription: '', // Phải khớp với schema ở trên
      description: '', // AI Context
      thumbnail: ''
    }
  })

  const onSubmit = async (data: CreateCourseValues) => {
    try {
      console.log('Form Data:', data)
      toast.success('Basic info saved!')
      // Chuyển sang step tiếp theo tại đây
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const descriptionLength = form.watch('description')?.length || 0

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-8'>
      {/* Header */}
      <div className='space-y-2'>
        <button className='flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors'>
          <ChevronLeft className='w-4 h-4 mr-1' />
          Back to Courses
        </button>
        <h1 className='text-3xl font-bold tracking-tight'>Create Course</h1>
        <p className='text-muted-foreground'>Start by providing the fundamental details of your new course.</p>
      </div>

      {/* Stepper progress */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between text-sm font-medium'>
          <span className='uppercase text-muted-foreground tracking-wider'>Progress</span>
          <span>Step 1 of 3</span>
        </div>
        <div className='grid grid-cols-3 gap-2 p-1 bg-secondary/50 rounded-xl border'>
          <div className='flex items-center justify-center py-2.5 px-4 bg-primary text-primary-foreground rounded-lg shadow-sm font-medium transition-all'>
            <span className='mr-2 flex h-5 w-5 items-center justify-center rounded-full border border-primary-foreground/30 text-xs'>
              1
            </span>
            1. Basic Info
          </div>
          <div className='flex items-center justify-center py-2.5 px-4 text-muted-foreground font-medium'>
            2. Chapters
          </div>
          <div className='flex items-center justify-center py-2.5 px-4 text-muted-foreground font-medium'>
            3. Pricing
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card className='p-8 border-none shadow-sm ring-1 ring-border/50'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            {/* Title */}
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-semibold'>
                    Course Title <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='e.g. Masterclass in Advanced Machine Learning' {...field} className='h-12' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category & Difficulty */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='h-12'>
                          <SelectValue placeholder='Select a category' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='development'>Development</SelectItem>
                        <SelectItem value='business'>Business</SelectItem>
                        <SelectItem value='design'>Design</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='difficulty'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>Difficulty Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='h-12'>
                          <SelectValue placeholder='Beginner' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Beginner'>Beginner</SelectItem>
                        <SelectItem value='Intermediate'>Intermediate</SelectItem>
                        <SelectItem value='Advanced'>Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Short Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <div className='flex justify-between items-end'>
                    <FormLabel className='font-semibold'>Short Description</FormLabel>
                    <span className='text-[10px] uppercase font-bold text-muted-foreground tracking-tighter'>
                      {descriptionLength}/250
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder='Provide a compelling brief overview of what students will learn...'
                      className='min-h-[120px] resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className='text-xs italic'>
                    This description will appear on course cards in the marketplace.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* AI Assistant Section */}
            <div className='bg-blue-50/50 border border-blue-100 rounded-xl p-6 space-y-4'>
              <div className='flex items-center gap-2 text-blue-700 font-semibold'>
                <span className='text-sm'>Full Context for AI Assistant</span>
                <Sparkles className='w-4 h-4 text-blue-500 fill-blue-500/20' />
              </div>
              <p className='text-sm text-blue-600/80 leading-relaxed'>
                Paste your detailed syllabus, notes, or raw ideas here. Our AI will use this in the next steps to
                auto-generate a structured curriculum, chapter descriptions, and quiz questions.
              </p>
              <FormField
                control={form.control}
                name='description' // Sử dụng cùng field để lưu context, hoặc bạn có thể tạo một field riêng nếu muốn
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder='e.g. Week 1: Introduction to concepts. Week 2: Deep dive into mechanics... Include key takeaways and learning objectives.'
                        className='min-h-[150px] bg-white border-blue-100 focus-visible:ring-blue-200'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Thumbnail Upload */}
            <div className='space-y-3'>
              <label className='text-sm font-semibold'>Course Thumbnail</label>
              <div className='border-2 border-dashed border-muted-foreground/20 rounded-xl p-10 flex flex-col items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer group'>
                <div className='h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                  <CloudUpload className='w-6 h-6 text-blue-600' />
                </div>
                <p className='text-sm font-medium'>
                  <span className='text-blue-600 hover:underline'>Click to upload</span> or drag and drop
                </p>
                <p className='text-xs text-muted-foreground mt-1'>Recommended size: 1280x720px. Max 5MB (JPG, PNG).</p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className='pt-6 border-t flex items-center justify-between'>
              <Button variant='ghost' type='button' className='font-semibold text-muted-foreground'>
                Cancel
              </Button>
              <div className='flex items-center gap-3'>
                <Button variant='outline' type='button' className='font-semibold'>
                  Save as Draft
                </Button>
                <Button type='submit' className='px-6 font-semibold bg-blue-600 hover:bg-blue-700'>
                  Next: Chapters
                  <ArrowRight className='w-4 h-4 ml-2' />
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}
