'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/stores/cartStore';
import { useAuthStore } from '@/lib/stores/authStore';
import Sidebar from './Sidebar';

import { logout as apiLogout } from '@/services/authService';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems);
  const { user, isAuthenticated, logout: storeLogout } = useAuthStore();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // Gọi API để server xóa HttpOnly Cookie và chặn Token trong Redis
      await apiLogout();
    } catch (e) {
      console.error('Logout failed on server', e);
    } finally {
      // Xóa trong RAM (Zustand)
      storeLogout();
      setUserMenuOpen(false);
      router.push('/login');
    }
  };

  const itemCount = typeof totalItems === 'function' ? totalItems() : totalItems;

  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : null;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-md shadow-lg shadow-black/20">
        {/* Gradient accent line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left — Hamburger + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              aria-label="Mở menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2">
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">🌿</span>
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                HealthShop AI
              </span>
            </Link>
          </div>

          {/* Center — Search bar (hidden on mobile) */}
          <div className="hidden flex-1 px-8 md:block lg:px-16">
            <div className="relative mx-auto max-w-xl">
              {/* Magnifying glass icon */}
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full rounded-full border border-slate-700/60 bg-slate-800/60 py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-400 outline-none transition-all duration-300 focus:border-emerald-500/50 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Right — Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile search toggle */}
            <button className="md:hidden rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative rounded-lg p-2 text-slate-300 transition-all duration-200 hover:bg-slate-800 hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-emerald-500/30">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* User */}
            {isAuthenticated && initials ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-transform duration-200 hover:scale-105"
                >
                  {initials}
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-700 bg-slate-800 py-1 shadow-xl shadow-black/40 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-3 border-b border-slate-700/50">
                      <p className="text-sm font-medium text-white truncate">{user?.full_name || 'Khách hàng'}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      >
                        Thông tin tài khoản
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      >
                        Đơn hàng của tôi
                      </Link>
                      
                      {user?.role === 'ADMIN' && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-slate-700 hover:text-emerald-300 transition-colors"
                        >
                          Trang quản trị (Admin)
                        </Link>
                      )}
                    </div>
                    
                    <div className="border-t border-slate-700/50 py-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105 hover:shadow-emerald-500/40 sm:inline-flex"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
