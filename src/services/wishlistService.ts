import apiClient from './apiClient';
import { Product } from '@/types/product';

export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  product: Product;
}

export interface WishlistToggleResponse {
  product_id: number;
  in_wishlist: boolean;
  message: string;
}

export const wishlistService = {
  getWishlist: async () => {
    const response = await apiClient.get<WishlistItem[]>('/wishlist/');
    return response.data;
  },

  toggleWishlist: async (productId: number) => {
    const response = await apiClient.post<WishlistToggleResponse>(`/wishlist/toggle/${productId}`);
    return response.data;
  },
};

export default wishlistService;
