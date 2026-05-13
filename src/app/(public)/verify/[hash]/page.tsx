'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import certificateApi from '@/app/(learner)/_api/certificate.api'
import { CertificateTemplate } from '@/app/(learner)/_components/certificate-template'
import { CheckCircle2, ExternalLink, Copy, Share2, Linkedin, Shield, AlertTriangle, Loader2, Link } from 'lucide-react'
import { useState } from 'react'

const POLYGON_SCAN = 'https://amoy.polygonscan.com'
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? ''

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className='flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors'
      title={`Copy ${label}`}
    >
      <Copy className='w-3.5 h-3.5' />
      {copied ? 'Copied!' : label}
    </button>
  )
}

function InfoRow({ label, value, link }: { label: string; value: string; link?: string }) {
  const truncated = value.length > 24 ? `${value.slice(0, 12)}...${value.slice(-10)}` : value
  return (
    <div className='flex items-center justify-between py-3 border-b border-white/10 last:border-0'>
      <span className='text-sm text-slate-400'>{label}</span>
      <div className='flex items-center gap-2'>
        <span className='text-sm font-mono text-slate-200'>{truncated}</span>
        {link && (
          <a href={link} target='_blank' rel='noopener noreferrer' className='text-blue-400 hover:text-blue-300'>
            <ExternalLink className='w-3.5 h-3.5' />
          </a>
        )}
        <CopyButton text={value} label='Copy' />
      </div>
    </div>
  )
}

