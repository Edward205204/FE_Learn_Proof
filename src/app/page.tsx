import Header from '@/components/common/header'
import Footer from '@/components/common/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  PlayCircle,
  ArrowRight,
  Clock,
  Users,
  Award,
  Star,
  Brain,
  Terminal,
  Globe,
  Rocket,
  Github,
  MonitorSmartphone,
  Briefcase
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { PATH } from '@/constants/path'

const courses = [
  {
    title: 'Fullstack Next.js 14 & NestJS Mastery',
    time: '16 weeks',
    students: '1.2k',
    rating: 4.9,
    category: 'Development',
    price: '$99',
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80'
  },
  {
    title: 'UI/UX Design for Developers',
    time: '8 weeks',
    students: '850',
    rating: 4.8,
    category: 'Design',
    price: '$49',
    img: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&q=80'
  },
  {
    title: 'Data Structure & Algorithms in JS',
    time: '10 weeks',
    students: '2.1k',
    rating: 4.9,
    category: 'Fundamentals',
    price: 'Free',
    img: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80'
  },
  {
    title: 'DevOps & AWS Cloud Essentials',
    time: '12 weeks',
    students: '500',
    rating: 4.7,
    category: 'Infrastructure',
    price: '$79',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80'
  }
]

const features = [
  {
    icon: <Terminal className="w-6 h-6 text-rose-500" />,
    title: "Project-Based Learning",
    desc: "Không chỉ học lý thuyết, bạn xây dựng các dự án thực tế như E-commerce, SaaS, và Social Media ngay trong khóa học."
  },
  {
    icon: <Github className="w-6 h-6 text-rose-500" />,
    title: "Code Review 1:1",
    desc: "Mọi dòng code bạn viết đều được các Senior Developer review chi tiết qua Pull Request trên GitHub."
  },
  {
    icon: <Briefcase className="w-6 h-6 text-rose-500" />,
    title: "Job Guarantee",
    desc: "Hỗ trợ tối ưu CV, Portfolio và kết nối trực tiếp với mạng lưới đối tác tuyển dụng của LearnProof."
  }
]

const techStack = [
  { name: 'React', logo: 'https://skillicons.dev/icons?i=react' },
  { name: 'Next.js', logo: 'https://skillicons.dev/icons?i=nextjs' },
  { name: 'TypeScript', logo: 'https://skillicons.dev/icons?i=ts' },
  { name: 'NestJS', logo: 'https://skillicons.dev/icons?i=nestjs' },
  { name: 'PostgreSQL', logo: 'https://skillicons.dev/icons?i=postgres' },
  { name: 'Docker', logo: 'https://skillicons.dev/icons?i=docker' },
  { name: 'Tailwind', logo: 'https://skillicons.dev/icons?i=tailwind' },
  { name: 'Figma', logo: 'https://skillicons.dev/icons?i=figma' },
  { name: 'AWS', logo: 'https://skillicons.dev/icons?i=aws' },
  { name: 'Prisma', logo: 'https://skillicons.dev/icons?i=prisma' }
]

const testimonials = [
  {
    name: 'Phạm Minh Hoàng',
    role: 'Fullstack Developer @ VinGroup',
    content:
      'Khóa học thực sự thay đổi tư duy làm sản phẩm của mình. Không chỉ là code, LearnProof dạy cách kiến trúc một hệ thống có thể mở rộng và tối ưu hiệu năng.',
    avatar: 'https://i.pravatar.cc/150?u=11',
    rating: 5
  },
  {
    name: 'Lê Thu Thảo',
    role: 'Frontend Engineer @ VNG Corporation',
    content:
      'Lộ trình học rất sát với thực tế doanh nghiệp. Những gì mình học được ở đây đã giúp mình pass phỏng vấn vào tập đoàn lớn một cách dễ dàng chỉ sau 4 tháng học.',
    avatar: 'https://i.pravatar.cc/150?u=12',
    rating: 5
  },
  {
    name: 'Nguyễn Quốc Anh',
    role: 'Backend Developer @ Freelancer',
    content:
      'Hệ thống bài tập thực chiến và sự hỗ trợ nhiệt tình từ Mentor là điểm khác biệt lớn nhất. Đây là khoản đầu tư thông minh nhất cho sự nghiệp của tôi.',
    avatar: 'https://i.pravatar.cc/150?u=13',
    rating: 5
  }
]

