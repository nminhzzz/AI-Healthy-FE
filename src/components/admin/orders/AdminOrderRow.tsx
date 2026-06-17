import React from 'react';
import { Order } from '@/services/orderService';

interface AdminOrderRowProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

const statusBadgeClasses: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  PAID: 'bg-blue-100 text-blue-800',
  SHIPPING: 'bg-indigo-100 text-indigo-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-rose-100 text-rose-800',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Chờ duyệt',
  PAID: 'Đã thanh toán',
  SHIPPING: 'Đang giao hàng',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

export const AdminOrderRow: React.FC<AdminOrderRowProps> = ({
  order,
  onViewDetails,
}) => {
  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
        {order.order_code}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {formatDate(order.created_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
        <div className="font-medium">{order.receiver_name || 'Khách vãng lai'}</div>
        <div className="text-xs text-slate-500">{order.phone || 'N/A'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold">
        {formatVND(order.total_price)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        <span className="bg-slate-100 px-2 py-1 rounded text-xs">
          {order.payment_method}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadgeClasses[order.status] || 'bg-slate-100 text-slate-800'}`}>
          {statusLabels[order.status] || order.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
        <button
          onClick={() => onViewDetails(order)}
          className="bg-slate-200 text-slate-800 hover:bg-slate-300 font-medium py-1.5 px-3 rounded-md transition-colors cursor-pointer"
        >
          Chi tiết
        </button>
      </td>
    </tr>
  );
};
