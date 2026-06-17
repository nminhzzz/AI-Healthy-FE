'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/stores/cartStore';
import { useAuthStore } from '@/lib/stores/authStore';
import Sidebar from './Sidebar';
import { logout as apiLogout } from '@/services/authService';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const totalItems = useCartStore((s) => s.totalItems);
  const { user, isAuthenticated, logout: storeLogout } = useAuthStore();

  const addedTrigger = useCartStore((s) => s.addedTrigger);
  const lastAddedQty = useCartStore((s) => s.lastAddedQty);
  const [showPlusOne, setShowPlusOne] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);

  useEffect(() => {
    if (addedTrigger > 0) {
      setShowPlusOne(true);
      setAnimateCart(true);

      const timer1 = setTimeout(() => setShowPlusOne(false), 1000);
      const timer2 = setTimeout(() => setAnimateCart(false), 500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [addedTrigger]);
  const router = useRouter();
  const pathname = usePathname();
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

  // Đồng bộ từ khóa tìm kiếm từ URL (chỉ chạy ở phía client)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const searchParam = params.get('search');
      if (searchParam) {
        setSearchQuery(searchParam);
      } else {
        setSearchQuery('');
      }
    }
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      console.error('Logout failed on server', e);
    } finally {
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
      <nav className="sticky top-0 z-50 w-full bg-white backdrop-blur-md shadow-sm">
        
        {/* Topbar: Promos (iHerb Style) */}
        <div className="bg-slate-50 text-xs py-2 px-4">
          <div className="mx-auto max-w-7xl flex justify-between items-center text-slate-655 text-slate-600">
            <div className="flex items-center gap-4">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                Khuyến mãi hè: Giảm giá lên đến 20%
              </span>
              <span className="hidden md:inline">|</span>
              <span className="hidden md:inline">Miễn phí vận chuyển toàn quốc từ 500k</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/chat" className="text-emerald-700 font-semibold hover:text-emerald-600 transition-colors flex items-center gap-1">
                Tư vấn sức khỏe bằng AI (Miễn phí)
              </Link>
            </div>
          </div>
        </div>

        {/* Main Bar */}
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left — Hamburger + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
              aria-label="Mở menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-xl font-black tracking-tight text-transparent">
                HealthShop AI
              </span>
            </Link>
          </div>

          {/* Center — Search bar (iHerb Style) */}
          <div className="hidden flex-1 px-8 md:block lg:px-16">
            <form onSubmit={handleSearchSubmit} className="relative mx-auto max-w-xl">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm thực phẩm chức năng, thương hiệu, thành phần..."
                className="w-full rounded-full bg-slate-100 py-2.5 pl-11 pr-24 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-slate-100 focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
              />
              <button
                type="submit"
                className="absolute inset-y-1.5 right-1.5 flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white px-5 transition-all duration-200 active:scale-95 shadow-sm"
              >
                Tìm kiếm
              </button>
            </form>
          </div>

          {/* Right — Actions */}
          <div className="flex items-center gap-4">
            
            {/* AI Assistant Button - Glowing call-to-action */}
            <Link
              href="/chat"
              className="relative hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold py-2.5 px-5 rounded-full transition-all duration-300 shadow-md shadow-emerald-500/10 hover:scale-105"
            >
              TƯ VẤN AI
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className={`relative rounded-lg p-2 text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-800 ${
                animateCart ? 'animate-bounce scale-110 text-emerald-600' : ''
              }`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f36b21] px-1 text-[10px] font-black text-white shadow-lg shadow-[#f36b21]/30">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
              {showPlusOne && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-black text-[#f36b21] animate-ping z-30 font-mono">
                  +{lastAddedQty}
                </span>
              )}
            </Link>

            {/* User Account */}
            {isAuthenticated && initials ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-transform duration-200 hover:scale-105"
                >
                  {initials}
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white py-1 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-800 truncate">{user?.full_name || 'Khách hàng'}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                      >
                        Thông tin tài khoản
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                      >
                        Đơn hàng của tôi
                      </Link>
                      
                      {user?.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                        >
                          Trang quản trị (Admin)
                        </Link>
                      )}
                    </div>
                    
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-slate-50 hover:text-red-600 transition-colors"
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
                className="hidden rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2 text-sm font-semibold transition-all duration-200 sm:inline-flex"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>

        {/* Sub Bar (Categories & Brand links) */}
        <div className="bg-slate-50 backdrop-blur-sm hidden lg:block shadow-inner">
          <div className="mx-auto max-w-7xl px-8 py-3 flex gap-8 text-sm font-medium text-slate-600">
            <Link href="/products" className={`hover:text-emerald-650 hover:text-emerald-750 transition-colors ${pathname === '/products' ? 'text-emerald-700 font-bold' : ''}`}>
              Tất cả Sản phẩm
            </Link>
            <Link href="/chat" className={`hover:text-emerald-650 hover:text-emerald-750 transition-colors ${pathname === '/chat' ? 'text-emerald-700 font-bold' : ''}`}>
              Bác sĩ AI Tư vấn
            </Link>
            <Link href="/#super-deals" className="hover:text-emerald-650 hover:text-emerald-750 transition-colors">
              Khuyến Mãi Cực Sốc
            </Link>
            <Link href="/#best-sellers" className="hover:text-emerald-650 hover:text-emerald-750 transition-colors">
              Sản Phẩm Bán Chạy
            </Link>
            <Link href="/#ai-recommendations" className="hover:text-emerald-650 hover:text-emerald-750 transition-colors">
              Đề Xuất Bởi AI
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
