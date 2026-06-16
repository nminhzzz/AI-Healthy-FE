'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const AdminSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Danh mục', href: '/admin/categories', icon: '📁' },
    { name: 'Sản phẩm & Kho', href: '/admin/products', icon: '📦' },
    { name: 'Đơn hàng', href: '/admin/orders', icon: '🛒' },
    { name: 'Khách hàng', href: '/admin/users', icon: '👥' },
    { name: 'Mã giảm giá', href: '/admin/coupons', icon: '🎟️' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col shadow-xl">
      <div className="p-6 border-b border-slate-700">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl transition-transform group-hover:scale-110">🌿</span>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Admin Panel
          </span>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-emerald-600 text-white font-medium shadow-md shadow-emerald-900/50' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-500 text-center">
          HealthShop AI © 2026
        </div>
      </div>
    </aside>
  );
};
