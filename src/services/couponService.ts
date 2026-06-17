import apiClient from './apiClient';

export interface Coupon {
  id: number;
  code: string;
  discount_amount: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export const couponService = {
  adminGetCoupons: async (skip = 0, limit = 100) => {
    const response = await apiClient.get<Coupon[]>('/admin/coupons/', { params: { skip, limit } });
    return response.data;
  },

  adminCreateCoupon: async (data: Partial<Coupon>) => {
    const response = await apiClient.post<Coupon>('/admin/coupons/', data);
    return response.data;
  },

  adminUpdateCoupon: async (id: number, data: Partial<Coupon>) => {
    const response = await apiClient.put<Coupon>(`/admin/coupons/${id}`, data);
    return response.data;
  },

  adminDeleteCoupon: async (id: number) => {
    const response = await apiClient.delete(`/admin/coupons/${id}`);
    return response.data;
  },
};

export default couponService;