export default function VerifyPage() {
  const params = useParams()
  const hash = typeof params.hash === 'string' ? params.hash : ''

  const {
    data: cert,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['public-certificate', hash],
    queryFn: () => certificateApi.getPublicCertificate(hash).then((r) => r.data),
    enabled: !!hash,
    retry: false
  })

  const issueDate = cert
    ? new Date(cert.issuedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : ''

  const certificateId = cert ? `CT-${cert.courseId.slice(0, 8).toUpperCase()}` : ''

  const linkedInUrl = cert
    ? `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
        `LearnProof: ${cert.course.title}`
      )}&organizationName=LearnProof&issueYear=${new Date(cert.issuedAt).getFullYear()}&issueMonth=${
        new Date(cert.issuedAt).getMonth() + 1
      }&certId=${certificateId}&certUrl=${encodeURIComponent(window?.location?.href ?? '')}`
    : '#'

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const handleShare = () => navigator.clipboard.writeText(shareUrl)

  if (isLoading) {
    return (
      <div className='min-h-screen bg-[#0d1117] flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4 text-slate-400'>
          <Loader2 className='w-10 h-10 animate-spin text-blue-500' />
          <p>Đang xác thực chứng chỉ...</p>
        </div>
      </div>
    )
  }

  if (isError || !cert) {
    return (
      <div className='min-h-screen bg-[#0d1117] flex items-center justify-center px-4'>
        <div className='max-w-md text-center'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6'>
            <AlertTriangle className='w-8 h-8 text-red-400' />
          </div>
          <h1 className='text-2xl font-bold text-white mb-3'>Không tìm thấy chứng chỉ</h1>
          <p className='text-slate-400 text-sm leading-relaxed'>
            Chứng chỉ này không tồn tại, chưa được xác nhận trên Blockchain, hoặc đường link không hợp lệ.
          </p>
          <div className='mt-6 p-3 rounded-lg bg-white/5 border border-white/10'>
            <p className='text-xs font-mono text-slate-500 break-all'>{hash}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#0d1117] py-12 px-4'>
      {/* Glow effect */}
      <div className='fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full' />

      <div className='relative max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-10'>
          <div className='inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold mb-4'>
            <CheckCircle2 className='w-4 h-4' />
            Chứng chỉ đã được xác thực trên Blockchain
          </div>
          <h1 className='text-3xl md:text-4xl font-bold text-white'>Certificate Verification Portal</h1>
          <p className='text-slate-400 mt-2 text-sm'>
            Trang xác thực chứng chỉ học tập — được bảo vệ bởi Polygon Network
          </p>
        </div>

        <div className='grid grid-cols-1 xl:grid-cols-5 gap-8 items-start'>
          {/* Left: Certificate Display */}
          <div className='xl:col-span-3 space-y-4'>
            {/* Scaled wrapper */}
            <div className='rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-white'>
              <div className='w-full overflow-x-auto'>
                <div
                  className='origin-top-left'
                  style={{ transform: 'scale(0.58)', transformOrigin: 'top left', width: '1056px', height: '816px' }}
                >
                  <CertificateTemplate
                    userName={cert.user.fullName}
                    courseName={cert.course.title}
                    issueDate={issueDate}
                    certificateId={certificateId}
                    hash={cert.certificateHash}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-wrap gap-3'>
              <a
                href={linkedInUrl}
                target='_blank'
                rel='noopener noreferrer'
                id='add-to-linkedin-btn'
                className='inline-flex items-center gap-2 bg-[#0A66C2] hover:bg-[#0958a8] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-lg'
              >
                <Linkedin className='w-4 h-4' />
                Add to LinkedIn
              </a>
              <button
                id='share-certificate-btn'
                onClick={handleShare}
                className='inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-white/20'
              >
                <Link className='w-4 h-4' />
                Copy Verification Link
              </button>
              <a
                href={`${POLYGON_SCAN}/tx/${cert.txHash}`}
                target='_blank'
                rel='noopener noreferrer'
                id='view-polygonscan-btn'
                className='inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-white/20'
              >
                <ExternalLink className='w-4 h-4' />
                View on PolygonScan
              </a>
            </div>
          </div>

          {/* Right: Details Panel */}
          <div className='xl:col-span-2 space-y-6'>
            {/* Learner Info */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <h2 className='text-base font-bold text-white mb-4 flex items-center gap-2'>
                <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
                Thông tin học viên
              </h2>
              <div className='flex items-center gap-4 p-4 bg-white/5 rounded-lg'>
                {cert.user.avatar ? (
                  <img
                    src={cert.user.avatar}
                    alt={cert.user.fullName}
                    className='w-14 h-14 rounded-full object-cover border-2 border-blue-500/50'
                  />
                ) : (
                  <div className='w-14 h-14 rounded-full bg-blue-600/20 border-2 border-blue-500/50 flex items-center justify-center text-xl font-bold text-blue-300'>
                    {cert.user.fullName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className='text-white font-bold text-lg'>{cert.user.fullName}</p>
                  <p className='text-slate-400 text-sm'>Đã hoàn thành khóa học</p>
                </div>
              </div>

              <div className='mt-4 space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-slate-400'>Khóa học</span>
                  <span className='text-sm font-semibold text-white text-right max-w-[60%]'>{cert.course.title}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-slate-400'>Ngày cấp</span>
                  <span className='text-sm font-semibold text-white'>{issueDate}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-slate-400'>Thời hạn</span>
                  <span className='text-sm font-semibold text-emerald-400'>Vĩnh viễn</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-slate-400'>Certificate ID</span>
                  <span className='text-sm font-mono text-slate-300'>{certificateId}</span>
                </div>
              </div>
            </div>

            {/* Blockchain Proof */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <h2 className='text-base font-bold text-white mb-4 flex items-center gap-2'>
                <Shield className='w-4 h-4 text-violet-400' />
                Blockchain Verification
              </h2>

              <div className='bg-violet-500/10 border border-violet-500/20 rounded-lg p-3 mb-4'>
                <div className='flex items-center gap-2'>
                  <CheckCircle2 className='w-4 h-4 text-violet-400 shrink-0' />
                  <span className='text-xs text-violet-300 font-medium'>Verified on Polygon Amoy Testnet</span>
                </div>
              </div>

              <div className='space-y-1'>
                {cert.txHash && (
                  <InfoRow label='Transaction Hash' value={cert.txHash} link={`${POLYGON_SCAN}/tx/${cert.txHash}`} />
                )}
                {cert.tokenId && <InfoRow label='Token ID' value={cert.tokenId} />}
                <InfoRow
                  label='Smart Contract'
                  value={CONTRACT_ADDRESS || '0x69dd39bb382da8334efdd7654bc66f169c6af29d'}
                  link={`${POLYGON_SCAN}/address/${CONTRACT_ADDRESS || '0x69dd39bb382da8334efdd7654bc66f169c6af29d'}`}
                />
                <InfoRow label='Certificate Hash' value={cert.certificateHash} />
                {cert.ipfsHash && (
                  <InfoRow label='IPFS Metadata' value={cert.ipfsHash} link={`https://ipfs.io/ipfs/${cert.ipfsHash}`} />
                )}
              </div>
            </div>

            {/* Course Info */}
            {cert.course.shortDesc && (
              <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
                <h2 className='text-base font-bold text-white mb-3'>Về khóa học</h2>
                <p className='text-slate-400 text-sm leading-relaxed'>{cert.course.shortDesc}</p>
                <a
                  href={`/courses/${cert.course.slug}`}
                  className='inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-medium mt-3 transition-colors'
                >
                  Xem khóa học <ExternalLink className='w-3.5 h-3.5' />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='mt-12 text-center text-xs text-slate-600'>
          <p>
            Trang xác thực này được cung cấp bởi <span className='text-slate-400 font-semibold'>LearnProof</span>
          </p>
          <p className='mt-1'>Mọi thông tin được lưu trữ bất biến trên Polygon Blockchain</p>
        </div>
      </div>
    </div>
  )
}
