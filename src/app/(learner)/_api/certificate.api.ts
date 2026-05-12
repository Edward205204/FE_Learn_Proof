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

export interface PublicCertificateRecord {
  id: string
  courseId: string
  certificateHash: string
  txHash: string | null
  tokenId: string | null
  ipfsHash: string | null
  status: 'PENDING' | 'MINTING' | 'COMPLETED' | 'FAILED'
  issuedAt: string
  user: {
    fullName: string
    avatar: string | null
  }
  course: {
    id: string
    title: string
    slug: string
    thumbnail: string | null
    shortDesc: string | null
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

  // Lấy thông tin chứng chỉ công khai theo hash (không cần đăng nhập)
  getPublicCertificate: (hash: string) => http.get<PublicCertificateRecord>(`/certificate/public/${hash}`)
}

export default certificateApi
