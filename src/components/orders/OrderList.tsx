import React from 'react';
import Link from 'next/link';
import { Order } from '@/services/orderService';
import { OrderListItem } from './OrderListItem';

interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
}

export const OrderList: React.FC<OrderListProps> = ({ orders, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#458500]"></div>
        <p className="text-sm text-gray-500">Đang tải lịch sử đơn hàng của bạn...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl p-8 space-y-6">
        <h3 className="text-xl font-bold text-gray-800">Chưa có đơn hàng nào</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
          Bạn chưa thực hiện bất kỳ giao dịch mua sắm nào. Hãy bắt đầu chọn sản phẩm chăm sóc sức khỏe của chúng tôi.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-8 py-3 rounded-full transition-all duration-200 hover:scale-105 shadow-md shadow-emerald-500/10 text-sm"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderListItem key={order.id} order={order} />
      ))}
    </div>
  );
};
export default OrderList;
