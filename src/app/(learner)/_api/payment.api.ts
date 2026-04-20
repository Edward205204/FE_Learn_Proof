import http from '@/utils/http'

export interface CreatePaymentResponse {
  paymentUrl: string
  txnRef: string
  totalAmount: number
  courseIds: string[]
}

export const paymentApi = {
  createPayment: (courseIds: string[]) => http.post<CreatePaymentResponse>('/payment/vnpay/create-payment', { courseIds }),
  createPaymentFromCart: () => http.post<CreatePaymentResponse>('/payment/vnpay/create-payment-from-cart')
}

export default paymentApi
