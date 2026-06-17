import React from 'react';
import Link from 'next/link';
import { Order } from '@/services/orderService';

interface OrderListItemProps {
  order: Order;
}

export const OrderListItem: React.FC<OrderListItemProps> = ({ order }) => {
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
            Chờ duyệt
          </span>
        );
      case 'PAID':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
            Đã thanh toán
          </span>
        );
      case 'SHIPPING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
            Đang giao hàng
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
            Thành công
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="bg-slate-50 p-5 hover:bg-slate-100/70 rounded-2xl transition-all space-y-4">
      {/* Header order item */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Mã đơn hàng</span>
          <h4 className="font-extrabold text-gray-800 text-sm font-mono">{order.order_code}</h4>
        </div>
        <div>{getStatusBadge(order.status)}</div>
      </div>

      {/* Body order item */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            <strong>Ngày đặt:</strong> {formatDate(order.created_at)}
          </p>
          <div className="text-xs text-gray-600 line-clamp-1 max-w-xl">
            <strong>Sản phẩm:</strong>{' '}
            {order.items.map((item) => `${item.product_name} (x${item.quantity})`).join(', ')}
          </div>
        </div>

        {/* Financials & Action */}
        <div className="flex items-center justify-between md:justify-end gap-6 flex-shrink-0">
          <div className="text-right">
            <span className="text-xs text-gray-400 block">Tổng thanh toán</span>
            <span className="font-black text-[#f36b21] text-lg">
              {order.total_price.toLocaleString('vi-VN')}₫
            </span>
          </div>

          <Link
            href={`/orders/${order.id}`}
            className="bg-white hover:bg-slate-50 text-[#458500] hover:text-[#386b00] font-bold px-5 py-2.5 rounded-full transition-all text-xs active:scale-95"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};
export default OrderListItem;
