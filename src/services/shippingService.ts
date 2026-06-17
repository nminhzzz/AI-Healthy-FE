import apiClient from './apiClient';

export interface ShippingAddress {
  id: number;
  user_id: number;
  receiver_name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address_detail: string;
  is_default: boolean;
  created_at: string;
}

export interface ShippingAddressCreateInput {
  receiver_name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address_detail: string;
  is_default?: boolean;
}

export const shippingService = {
  getAddresses: async () => {
    const response = await apiClient.get<ShippingAddress[]>('/shipping/');
    return response.data;
  },

  createAddress: async (data: ShippingAddressCreateInput) => {
    const response = await apiClient.post<ShippingAddress>('/shipping/', data);
    return response.data;
  },

  updateAddress: async (id: number, data: Partial<ShippingAddressCreateInput>) => {
    const response = await apiClient.put<ShippingAddress>(`/shipping/${id}`, data);
    return response.data;
  },

  deleteAddress: async (id: number) => {
    const response = await apiClient.delete(`/shipping/${id}`);
    return response.data;
  },

  setDefaultAddress: async (id: number) => {
    const response = await apiClient.put<ShippingAddress>(`/shipping/${id}/default`);
    return response.data;
  },
};

export default shippingService;
