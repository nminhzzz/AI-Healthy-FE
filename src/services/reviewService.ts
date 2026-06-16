import apiClient from './apiClient';
import { Review } from '@/types/product';

export const reviewService = {
  getReviewsByProduct: async (productId: number, skip = 0, limit = 100) => {
    const response = await apiClient.get<Review[]>(`/reviews/product/${productId}`, { params: { skip, limit } });
    return response.data;
  },
  createReview: async (productId: number, rating: number, comment: string) => {
    const response = await apiClient.post<Review>('/reviews', { product_id: productId, rating, comment });
    return response.data;
  },
};
