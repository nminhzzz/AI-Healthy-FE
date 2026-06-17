'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { Order, orderService } from '@/services/orderService';
import { OrderDetailItems } from '@/components/orders/OrderDetailItems';
import { OrderDetailSummary } from '@/components/orders/OrderDetailSummary';
import { OrderDetailActions } from '@/components/orders/OrderDetailActions';
import Link from 'next/link';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  
  const orderId = Number(params.id);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && orderId) {
      setLoading(true);
      setError('');
      orderService.getOrderDetail(orderId)
        .then((data) => {
          setOrder(data);
        })
        .catch((err) => {
          console.error('Lỗi khi tải chi tiết đơn hàng:', err);
          setError('Không tìm thấy đơn hàng hoặc bạn không có quyền xem đơn hàng này.');
        })
        .finally(() => setLoading(false));
    } else if (!authLoading && !isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, orderId, authLoading]);

  const handleStatusUpdated = (updatedOrder: Order) => {
    setOrder(updatedOrder);
  };

  if (authLoading || (loading && !error)) {
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
          Vui lòng đăng nhập tài khoản để có thể xem chi tiết đơn hàng.
        </p>
        <button
          onClick={() => router.push(`/login?redirect=/orders/${orderId}`)}
          className="block w-full bg-[#458500] hover:bg-[#386b00] text-white font-bold py-3 rounded-full transition-colors text-sm"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center space-y-6 min-h-[60vh]">
        <h3 className="text-xl font-bold text-gray-805">Có lỗi xảy ra</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          {error || 'Đơn hàng không khả dụng.'}
        </p>
        <Link
          href="/orders"
          className="block w-full bg-[#458500] hover:bg-[#386b00] text-white font-bold py-3 rounded-full transition-colors text-sm"
        >
          Quay lại Lịch sử đơn hàng
        </Link>
      </div>
    );
  }

  const getTimelineStepClass = (currentStatus: Order['status'], stepStatus: Order['status'][]) => {
    const isCompleted = stepStatus.includes(currentStatus);
    if (isCompleted) {
      return 'bg-emerald-500 text-white ring-4 ring-emerald-100';
    }
    return 'bg-gray-200 text-gray-400';
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl min-h-[70vh]">
      {/* Header back button */}
      <div className="mb-8">
        <Link
          href="/orders"
          className="inline-flex items-center text-sm text-[#458500] hover:text-[#386b00] font-bold gap-1"
        >
          Quay lại lịch sử đơn hàng
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-4">
        <div>
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Chi tiết đơn hàng</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 font-mono mt-1">
            {order.order_code}
          </h1>
        </div>
        <div className="text-left md:text-right">
          <span className="text-xs text-gray-400 block">Ngày đặt hàng</span>
          <span className="text-sm font-bold text-gray-700">
            {new Date(order.created_at).toLocaleString('vi-VN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      {/* Progress timeline */}
      {order.status !== 'CANCELLED' && (
        <div className="bg-white rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider">Hành trình đơn hàng</h3>
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4">
            {/* Background line for desktop */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 hidden md:block z-0"></div>

            {/* Step 1: PENDING */}
            <div className="flex items-center md:flex-col gap-4 md:gap-2 z-10 bg-white md:px-4">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getTimelineStepClass(order.status, ['PENDING', 'PAID', 'SHIPPING', 'COMPLETED'])}`}>
                1
              </span>
              <div className="text-left md:text-center">
                <span className="text-xs font-bold text-gray-800 block">Chờ duyệt</span>
                <span className="text-[10px] text-gray-400">Đơn hàng đã được tạo</span>
              </div>
            </div>

            {/* Step 2: PAID */}
            <div className="flex items-center md:flex-col gap-4 md:gap-2 z-10 bg-white md:px-4">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getTimelineStepClass(order.status, ['PAID', 'SHIPPING', 'COMPLETED'])}`}>
                2
              </span>
              <div className="text-left md:text-center">
                <span className="text-xs font-bold text-gray-800 block">Đã thanh toán / Xác nhận</span>
                <span className="text-[10px] text-gray-400">Chuẩn bị bàn giao vận chuyển</span>
              </div>
            </div>

            {/* Step 3: SHIPPING */}
            <div className="flex items-center md:flex-col gap-4 md:gap-2 z-10 bg-white md:px-4">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getTimelineStepClass(order.status, ['SHIPPING', 'COMPLETED'])}`}>
                3
              </span>
              <div className="text-left md:text-center">
                <span className="text-xs font-bold text-gray-800 block">Đang giao hàng</span>
                <span className="text-[10px] text-gray-400">Shipper đang trên đường giao</span>
              </div>
            </div>

            {/* Step 4: COMPLETED */}
            <div className="flex items-center md:flex-col gap-4 md:gap-2 z-10 bg-white md:px-4">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getTimelineStepClass(order.status, ['COMPLETED'])}`}>
                4
              </span>
              <div className="text-left md:text-center">
                <span className="text-xs font-bold text-gray-800 block">Hoàn thành</span>
                <span className="text-[10px] text-gray-400">Giao hàng thành công</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: items */}
        <div className="lg:col-span-2">
          <OrderDetailItems items={order.items} />
        </div>

        {/* Right Column: summary & actions */}
        <div className="lg:col-span-1 space-y-6">
          <OrderDetailSummary order={order} />
          <OrderDetailActions order={order} onStatusUpdated={handleStatusUpdated} />
        </div>
      </div>
    </div>
  );
}
