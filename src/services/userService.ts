import apiClient from './apiClient';
import { User } from '@/types/user';

export const userService = {
  // Admin User CRUD
  getUsers: async (skip = 0, limit = 100) => {
    const response = await apiClient.get<User[]>('/admin/users', { params: { skip, limit } });
    return response.data;
  },

  adminCreateUser: async (data: Partial<User> & { password?: string }) => {
    const response = await apiClient.post<User>('/admin/users', data);
    return response.data;
  },

  adminUpdateUser: async (id: number, data: Partial<User> & { password?: string }) => {
    const response = await apiClient.put<User>(`/admin/users/${id}`, data);
    return response.data;
  },

  adminDeleteUser: async (id: number) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
  },
};
