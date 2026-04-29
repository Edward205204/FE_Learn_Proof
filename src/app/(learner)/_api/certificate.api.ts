import http from '@/utils/http'

export interface CertificateRecord {
  id: string
  courseId: string
  txHash: string | null
  certificateHash: string
  status: 'PENDING' | 'MINTING' | 'COMPLETED' | 'FAILED'
  issuedAt: string
  course: {
    id: string
    title: string
    slug: string
    thumbnail: string | null
  }
}

const certificateApi = {
  // Gọi Backend để mint chứng chỉ lên Blockchain
  mintCertificate: (courseId: string) =>
    http.post<{
      id: string
      txHash: string
      certificateHash: string
      status: string
      issuedAt: string
    }>(`/certificate/mint/${courseId}`),

  // Lấy danh sách chứng chỉ đã được cấp (từ DB, kèm txHash thật)
  getMyCertificates: () => http.get<CertificateRecord[]>('/certificate/me'),
}

export default certificateApi
