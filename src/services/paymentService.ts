import apiClient from './apiClient';

export interface PaymentCreateInput {
  order_id: number;
  provider: 'VNPAY' | 'MOMO' | 'STRIPE';
}

export interface PaymentResponse {
  id: number;
  order_id: number;
  provider: string;
  transaction_id: string | null;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  paid_at: string | null;
  created_at: string;
  payment_url: string | null;
}

export const paymentService = {
  createPaymentUrl: async (orderId: number, provider: 'VNPAY' | 'MOMO' | 'STRIPE' = 'VNPAY') => {
    const response = await apiClient.post<PaymentResponse>('/payments', {
      order_id: orderId,
      provider,
    });
    return response.data;
  },

  updatePaymentStatus: async (orderCode: string, paymentId: number, status: 'success' | 'failed') => {
    const response = await apiClient.get('/payments/callback', {
      params: {
        order_code: orderCode,
        payment_id: paymentId,
        status_str: status,
      },
    });
    return response.data;
  },
};
export default paymentService;
