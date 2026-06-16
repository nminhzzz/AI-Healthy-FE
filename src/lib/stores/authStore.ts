import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { User } from '@/types/user';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (token: string, user: User) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  setLoading: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null, // Mặc định không lưu JWT vào LocalStorage, nhưng persist sẽ serialize nó. Nên ta cần filter ra (dùng partialize).
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (token, user) =>
        set({ accessToken: token, user, isAuthenticated: true }),

      setAccessToken: (token) =>
        set({ accessToken: token, isAuthenticated: true }),

      logout: () =>
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        }),

      setLoading: (val) => set({ isLoading: val }),
    }),
    {
      name: 'auth-storage', // tên key trong localStorage
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
        // LƯU Ý: KHÔNG LƯU accessToken vào localStorage để chống XSS
      }),
    }
  )
);
