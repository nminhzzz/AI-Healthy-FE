'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { Order, orderService } from '@/services/orderService';
import { OrderList } from '@/components/orders/OrderList';
import Link from 'next/link';

export default function OrderHistoryPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      setError('');
      orderService.getOrderHistory()
        .then((data) => {
          // Sắp xếp đơn hàng mới nhất lên đầu
          const sorted = data.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setOrders(sorted);
        })
        .catch((err) => {
          console.error('Lỗi khi lấy lịch sử đơn hàng:', err);
          setError('Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-7xl min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#458500]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center space-y-6 min-h-[60vh]">
        <h3 className="text-xl font-bold text-gray-800">Yêu cầu đăng nhập</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Vui lòng đăng nhập tài khoản để có thể truy cập và quản lý lịch sử đơn hàng của bạn.
        </p>
        <Link
          href="/login?redirect=/orders"
          className="block w-full bg-[#458500] hover:bg-[#386b00] text-white font-bold py-3 rounded-full transition-colors text-sm"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[60vh]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-[#458500]">Đơn hàng của bạn</h1>
        <Link
          href="/products"
          className="text-xs text-[#458500] hover:text-[#386b00] font-bold hover:underline"
        >
          Tiếp tục mua hàng
        </Link>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          ⚠️ {error}
        </div>
      ) : (
        <OrderList orders={orders} isLoading={loading} />
      )}
    </div>
  );
}
