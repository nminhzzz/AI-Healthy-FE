'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { emoji: '💊', name: 'Vitamin & Khoáng chất', href: '/category/vitamin-khoang-chat' },
  { emoji: '🧬', name: 'Thực phẩm chức năng', href: '/category/thuc-pham-chuc-nang' },
  { emoji: '💪', name: 'Protein & Gym', href: '/category/protein-gym' },
  { emoji: '✨', name: 'Chăm sóc da', href: '/category/cham-soc-da' },
  { emoji: '🩺', name: 'Thiết bị y tế', href: '/category/thiet-bi-y-te' },
  { emoji: '👶', name: 'Mẹ & Bé', href: '/category/me-va-be' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] flex w-80 max-w-[85vw] flex-col border-r border-slate-700/50 bg-slate-800/95 backdrop-blur-xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-700/50 px-5">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-lg font-bold text-transparent">
              HealthShop AI
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
            aria-label="Đóng menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search (mobile) */}
        <div className="border-b border-slate-700/50 p-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full rounded-xl border border-slate-600/50 bg-slate-700/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-400 outline-none transition-all focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Category list */}
        <nav className="flex-1 overflow-y-auto p-3">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Danh mục sản phẩm
          </p>
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.href}>
                <Link
                  href={cat.href}
                  onClick={onClose}
                  className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:translate-x-1 hover:bg-emerald-500/10 hover:text-emerald-400"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/50 text-lg transition-colors group-hover:bg-emerald-500/20">
                    {cat.emoji}
                  </span>
                  <span>{cat.name}</span>
                  <svg
                    className="ml-auto h-4 w-4 text-slate-600 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-slate-700/50 p-4">
          <Link
            href="/login"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-emerald-500/30"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            Đăng nhập / Đăng ký
          </Link>
        </div>
      </aside>
    </>
  );
}
