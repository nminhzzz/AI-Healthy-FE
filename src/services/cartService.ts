import apiClient from './apiClient';
import { Product } from '@/types/product';

export interface CartItemDetail {
  product_id: number;
  quantity: number;
  product: Product;
}

export interface CartResponse {
  items: CartItemDetail[];
  total_price: number;
}

export const cartService = {
  getCart: async () => {
    const response = await apiClient.get<CartResponse>('/cart');
    return response.data;
  },

  addToCart: async (productId: number, quantity: number) => {
    const response = await apiClient.post('/cart/items', {
      product_id: productId,
      quantity,
    });
    return response.data;
  },

  updateCartQty: async (productId: number, quantity: number) => {
    const response = await apiClient.put('/cart/items', {
      product_id: productId,
      quantity,
    });
    return response.data;
  },

  removeFromCart: async (productId: number) => {
    const response = await apiClient.delete(`/cart/items/${productId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await apiClient.delete('/cart');
    return response.data;
  },

  syncCart: async (items: { product_id: number; quantity: number }[]) => {
    const response = await apiClient.post('/cart/sync', items);
    return response.data;
  },
};
export default cartService;
