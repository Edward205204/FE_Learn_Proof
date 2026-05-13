import http from '@/utils/http'

export interface CreatePaymentResponse {
  paymentUrl: string
  txnRef: string
  totalAmount: number
  courseIds: string[]
}

export interface Transaction {
  id: string
  amount: number
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  provider: string
  txnRef: string
  vnpTxnNo: string | null
  payDate: string | null
  createdAt: string
  course: {
    title: string
    thumbnail: string | null
  }
}

export const paymentApi = {
  createPayment: (courseIds: string[]) =>
    http.post<CreatePaymentResponse>('/payment/vnpay/create-payment', { courseIds }),
  createPaymentFromCart: () => http.post<CreatePaymentResponse>('/payment/vnpay/create-payment-from-cart'),
  getHistory: () => http.get<Transaction[]>('/payment/history')
}

export default paymentApi
