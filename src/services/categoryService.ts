import apiClient from './apiClient';
import { Category } from '@/types/product';

export const categoryService = {
  // Public
  getCategories: async (skip = 0, limit = 100) => {
    const response = await apiClient.get<Category[]>('/categories', { params: { skip, limit } });
    return response.data;
  },
  getCategoryBySlug: async (slug: string) => {
    const response = await apiClient.get<Category>(`/categories/${slug}`);
    return response.data;
  },

  // Admin
  adminCreateCategory: async (data: Partial<Category>) => {
    const response = await apiClient.post<Category>('/admin/categories', data);
    return response.data;
  },
  adminUpdateCategory: async (id: number, data: Partial<Category>) => {
    const response = await apiClient.put<Category>(`/admin/categories/${id}`, data);
    return response.data;
  },
  adminDeleteCategory: async (id: number) => {
    const response = await apiClient.delete(`/admin/categories/${id}`);
    return response.data;
  },
};
