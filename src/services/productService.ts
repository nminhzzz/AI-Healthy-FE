import apiClient from './apiClient';
import { Product } from '@/types/product';

export const productService = {
  // Public
  getProducts: async (params?: { skip?: number; limit?: number; category_id?: number; search?: string }) => {
    const response = await apiClient.get<Product[]>('/products', { params });
    return response.data;
  },
  getProductBySlug: async (slug: string) => {
    const response = await apiClient.get<Product>(`/products/${slug}`);
    return response.data;
  },

  // Admin
  adminGetProducts: async (params?: { skip?: number; limit?: number; category_id?: number; search?: string }) => {
    const response = await apiClient.get<Product[]>('/admin/products', { params });
    return response.data;
  },
  adminCreateProduct: async (data: Partial<Product>) => {
    const response = await apiClient.post<Product>('/admin/products', data);
    return response.data;
  },
  adminUpdateProduct: async (id: number, data: Partial<Product>) => {
    const response = await apiClient.put<Product>(`/admin/products/${id}`, data);
    return response.data;
  },
  adminDeleteProduct: async (id: number) => {
    const response = await apiClient.delete(`/admin/products/${id}`);
    return response.data;
  },
};
