'use client'

import { useFieldArray, useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Lock, Play, Eye, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { independentQuizSchema, IndependentQuizValues } from '../../_utils/zod'

interface QuizMeta {
    title: string
    courseName: string
}

const MOCK_META: QuizMeta = {
    title: 'Professional Business Practices - Final (PB12-T2)',
    courseName: 'Khoá học mẫu'
}

export default function IndependentQuizEditor() {
    const [meta] = useState<QuizMeta>(MOCK_META)

    const form = useForm<IndependentQuizValues>({
        resolver: zodResolver(independentQuizSchema),
        defaultValues: {
            title: meta.title,
            shortDescription: '',
            description: '',
            passingScore: 80,
            issueCertificate: true,
            unlockNextCourse: false,
            questions: [{ questionText: '', type: 'multiple_choice', answers: [] }]
        }
    })

    const { fields, append } = useFieldArray({
        control: form.control,
        name: 'questions'
    })

    const onSubmit = (data: IndependentQuizValues) => {
        console.log('Publish:', data)
    }

    return (
        <div className='flex min-h-screen bg-background'>
            {/* Sidebar — giống quiz1 */}
            <aside className='w-64 border-r bg-sidebar p-6'>
                <h2 className='text-lg font-bold text-primary mb-6'>Quiz Builder</h2>
                <nav className='space-y-2'>
                    <Button variant='ghost' className='w-full justify-start'>
                        <Lock className='mr-2 h-4 w-4' /> Course Content
                    </Button>
                    <Button variant='secondary' className='w-full justify-start text-primary'>
                        <Play className='mr-2 h-4 w-4' /> Quiz Editor
                    </Button>
                </nav>

                <div className='mt-auto pt-10'>
                    <Card className='bg-muted/50 border-none'>
                        <CardContent className='p-4 text-xs space-y-2'>
                            <p className='font-bold flex items-center'>
                                <Lock className='h-3 w-3 mr-1' /> EDITOR INFO
                            </p>
                            <p className='text-muted-foreground'>Independent quiz (no lesson link)</p>
                            <p className='text-muted-foreground'>Syncing with: {meta.title}</p>
                        </CardContent>
                    </Card>
                </div>
            </aside>

            {/* Main Content */}
            <main className='flex-1 p-8'>
                <div className='max-w-4xl mx-auto'>
                    {/* Header — giống quiz1 */}
                    <header className='flex justify-between items-center mb-8'>
                        <div>
                            <p className='text-sm text-muted-foreground uppercase tracking-wider'>
                                Courses / Unit 12 / PB12-T2 Editor
                            </p>
                            <h1 className='text-3xl font-extrabold tracking-tight'>Edit Quiz: {meta.title}</h1>
                            <p className='text-muted-foreground italic'>Inherited from: {meta.courseName}</p>
                        </div>
                        <Button variant='outline'>
                            <Eye className='mr-2 h-4 w-4' /> Preview Quiz
                        </Button>
                    </header>

                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        {/* SECTION 1: QUIZ METADATA */}
                        <Card className='border shadow-sm'>
                            <CardContent className='p-6 space-y-4'>
                                <div className='flex items-center gap-2 text-primary font-bold'>
                                    <div className='p-1 bg-primary/10 rounded text-xs'>i</div>
                                    Quiz Metadata
                                </div>
                                <div className='space-y-4'>
                                    <div>
                                        <label className='text-xs font-bold uppercase text-muted-foreground mb-1 block'>
                                            Quiz Title
                                        </label>
                                        <Input {...form.register('title')} className='bg-muted/30' />
                                    </div>
                                    <div>
                                        <label className='text-xs font-bold uppercase text-muted-foreground mb-1 block'>
                                            Short Description
                                        </label>
                                        <Input {...form.register('shortDescription')} className='bg-muted/30' />
                                    </div>
                                    <div>
                                        <label className='text-xs font-bold uppercase text-muted-foreground mb-1 block'>
                                            Long Description (AI Context)
                                        </label>
                                        <Textarea {...form.register('description')} className='bg-muted/30 min-h-[100px]' />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* SECTION 2: PASSING CRITERIA */}
                        <Card className='border shadow-sm'>
                            <CardContent className='p-6'>
                                <div className='flex items-center gap-2 text-primary font-bold mb-4'>
                                    <div className='p-1 bg-primary/10 rounded text-xs'>⚙️</div>
                                    Passing Criteria
                                </div>
                                <div className='flex gap-8 items-end'>
                                    <div className='w-32'>
                                        <label className='text-xs font-bold uppercase text-muted-foreground mb-1 block'>
                                            Required Score (%)
                                        </label>
                                        <div className='flex items-center gap-2'>
                                            <Input
                                                type='number'
                                                {...form.register('passingScore', { valueAsNumber: true })}
                                                className='text-center'
                                            />
                                            <span className='font-bold'>%</span>
                                        </div>
                                    </div>

                                    <div className='flex-1 grid grid-cols-2 gap-4'>
                                        <div className='flex items-center space-x-2 border rounded-md p-3 bg-muted/20'>
                                            <Controller
                                                control={form.control}
                                                name='issueCertificate'
                                                render={({ field }) => (
                                                    <Checkbox
                                                        id='cert'
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                )}
                                            />
                                            <label htmlFor='cert' className='text-sm font-medium leading-none cursor-pointer'>
                                                Issue Certificate
                                            </label>
                                        </div>

                                        <div className='flex items-center space-x-2 border rounded-md p-3 bg-muted/20'>
                                            <Controller
                                                control={form.control}
                                                name='unlockNextCourse'
                                                render={({ field }) => (
                                                    <Checkbox
                                                        id='unlock'
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                )}
                                            />
                                            <label htmlFor='unlock' className='text-sm font-medium leading-none cursor-pointer'>
                                                Unlock Next Course
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* SECTION 3: QUESTION BANK */}
                        <div className='space-y-4'>
                            <div className='flex justify-between items-center'>
                                <h2 className='text-xl font-bold'>Question Bank ({fields.length})</h2>
                            </div>

                            {fields.map((field, index) => (
                                <Card
                                    key={field.id}
                                    className='relative overflow-hidden border-2 focus-within:border-primary transition-all'
                                >
                                    <div className='absolute left-0 top-0 bottom-0 w-1 bg-primary' />
                                    <CardContent className='p-6'>
                                        <div className='flex justify-between items-start mb-4'>
                                            <span className='bg-primary text-primary-foreground h-8 w-8 rounded-md flex items-center justify-center font-bold'>
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <label className='text-xs font-bold uppercase text-muted-foreground mb-1 block'>
                                                Question Text
                                            </label>
                                            <Input
                                                {...form.register(`questions.${index}.questionText`)}
                                                placeholder='Nhập câu hỏi tại đây...'
                                                className='text-lg py-6'
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <Button
                                type='button'
                                variant='outline'
                                className='w-full py-10 border-dashed border-2 hover:bg-accent/50'
                                onClick={() =>
                                    append({ questionText: '', type: 'multiple_choice', answers: [{ text: '', isCorrect: false }] })
                                }
                            >
                                <Plus className='mr-2 h-5 w-5' /> Add New Question
                            </Button>
                        </div>

                        {/* STICKY FOOTER — giống quiz1 */}
                        <div className='sticky bottom-6 bg-card border p-4 rounded-xl shadow-lg flex justify-between items-center mt-10'>
                            <div>
                                <p className='font-bold'>Finish Editing</p>
                                <p className='text-sm text-muted-foreground'>
                                    Make sure all questions have at least one correct answer marked.
                                </p>
                            </div>
                            <div className='flex gap-3'>
                                <Button variant='secondary' type='button'>
                                    Discard Changes
                                </Button>
                                <Button type='submit'>Publish Quiz</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}