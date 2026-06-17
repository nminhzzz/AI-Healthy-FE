import React from 'react';
import { Order } from '@/services/orderService';
import { AdminOrderRow } from './AdminOrderRow';

interface AdminOrderListProps {
  orders: Order[];
  loading: boolean;
  onViewDetails: (order: Order) => void;
  page: number;
  onPageChange: (newPage: number) => void;
  hasMore: boolean;
}

export const AdminOrderList: React.FC<AdminOrderListProps> = ({
  orders,
  loading,
  onViewDetails,
  page,
  onPageChange,
  hasMore,
}) => {
  if (loading) {
    return (
      <div className="bg-slate-100 p-8 text-center text-slate-500 rounded-lg">
        Đang tải danh sách đơn hàng...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-slate-100 p-8 text-center text-slate-500 rounded-lg">
        Không tìm thấy đơn hàng nào phù hợp.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bảng dữ liệu phẳng, không viền */}
      <div className="bg-white rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-3">Mã đơn</th>
              <th className="px-6 py-3">Ngày đặt</th>
              <th className="px-6 py-3">Khách hàng</th>
              <th className="px-6 py-3">Tổng tiền</th>
              <th className="px-6 py-3">Thanh toán</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {orders.map((order) => (
              <AdminOrderRow
                key={order.id}
                order={order}
                onViewDetails={onViewDetails}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Điều hướng phân trang phẳng */}
      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
        <div className="text-sm text-slate-500">
          Trang {page}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer ${
              page <= 1
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            Trang trước
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={!hasMore}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer ${
              !hasMore
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
};
