import React from 'react'

interface CertificateTemplateProps {
  userName: string
  courseName: string
  issueDate: string
  certificateId: string
  hash: string
}

export const CertificateTemplate = React.forwardRef<HTMLDivElement, CertificateTemplateProps>(
  ({ userName, courseName, issueDate, certificateId, hash }, ref) => {
    return (
      <div
        ref={ref}
        className='relative bg-white text-slate-900 overflow-hidden shrink-0'
        style={{
          width: '1056px', // 11 inches at 96 DPI
          height: '816px', // 8.5 inches at 96 DPI
          fontFamily: '"Inter", sans-serif',
          padding: '40px'
        }}
      >
        {/* Outer Border */}
        <div className='absolute inset-0 border-[12px] border-[#d4af37] m-4 rounded-sm pointer-events-none' />
        <div className='absolute inset-0 border-[2px] border-slate-800 m-[22px] rounded-sm pointer-events-none' />

        {/* Background Watermark (Optional) */}
        <div className='absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none'>
          <div className='w-96 h-96 bg-primary rounded-full blur-[100px]' />
        </div>

        <div className='relative z-10 flex flex-col h-full items-center justify-between py-12 px-20 text-center'>
          {/* Header */}
          <div className='space-y-4'>
            <div className='flex items-center justify-center mb-8'>
              <img src='/images/leaner/logo (2).png' alt='LearnProof Logo' className='h-16 object-contain' />
            </div>
            <h2 className='text-[42px] font-light tracking-wide uppercase text-slate-800 leading-tight'>
              LearnProof Certified
            </h2>
            <h3 className='text-2xl font-normal text-slate-600'>{courseName}</h3>
          </div>

          {/* User Name */}
          <div className='w-full border-b border-slate-300 pb-4 mb-4 mt-8'>
            <h1 className='text-[64px] font-black italic tracking-tight text-slate-900'>{userName}</h1>
          </div>

          {/* Description */}
          <div className='max-w-3xl'>
            <p className='text-lg font-medium text-slate-600 leading-relaxed'>
              Has successfully completed the LearnProof Certification requirements and is recognized as an
            </p>
            <p className='text-xl font-bold text-slate-800 mt-2'>LearnProof Certified - {courseName}</p>
            <p className='text-base font-medium text-slate-500 mt-4'>Certificate ID: {certificateId}</p>
            <p className='text-xs font-mono text-slate-400 mt-1'>Blockchain Hash: {hash}</p>
          </div>

          {/* Footer Signatures */}
          <div className='w-full flex justify-between items-end mt-10 px-10'>
            {/* Left side: Dates & Signature */}
            <div className='flex flex-col items-start w-64'>
              {/* Signature Image */}
              <div className='h-16 w-full flex items-end'>
                <img
                  src='/images/leaner/signature.jpg'
                  alt='Signature'
                  className='w-40 object-contain mix-blend-multiply -mb-1'
                />
              </div>
              <div className='text-left border-t-2 border-slate-200 pt-4 w-full'>
                <div className='mb-3'>
                  <p className='text-sm font-bold text-slate-800'>{issueDate}</p>
                  <p className='text-[10px] text-slate-400 uppercase tracking-wider'>Certification Issue Date</p>
                </div>
                <div>
                  <p className='text-sm font-bold text-slate-800'>Never Expires</p>
                  <p className='text-[10px] text-slate-400 uppercase tracking-wider'>Expiration Date</p>
                </div>
              </div>
            </div>

            {/* Right side: Badge and Company */}
            <div className='flex items-center justify-end gap-5 w-72 mb-2'>
              <svg viewBox='0 0 120 150' className='h-28 w-auto drop-shadow-xl' xmlns='http://www.w3.org/2000/svg'>
                <defs>
                  <linearGradient id='goldGrad' x1='0%' y1='0%' x2='100%' y2='100%'>
                    <stop offset='0%' stopColor='#fef08a' />
                    <stop offset='50%' stopColor='#eab308' />
                    <stop offset='100%' stopColor='#a16207' />
                  </linearGradient>
                  <linearGradient id='goldInner' x1='0%' y1='100%' x2='100%' y2='0%'>
                    <stop offset='0%' stopColor='#fef08a' />
                    <stop offset='50%' stopColor='#eab308' />
                    <stop offset='100%' stopColor='#a16207' />
                  </linearGradient>
                </defs>

                {/* Ribbons hanging down */}
                <path d='M 35 80 L 25 140 L 45 125 L 60 140 L 60 80 Z' fill='#1e3a8a' />
                <path d='M 85 80 L 95 140 L 75 125 L 60 140 L 60 80 Z' fill='#1e3a8a' />

                {/* Gold Seal Base (Scalloped edge using rotated squares) */}
                <g fill='url(#goldGrad)'>
                  <rect x='20' y='20' width='80' height='80' rx='12' transform='rotate(0 60 60)' />
                  <rect x='20' y='20' width='80' height='80' rx='12' transform='rotate(30 60 60)' />
                  <rect x='20' y='20' width='80' height='80' rx='12' transform='rotate(60 60 60)' />
                </g>

                {/* Inner Circles */}
                <circle cx='60' cy='60' r='34' fill='#ffffff' />
                <circle cx='60' cy='60' r='28' fill='url(#goldInner)' />

                {/* Folded Ribbon Shadows */}
                <path d='M 15 72 L 25 82 L 25 72 Z' fill='#0f172a' />
                <path d='M 105 72 L 95 82 L 95 72 Z' fill='#0f172a' />

                {/* Horizontal Banner */}
                <path d='M 5 48 L 115 48 L 120 60 L 115 72 L 5 72 L 10 60 Z' fill='#1d4ed8' />
                <rect x='15' y='48' width='90' height='24' fill='#2563eb' />

                {/* Text */}
                <text
                  x='60'
                  y='65'
                  fontFamily='Arial, sans-serif'
                  fontSize='14'
                  fontWeight='bold'
                  fill='#ffffff'
                  textAnchor='middle'
                  letterSpacing='1'
                >
                  CERTIFIED
                </text>
              </svg>
              <div className='flex flex-col items-center text-center pl-2'>
                <img
                  src='/images/leaner/logo (2).png'
                  alt='LearnProof Logo'
                  className='h-10 w-auto object-contain mb-2 mix-blend-multiply'
                />
                <p className='text-sm font-black text-slate-800 uppercase tracking-widest leading-none'>LearnProof</p>
                <p className='text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1.5 leading-none'>
                  Education
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

CertificateTemplate.displayName = 'CertificateTemplate'
