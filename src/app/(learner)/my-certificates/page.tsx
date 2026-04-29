'use client'

import { useState, useRef } from 'react'
import { Award, ShieldCheck, CheckCircle2, Copy, ExternalLink, Check, Download, Loader2, Eye, X } from 'lucide-react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import enrollmentApi from '../_api/enrollment.api'
import { useAuthStore } from '@/store/auth.store'
import { CertificateTemplate } from '../_components/certificate-template'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'

export default function MyCertificatesPage() {
  const [copiedHash, setCopiedHash] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [previewCertificate, setPreviewCertificate] = useState<{
    courseTitle: string
    issueDate: string
    certificateId: string
    hash: string
  } | null>(null)
  const { user } = useAuthStore()

  // Mảng refs để tham chiếu đến các chứng chỉ (để xuất PDF)
  const certRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentApi.getMyEnrollments().then((res) => res.data)
  })

  // Lọc chỉ lấy những khóa học đã hoàn thành 100%
  const completedCourses = enrollments?.filter((e) => e.progressPercent === 100) || []

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(hash)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  // Generate fake hash based on course ID for now
  const generateHash = (courseId: string) => {
    return `0x71c3b42a9d8f1e5c6a7b8c9d0e1f2a3b4c5d6e7f${courseId.slice(0, 8)}`
  }

  const handleDownloadPDF = async (courseId: string, courseTitle: string) => {
    const element = certRefs.current[courseId]
    if (!element) return

    try {
      setDownloadingId(courseId)
      // Tạm ẩn class làm tròn/viền để ảnh nét hơn nếu cần, nhưng ta đang render ẩn 1 bản fullsize
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: '1056px',
          height: '816px'
        }
      })

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1056, 816],
        compress: true
      })

      pdf.addImage(dataUrl, 'PNG', 0, 0, 1056, 816)
      pdf.save(`Chung-Chi-${courseTitle.replace(/\s+/g, '-')}.pdf`)
    } catch (error) {
      console.error('Lỗi khi tạo PDF:', error)
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className='max-w-7xl mx-auto p-6 md:p-10 space-y-8 min-h-[600px]'>
      {/* Header Section */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6'>
        <div>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center'>
              <Award size={24} />
            </div>
            <h1 className='text-3xl font-black text-slate-900 tracking-tight'>Chứng chỉ của tôi</h1>
          </div>
          <p className='text-slate-500 mt-1 text-sm font-medium'>
            Quản lý các chứng chỉ bạn đã đạt được và xác thực Blockchain
          </p>
        </div>

        <div className='bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-2'>
          <ShieldCheck size={18} className='text-emerald-500' />
          <span className='text-sm font-bold text-slate-700'>{completedCourses.length} Chứng chỉ</span>
        </div>
      </div>

      {isLoading ? (
        <div className='flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-slate-50 shadow-sm gap-4'>
          <Loader2 className='animate-spin text-primary' size={40} />
          <p className='text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs'>
            Đang tải danh sách chứng chỉ...
          </p>
        </div>
      ) : completedCourses.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {completedCourses.map((enrollment) => {
            const txHash = generateHash(enrollment.course.id)
            const issueDate = enrollment.completedAt
              ? new Date(enrollment.completedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric'
                })
              : 'N/A'
            const certificateId = `CT-${enrollment.course.id.slice(0, 8).toUpperCase()}`

            return (
              <div
                key={enrollment.id}
                className='bg-white border border-slate-100 rounded-[30px] p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow group relative overflow-hidden'
              >
                {/* Decorative background element */}
                <div className='absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none' />

                {/* Certificate Thumbnail Preview using SVG foreignObject for perfect responsive scaling */}
                <div className='relative group/thumb w-full mb-6'>
                  <svg
                    viewBox='0 0 1056 816'
                    className='w-full aspect-[1056/816] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 group-hover:border-primary/20 transition-colors shadow-sm pointer-events-none'
                  >
                    <foreignObject width='1056' height='816'>
                      <CertificateTemplate
                        userName={user?.fullName || 'Học viên'}
                        courseName={enrollment.course.title}
                        issueDate={issueDate}
                        certificateId={certificateId}
                        hash={txHash}
                      />
                    </foreignObject>
                  </svg>

                  {/* Hover Overlay */}
                  <div className='absolute inset-0 bg-slate-900/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity rounded-2xl flex items-center justify-center backdrop-blur-[2px]'>
                    <button
                      onClick={() =>
                        setPreviewCertificate({
                          courseTitle: enrollment.course.title,
                          issueDate,
                          certificateId,
                          hash: txHash
                        })
                      }
                      className='bg-white text-slate-900 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-transform hover:scale-105 shadow-xl'
                    >
                      <Eye size={18} />
                      Xem trước
                    </button>
                  </div>
                </div>

                {/* Bản fullsize ẩn (opacity 0.01) dùng để chụp ảnh nét cho xuất PDF */}
                <div className='fixed -left-[9999px] top-0 opacity-[0.01] pointer-events-none'>
                  <CertificateTemplate
                    ref={(el) => {
                      certRefs.current[enrollment.course.id] = el
                    }}
                    userName={user?.fullName || 'Học viên'}
                    courseName={enrollment.course.title}
                    issueDate={issueDate}
                    certificateId={certificateId}
                    hash={txHash}
                  />
                </div>

                {/* Header: Course Title & Date */}
                <div className='mb-6 relative z-10'>
                  <span className='text-[10px] font-black uppercase text-emerald-500 tracking-widest bg-emerald-50 px-2 py-1 rounded-md mb-3 inline-block'>
                    HOÀN THÀNH
                  </span>
                  <h3 className='font-bold text-lg text-slate-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors'>
                    {enrollment.course.title}
                  </h3>
                  <p className='text-xs font-medium text-slate-400 mt-2 flex items-center gap-1.5'>
                    <CheckCircle2 size={12} className='text-emerald-400' />
                    Cấp ngày: {issueDate}
                  </p>
                </div>

                {/* Blockchain Info Box */}
                <div className='bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-auto space-y-3 relative z-10'>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs font-bold text-slate-500 flex items-center gap-1.5'>
                      <ShieldCheck size={14} className='text-emerald-500' />
                      Mã Blockchain (Hash)
                    </span>
                    <button
                      onClick={() => handleCopyHash(txHash)}
                      className='text-slate-400 hover:text-emerald-600 transition-colors bg-white p-1.5 rounded-lg shadow-sm border border-slate-100 hover:border-emerald-200'
                      title='Copy Hash'
                    >
                      {copiedHash === txHash ? <Check size={14} className='text-emerald-500' /> : <Copy size={14} />}
                    </button>
                  </div>
                  <p className='font-mono text-[10px] sm:text-xs text-slate-600 truncate bg-white px-2 py-1.5 rounded-lg border border-slate-100'>
                    {txHash}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className='mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 relative z-10'>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors'
                  >
                    Xem Explorer
                    <ExternalLink size={12} />
                  </a>

                  <button
                    onClick={() => handleDownloadPDF(enrollment.course.id, enrollment.course.title)}
                    disabled={downloadingId === enrollment.course.id}
                    className='inline-flex items-center gap-2 text-sm font-bold text-white transition-colors bg-primary hover:bg-rose-600 px-4 py-2.5 rounded-xl shadow-sm disabled:opacity-70 disabled:cursor-not-allowed'
                  >
                    {downloadingId === enrollment.course.id ? (
                      <>
                        <Loader2 size={16} className='animate-spin' />
                        Đang tải...
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        Tải PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border border-slate-50 shadow-sm text-center px-6'>
          <div className='w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6'>
            <Award size={48} />
          </div>
          <h3 className='text-2xl font-black text-slate-900 mb-2 tracking-tight'>Bạn chưa có chứng chỉ nào</h3>
          <p className='text-slate-500 max-w-md mx-auto mb-8 leading-relaxed font-medium'>
            Hãy hoàn thành 100% tiến độ của một khóa học bất kỳ để nhận được chứng chỉ danh giá từ LearnProof.
          </p>
          <Link
            href='/courses'
            className='bg-primary hover:bg-rose-600 text-white px-8 py-4 rounded-2xl font-black transition-transform active:scale-95 shadow-lg shadow-rose-200'
          >
            Khám phá khóa học ngay
          </Link>
        </div>
      )}

      {/* Preview Modal */}
      {previewCertificate && (
        <div
          className='fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 p-4 sm:p-10 backdrop-blur-sm animate-in fade-in duration-200'
          onClick={() => setPreviewCertificate(null)}
        >
          <button
            onClick={() => setPreviewCertificate(null)}
            className='absolute top-6 right-6 text-white bg-slate-800/50 hover:bg-slate-800 p-2 rounded-full transition-colors'
          >
            <X size={24} />
          </button>

          <div
            className='bg-white shadow-2xl rounded-sm overflow-auto max-w-[1056px] max-h-[100vh]'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='min-w-[1056px]'>
              <CertificateTemplate
                userName={user?.fullName || 'Học viên'}
                courseName={previewCertificate.courseTitle}
                issueDate={previewCertificate.issueDate}
                certificateId={previewCertificate.certificateId}
                hash={previewCertificate.hash}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
