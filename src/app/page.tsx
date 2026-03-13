import Header from '@/components/common/header'
import Footer from '@/components/common/footer'
import { Button } from '@/components/ui/button'
import { PlayCircle, ArrowRight, Clock, Users } from 'lucide-react'

const courses = [
  {
    title: 'Advanced Web Development',
    time: '12 weeks',
    students: '1.2k',
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80'
  },
  {
    title: 'UI/UX Design Fundamentals',
    time: '8 weeks',
    students: '850',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMAou3DykiK9310U1Ahtsd7xZgxPr4b1W6lJKZtHosmD_a2MyWhQrK5wB1z5-TZVTZs6V9rYhT0wlhQmWUIYaju06sMqOJsbHz5o1wHKS69JNWWY3ucFm9i5bQdMo-LN-NAm7XGiny7XVb3_y708GqsNd8cBHtmelHGQqpuwXoDSXrQQLxQWtEPiowDMoLFR7MESzfKVJuVj3pnf7ACSkTjYKKYttgcu_HGmhQ-TiPlL9Slw4s-Z6jV6aDy2Agr3rgmQd9U2pEmrl8'
  },
  {
    title: 'Data Science BootCamp',
    time: '16 weeks',
    students: '2.1k',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80'
  },
  {
    title: 'Digital Marketing Mastery',
    time: '6 weeks',
    students: '500',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80'
  }
]

export default function Home() {
  return (
    <div className='min-h-screen bg-[oklch(1_0_0)] dark:bg-[oklch(0.141_0.005_285.823)]'>
      <Header />
      <main className='mx-auto w-full max-w-[1200px] flex-1 font-display'>
        <section className='flex flex-col gap-10 px-6 py-12 md:py-20 lg:flex-row lg:items-center'>
          <div className='flex flex-col gap-8 lg:w-1/2'>
            <div className='flex flex-col gap-4'>
              <h1 className='text-4xl font-black leading-tight tracking-tight text-[oklch(0.141_0.005_285.823)] dark:text-[oklch(0.985_0_0)] md:text-6xl'>
                Master New Skills With <span className='text-[oklch(0.577_0.245_27.325)]'>LearnPoorf</span>
              </h1>
              <p className='max-w-lg text-lg leading-relaxed text-[oklch(0.552_0.016_285.938)]'>
                High-fidelity e-learning platform focusing on a clean and professional educational experience. Start
                your journey with industry experts today.
              </p>
            </div>

            <div className='flex flex-wrap gap-4'>
              <Button className='h-14 px-8 text-base font-bold bg-[oklch(0.577_0.245_27.325)] text-white rounded-[calc(0.5rem-2px)] shadow-lg shadow-[oklch(0.577_0.245_27.325)]/20 hover:scale-[1.02] transition-transform'>
                Start Learning
              </Button>
              <Button
                variant='outline'
                className='h-14 px-8 text-base font-bold border-2 border-[oklch(0.92_0.004_286.32)] rounded-[calc(0.5rem-2px)] text-[oklch(0.141_0.005_285.823)] dark:text-white hover:bg-[oklch(0.967_0.001_0)]'
              >
                View Curriculum
              </Button>
            </div>

            <div className='flex items-center gap-4 text-sm font-medium'>
              <div className='flex -space-x-2'>
                {[1, 2, 3].map((i) => (
                  <div key={i} className='h-8 w-8 rounded-full border-2 border-white bg-slate-200' />
                ))}
              </div>
              <span className='text-[oklch(0.552_0.016_285.938)]'>
                <strong className='text-[oklch(0.141_0.005_285.823)]'>10k+</strong> students already joined
              </span>
            </div>
          </div>

          <div className='lg:w-1/2'>
            <div className='relative aspect-video w-full overflow-hidden rounded-[0.5rem] shadow-2xl'>
              <div className='absolute inset-0 bg-gradient-to-tr from-[oklch(0.577_0.245_27.325)]/20 to-transparent'></div>
              <img
                className='h-full w-full object-cover'
                src='https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80'
                alt='Students collaborating'
              />
              <div className='absolute bottom-4 left-4 right-4 rounded-[0.5rem] bg-white/90 p-4 backdrop-blur-md dark:bg-[oklch(0.141_0.005_285.823)]/90'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[oklch(0.577_0.245_27.325)]/10 text-[oklch(0.577_0.245_27.325)]'>
                    <PlayCircle size={24} />
                  </div>
                  <div>
                    <p className='text-xs font-bold uppercase tracking-wider text-[oklch(0.577_0.245_27.325)]'>
                      Live Now
                    </p>
                    <p className='text-sm font-bold text-[oklch(0.141_0.005_285.823)] dark:text-white'>
                      Intro to System Design
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='px-6 py-12'>
          <div className='flex items-center justify-between pb-8'>
            <h2 className='text-2xl font-bold tracking-tight text-[oklch(0.141_0.005_285.823)] dark:text-white md:text-3xl'>
              Featured Courses
            </h2>
            <a className='group flex items-center gap-1 text-sm font-bold text-[oklch(0.577_0.245_27.325)]' href='#'>
              See all <ArrowRight size={16} className='transition-transform group-hover:translate-x-1' />
            </a>
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {courses.map((course, idx) => (
              <div
                key={idx}
                className='group flex flex-col gap-4 rounded-[0.5rem] bg-[oklch(1_0_0)] dark:bg-[oklch(0.141_0.005_285.823)] p-3 shadow-sm border border-[oklch(0.92_0.004_286.32)] hover:shadow-md transition-shadow'
              >
                <div className='relative aspect-video w-full overflow-hidden rounded-[calc(0.5rem-2px)]'>
                  <img
                    className='h-full w-full object-cover transition-transform group-hover:scale-105'
                    src={course.img}
                    alt={course.title}
                  />
                </div>
                <div className='flex flex-col gap-1 px-1'>
                  <h3 className='font-bold leading-snug text-[oklch(0.141_0.005_285.823)] dark:text-white group-hover:text-[oklch(0.577_0.245_27.325)] transition-colors'>
                    {course.title}
                  </h3>
                  <div className='flex items-center gap-3 text-xs text-[oklch(0.552_0.016_285.938)]'>
                    <span className='flex items-center gap-1'>
                      <Clock size={14} /> {course.time}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Users size={14} /> {course.students}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}