export default function Home() {
  return (
    <div className='min-h-screen bg-background overflow-x-hidden' suppressHydrationWarning>
      <Header />

      <main className='relative'>
        {/* Background Gradients */}
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[800px] pointer-events-none overflow-hidden'>
          <div className='absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]' />
          <div className='absolute top-[200px] left-[-100px] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]' />
        </div>

        {/* 1. HERO SECTION */}
        <section className='relative pt-16 pb-24 md:pt-32 md:pb-40 px-6'>
          <div className='mx-auto max-w-[1200px]'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>
              <div className='flex flex-col gap-10'>
                <div className='space-y-6'>
                  <Badge
                    variant='secondary'
                    className='px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold text-xs uppercase tracking-[0.2em] flex w-fit gap-2'
                  >
                    <Rocket className='w-3.5 h-3.5 animate-pulse' />
                    Bắt đầu sự nghiệp lập trình chuyên nghiệp
                  </Badge>
                  <h1 className='text-6xl md:text-8xl font-black leading-[0.95] tracking-tighter text-foreground'>
                    Code Your <br />
                    <span className='text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-500 to-primary'>
                      Future Now.
                    </span>
                  </h1>
                  <p className='max-w-lg text-xl leading-relaxed text-muted-foreground font-medium'>
                    Học lập trình thực chiến cùng LearnProof. Chúng tôi không dạy Syntax, chúng tôi dạy bạn cách xây
                    dựng sản phẩm triệu đô.
                  </p>
                </div>

                <div className='flex flex-wrap gap-5'>
                  <Link href={PATH.COURSES}>
                    <Button className='h-16 px-10 text-base font-black bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:scale-[1.05] active:scale-[0.98] flex gap-3'>
                      Khám phá lộ trình <ArrowRight className='w-5 h-5' />
                    </Button>
                  </Link>
                  <Link href={PATH.REGISTER}>
                    <Button
                      variant='outline'
                      className='h-16 px-10 text-base font-black border-2 border-border rounded-2xl text-foreground hover:bg-accent transition-all'
                    >
                      Học thử miễn phí
                    </Button>
                  </Link>
                </div>

                <div className='flex items-center gap-6'>
                  <div className='flex -space-x-3'>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className='h-12 w-12 rounded-full border-4 border-background bg-muted relative'
                      >
                        <Image
                          fill
                          src={`https://i.pravatar.cc/100?u=${i + 10}`}
                          alt='User'
                          className='rounded-full object-cover'
                        />
                      </div>
                    ))}
                    <div className='h-12 w-12 rounded-full border-4 border-background bg-primary flex items-center justify-center text-white text-[10px] font-black italic'>
                      +12k
                    </div>
                  </div>
                  <div className='h-10 w-[1px] bg-border' />
                  <div>
                    <p className='text-sm font-black text-foreground'>98% Học viên có việc</p>
                    <p className='text-xs text-muted-foreground uppercase font-bold tracking-tighter'>Mức lương TB $1,200+</p>
                  </div>
                </div>
              </div>

              {/* Terminal Preview */}
              <div className='relative lg:block hidden group'>
                <div className='absolute -inset-1 bg-gradient-to-r from-primary to-orange-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000'></div>
                <div className='relative h-[550px] w-full bg-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden font-mono text-sm'>
                  <div className='bg-muted/50 px-6 py-4 border-b border-border flex items-center justify-between'>
                    <div className='flex gap-2'>
                      <div className='w-3 h-3 rounded-full bg-[#FF5F56]'></div>
                      <div className='w-3 h-3 rounded-full bg-[#FFBD2E]'></div>
                      <div className='w-3 h-3 rounded-full bg-[#27C93F]'></div>
                    </div>
                    <span className='text-[10px] text-muted-foreground font-bold uppercase tracking-widest'>
                      learnproof-main.tsx
                    </span>
                  </div>
                  <div className='p-8 space-y-2'>
                    <p className='text-blue-400'>
                      import <span className='text-foreground'>LearnProof</span> from{' '}
                      <span className='text-emerald-400'>'@/career-path'</span>;
                    </p>
                    <p className='text-muted-foreground italic mt-4'>// Setup your dream career</p>
                    <p className='text-primary'>
                      const <span className='text-foreground'>myFuture</span> = () ={'>'} &#123;
                    </p>
                    <p className='pl-6 text-foreground'>
                      <span className='text-blue-400'>return</span> LearnProof.start(&#123;
                    </p>
                    <p className='pl-12 text-foreground'>
                      skills: [<span className='text-emerald-400'>'Fullstack'</span>,{' '}
                      <span className='text-emerald-400'>'DevOps'</span>],
                    </p>
                    <p className='pl-12 text-foreground'>
                      mentorship: <span className='text-amber-400'>true</span>,
                    </p>
                    <p className='pl-12 text-foreground'>
                      jobReady: <span className='text-amber-400'>true</span>
                    </p>
                    <p className='pl-6 text-foreground'>&#125;);</p>
                    <p className='text-primary'>&#125;;</p>
                    <div className='mt-8 pt-8 border-t border-border flex items-center gap-4 animate-pulse'>
                      <div className='w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]'></div>
                      <span className='text-emerald-500 text-xs font-bold'>Compiling Success: Future.exe is ready!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. LOGO MARQUEE / TECH STACK */}
        <section className='py-24 border-y border-border bg-muted/30 overflow-hidden relative'>
          <style>
            {`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                display: flex;
                width: fit-content;
                animation: marquee 40s linear infinite;
              }
              .animate-marquee:hover {
                animation-play-state: paused;
              }
            `}
          </style>

          <div className='max-w-7xl mx-auto px-6 mb-12 text-center'>
            <h2 className='text-sm font-black uppercase tracking-[0.3em] text-primary mb-4'>Tech Ecosystem</h2>
            <p className='text-3xl md:text-4xl font-black text-foreground tracking-tighter'>
              Làm chủ hệ sinh thái <br className='md:hidden' /> công nghệ hàng đầu
            </p>
          </div>

          <div className='relative flex'>
            {/* Gradient Overlays for Fade Effect */}
            <div className="absolute left-0 top-0 bottom-0 w-40 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-40 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

            <div className='animate-marquee flex gap-10 md:gap-16 items-center py-4'>
              {/* Double the items for seamless loop */}
              {[...techStack, ...techStack].map((tech, idx) => (
                <div 
                  key={`${tech.name}-${idx}`} 
                  className='group flex items-center gap-4 bg-card px-8 py-5 rounded-[2rem] border border-border shadow-xl shadow-foreground/5 transition-all cursor-default hover:border-primary/50'
                >
                  <div className='relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center'>
                    <img src={tech.logo} alt={tech.name} className='w-full h-full object-contain' />
                  </div>
                  <div className="flex flex-col">
                    <span className='text-sm font-black text-foreground tracking-tight'>
                      {tech.name}
                    </span>
                    <span className='text-[10px] font-bold text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity'>
                      Mastered
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. STATS SECTION (Premium Upgrade) */}
        <section className="py-20 relative">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="bg-card rounded-[3.5rem] p-12 md:p-20 border border-border shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-none relative overflow-hidden group">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors duration-1000" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 relative z-10">
                {[
                  { label: "Khóa học thực chiến", val: "500+", icon: <PlayCircle className="w-6 h-6" />, color: "from-primary to-orange-500" },
                  { label: "Giảng viên Senior", val: "120+", icon: <Users className="w-6 h-6" />, color: "from-blue-500 to-indigo-500" },
                  { label: "Học viên hài lòng", val: "20k+", icon: <Star className="w-6 h-6" />, color: "from-amber-400 to-orange-500" },
                  { label: "Tỷ lệ có việc làm", val: "94%", icon: <Award className="w-6 h-6" />, color: "from-emerald-500 to-teal-500" }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center md:items-start gap-6 group/item">
                    <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-foreground group-hover/item:bg-primary group-hover/item:text-white transition-all duration-500 shadow-sm">
                      {stat.icon}
                    </div>
                    <div className="space-y-1 text-center md:text-left">
                      <p className={`text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br ${stat.color}`}>
                        {stat.val}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover/item:text-primary transition-colors">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. FEATURES SECTION (Side-by-Side Layout) */}
        <section className='px-6 py-32'>
          <div className='mx-auto max-w-[1200px]'>
            <div className='grid lg:grid-cols-2 gap-20 items-center'>
              <div className='space-y-8'>
                <div className='space-y-4'>
                  <h2 className='text-sm font-black uppercase tracking-[0.4em] text-primary'>Tại sao chọn LearnProof?</h2>
                  <h3 className='text-5xl md:text-6xl font-black text-foreground tracking-tight leading-[1.1]'>
                    Học chuẩn <span className="text-primary">doanh nghiệp</span> <br /> Thay đổi vị thế.
                  </h3>
                </div>
                <p className='text-xl text-muted-foreground font-medium max-w-lg'>
                  Chúng tôi không chỉ dạy lập trình. Chúng tôi xây dựng bệ phóng vững chắc để bạn bước vào những tập đoàn công nghệ hàng đầu thế giới.
                </p>
                <div className="pt-4 flex flex-col gap-6">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black">01</div>
                    <p className="font-bold text-foreground/80">Lộ trình được thiết kế bởi các Tech Lead từ Silicon Valley</p>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black">02</div>
                    <p className="font-bold text-foreground/80">Hỗ trợ kết nối việc làm với hơn 200+ đối tác chiến lược</p>
                  </div>
                </div>
              </div>

              <div className='grid gap-8'>
                {features.map((f, i) => (
                  <div key={i} className="group p-8 flex gap-8 bg-card rounded-[3rem] border border-border hover:border-primary/20 hover:bg-accent transition-all duration-500 shadow-xl shadow-transparent hover:shadow-primary/5">
                    <div className="flex-shrink-0 w-16 h-16 rounded-[1.5rem] bg-background shadow-lg flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      {f.icon}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-foreground">{f.title}</h3>
                      <p className="text-muted-foreground leading-relaxed font-medium">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. ROADMAP SECTION (Unique for Coding) */}
        <section className="py-24 px-6 bg-[#0B0F1A] dark:bg-black/40 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[150px]"></div>
          </div>
          <div className="max-w-[1200px] mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Lộ trình đào tạo <br /> chuẩn CMU</h2>
                <p className="text-slate-400 text-lg">Chúng tôi áp dụng mô hình đào tạo từ Đại học Carnegie Mellon, tập trung vào tư duy hệ thống và kỹ thuật phần mềm hiện đại.</p>
                <div className="space-y-4">
                  {["Phân tích thiết kế hệ thống", "Làm chủ ngôn ngữ & Framework", "Deploy & Cloud Computing", "Soft-skills & Interview"].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-white font-bold">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs">{i + 1}</div>
                      {item}
                    </div>
                  ))}
                </div>
                <Button className="h-14 px-8 bg-primary rounded-xl font-black hover:bg-primary/90 transition-all text-white">Nhận tư vấn lộ trình 1-1</Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
                    <Brain className="text-primary mb-4" />
                    <h4 className="text-white font-black">AI Integrated</h4>
                    <p className="text-xs text-slate-500 mt-2">Học cách ứng dụng AI vào quy trình code.</p>
                  </div>
                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
                    <MonitorSmartphone className="text-blue-500 mb-4" />
                    <h4 className="text-white font-black">Multi-Platform</h4>
                    <p className="text-xs text-slate-500 mt-2">Web, Mobile và Desktop App.</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
                    <Globe className="text-emerald-500 mb-4" />
                    <h4 className="text-white font-black">Global Ready</h4>
                    <p className="text-xs text-slate-500 mt-2">Tiếng Anh chuyên ngành IT.</p>
                  </div>
                  <div className="bg-primary p-8 rounded-3xl shadow-2xl shadow-primary/20">
                    <Award className="text-white mb-4" />
                    <h4 className="text-white font-black italic text-xl leading-tight">Chứng chỉ uy tín toàn cầu</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FEATURED COURSES */}
        <section className='px-6 py-32 relative'>
          <div className='mx-auto max-w-[1200px]'>
            <div className='flex flex-col md:flex-row items-end justify-between gap-8 mb-20'>
              <div className="space-y-4">
                <h2 className='text-sm font-black uppercase tracking-[0.4em] text-primary'>Learning Paths</h2>
                <p className='text-4xl md:text-5xl font-black text-foreground tracking-tight'>
                  Khóa học tiêu biểu
                </p>
              </div>
              <Link className='group flex items-center gap-3 px-8 py-4 rounded-2xl bg-muted text-sm font-black text-foreground hover:bg-primary hover:text-white transition-all shadow-sm' href='/courses'>
                Xem tất cả khóa học <ArrowRight size={18} className='transition-transform group-hover:translate-x-1' />
              </Link>
            </div>

            <div className='grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4'>
              {courses.map((course, idx) => (
                <div key={idx} className='group flex flex-col gap-6 rounded-[3rem] bg-card p-5 shadow-2xl shadow-foreground/5 border border-border hover:border-primary/30 transition-all duration-500 hover:-translate-y-3'>
                  <div className='relative aspect-square w-full overflow-hidden rounded-[2.2rem] shadow-inner'>
                    <Image fill className='h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110' src={course.img} alt={course.title} />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-background/95 backdrop-blur-md text-foreground border-none font-black text-[10px] px-3 py-1 uppercase">
                        {course.category}
                      </Badge>
                    </div>
                  </div>
                  <div className='flex flex-col gap-4 px-2'>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-black text-foreground">{course.rating}</span>
                      </div>
                      <span className="text-sm font-black text-primary">{course.price}</span>
                    </div>
                    <h3 className='text-xl font-black leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]'>
                      {course.title}
                    </h3>
                    <div className='flex items-center justify-between pt-4 border-t border-border'>
                      <div className='flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground'>
                        <Clock size={12} className="text-primary" /> {course.time}
                      </div>
                      <div className='flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground'>
                        <Users size={12} className="text-primary" /> {course.students}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. TESTIMONIALS SECTION */}
        <section className='py-32 bg-muted/30 relative overflow-hidden'>
          <div className='mx-auto max-w-[1200px] px-6'>
            <div className='flex flex-col items-center text-center space-y-6 mb-20'>
              <Badge
                variant='secondary'
                className='px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold text-xs uppercase tracking-widest'
              >
                Học viên nói gì?
              </Badge>
              <h2 className='text-4xl md:text-6xl font-black text-foreground tracking-tighter'>
                Câu chuyện thành công <br /> tại <span className='text-primary'>LearnProof</span>
              </h2>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {testimonials.map((item, idx) => (
                <div
                  key={idx}
                  className='bg-card p-10 rounded-[3rem] border border-border shadow-xl shadow-foreground/5 hover:border-primary/30 transition-all group relative'
                >
                  <div className='absolute -top-6 left-10'>
                    <div className='relative w-16 h-16 rounded-3xl overflow-hidden border-4 border-background shadow-lg'>
                      <Image fill src={item.avatar} alt={item.name} className='object-cover' />
                    </div>
                  </div>
                  <div className='mt-6 space-y-6'>
                    <div className='flex gap-1'>
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} size={16} className='text-amber-400 fill-amber-400' />
                      ))}
                    </div>
                    <p className='text-lg font-medium text-muted-foreground italic leading-relaxed'>
                      "{item.content}"
                    </p>
                    <div>
                      <h4 className='font-black text-foreground'>{item.name}</h4>
                      <p className='text-sm font-bold text-primary uppercase tracking-tighter'>{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. CTA SECTION */}
        <section className='px-6 py-32'>
          <div className='mx-auto max-w-[1200px] bg-primary rounded-[4rem] p-12 md:p-24 relative overflow-hidden shadow-[0_40px_80px_-15px_rgba(244,63,94,0.3)]'>
            {/* Abstract Decorative Shapes */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-10 rounded-full -mr-40 -mt-40 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-300 opacity-20 rounded-full -ml-20 -mb-20 blur-2xl" />

            <div className='relative z-10 flex flex-col items-center text-center space-y-12'>
              <div className="space-y-6 max-w-3xl">
                <h2 className='text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter'>
                  Bắt đầu hành trình <br /> Dev chuyên nghiệp
                </h2>
                <p className='text-lg md:text-xl font-medium text-white/90'>
                  Đừng để sự trì hoãn ngăn cản bạn trở thành lập trình viên giỏi. Gia nhập cộng đồng 12,000+ học viên LearnProof ngay hôm nay.
                </p>
              </div>
              <div className='flex flex-wrap justify-center gap-6'>
                <Button className='h-20 px-14 text-lg font-black bg-white text-primary hover:bg-rose-50 rounded-[2rem] transition-all hover:scale-[1.05] active:scale-[0.98] shadow-2xl'>
                  Đăng ký tư vấn miễn phí
                </Button>
                <Button variant='outline' className='h-20 px-14 text-lg font-black border-2 border-white/40 text-white hover:bg-white/10 rounded-[2rem] transition-all'>
                  Gia nhập Discord cộng đồng
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}