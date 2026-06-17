import apiClient from './apiClient';

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: number;
  order_code: string;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total_price: number;
  status: 'PENDING' | 'PAID' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
  note: string | null;
  receiver_name?: string;
  phone?: string;
  province?: string;
  district?: string;
  ward?: string;
  address_detail?: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderCreateInput {
  receiver_name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address_detail: string;
  note?: string;
  coupon_id?: number;
  payment_method: string;
}

export const orderService = {
  createOrder: async (input: OrderCreateInput) => {
    const response = await apiClient.post<Order>('/orders', input);
    return response.data;
  },

  getOrderHistory: async (params?: { skip?: number; limit?: number }) => {
    const response = await apiClient.get<Order[]>('/orders', { params });
    return response.data;
  },

  getOrderDetail: async (orderId: number) => {
    const response = await apiClient.get<Order>(`/orders/${orderId}`);
    return response.data;
  },

  cancelOrder: async (orderId: number) => {
    const response = await apiClient.put<Order>(`/orders/${orderId}/cancel`);
    return response.data;
  },

  adminGetOrders: async (params?: { skip?: number; limit?: number; status?: string; search?: string }) => {
    const response = await apiClient.get<Order[]>('/admin/orders/', { params });
    return response.data;
  },

  adminGetOrderDetail: async (orderId: number) => {
    const response = await apiClient.get<Order>(`/admin/orders/${orderId}`);
    return response.data;
  },

  adminUpdateOrderStatus: async (orderId: number, status: string) => {
    const response = await apiClient.put<Order>(`/admin/orders/${orderId}/status`, null, {
      params: { new_status: status },
    });
    return response.data;
  },
};
export default orderService;
