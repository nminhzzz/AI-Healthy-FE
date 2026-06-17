'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { refreshToken, getMe } from '@/services/authService';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    setMounted(true);
    
    const initializeAuth = async () => {
      try {
        console.log("[AuthProvider] Calling refreshToken...");
        const data = await refreshToken();
        console.log("[AuthProvider] Got new token:", data.access_token ? "YES" : "NO");
        
        useAuthStore.getState().setAccessToken(data.access_token);
        
        console.log("[AuthProvider] Fetching user profile...");
        const userData = await getMe();
        console.log("[AuthProvider] User profile loaded:", userData.email);
        
        setAuth(data.access_token, userData);
        
        // Fetch wishlist items on startup
        try {
          const { useWishlistStore } = await import('@/lib/stores/wishlistStore');
          await useWishlistStore.getState().fetchWishlist();
        } catch (wishErr) {
          console.error("[AuthProvider] Failed to fetch wishlist:", wishErr);
        }
      } catch (error: any) {
        console.error("[AuthProvider] Failed to initialize session:", error?.response?.data || error.message);
        // Quan trọng: Nếu refresh thất bại, phải xóa sạch rác trong Zustand (đã bị persist từ phiên trước)
        logout();
        try {
          const { useWishlistStore } = await import('@/lib/stores/wishlistStore');
          useWishlistStore.getState().clearWishlist();
        } catch {}
      }
    };

    initializeAuth();
  }, [setAuth, logout]);

  // Giải quyết lỗi Hydration Mismatch của Next.js khi dùng LocalStorage
  if (!mounted) {
    return null; // Chờ cho đến khi client mount xong thì mới render cây children
  }

  return <>{children}</>;
}
