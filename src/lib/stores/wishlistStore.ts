import { create } from 'zustand';
import { wishlistService } from '@/services/wishlistService';

interface WishlistState {
  wishlistIds: number[];
  loading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: number) => Promise<boolean>;
  isLiked: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistIds: [],
  loading: false,

  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const data = await wishlistService.getWishlist();
      const ids = data.map((item) => item.product_id);
      set({ wishlistIds: ids });
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      set({ loading: false });
    }
  },

  toggleWishlist: async (productId: number) => {
    try {
      const res = await wishlistService.toggleWishlist(productId);
      const currentIds = get().wishlistIds;
      if (res.in_wishlist) {
        set({ wishlistIds: [...currentIds, productId] });
      } else {
        set({ wishlistIds: currentIds.filter((id) => id !== productId) });
      }
      return res.in_wishlist;
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      return false;
    }
  },

  isLiked: (productId: number) => {
    return get().wishlistIds.includes(productId);
  },

  clearWishlist: () => {
    set({ wishlistIds: [] });
  },
}));
