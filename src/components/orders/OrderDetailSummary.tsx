import React from 'react';
import { Order } from '@/services/orderService';

interface OrderDetailSummaryProps {
  order: Order;
}

export const OrderDetailSummary: React.FC<OrderDetailSummaryProps> = ({ order }) => {
  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return { text: 'Chờ duyệt', color: 'text-amber-700 bg-amber-50' };
      case 'PAID':
        return { text: 'Đã thanh toán', color: 'text-blue-700 bg-blue-50' };
      case 'SHIPPING':
        return { text: 'Đang giao hàng', color: 'text-purple-700 bg-purple-50' };
      case 'COMPLETED':
        return { text: 'Giao hàng thành công', color: 'text-emerald-700 bg-emerald-50' };
      case 'CANCELLED':
        return { text: 'Đã hủy đơn', color: 'text-rose-700 bg-rose-50' };
      default:
        return { text: status, color: 'text-gray-700 bg-gray-50' };
    }
  };

  const statusLabel = getStatusLabel(order.status);
  
  // Extend Order type safety by matching optional backend properties mapped to fields
  const receiverName = (order as any).receiver_name || 'N/A';
  const phone = (order as any).phone || 'N/A';
  const address = [
    (order as any).address_detail,
    (order as any).ward,
    (order as any).district,
    (order as any).province
  ].filter(Boolean).join(', ') || 'N/A';
  
  const paymentMethod = (order as any).payment_method || 'COD';

  return (
    <div className="bg-white rounded-2xl p-6 space-y-6">
      <h3 className="text-lg font-bold text-gray-800 pb-3">
        Thông tin đơn hàng
      </h3>

      {/* Status */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 font-medium">Trạng thái:</span>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusLabel.color}`}>
          {statusLabel.text}
        </span>
      </div>

      {/* Receiver info */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thông tin giao nhận</h4>
        <div className="text-sm space-y-2 text-gray-600 bg-slate-50 p-4 rounded-xl">
          <p>
            <strong>Người nhận:</strong> {receiverName}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {phone}
          </p>
          <p className="leading-relaxed">
            <strong>Địa chỉ giao hàng:</strong> {address}
          </p>
          {order.note && (
            <p className="italic text-xs text-gray-400 mt-1">
              * Ghi chú: "{order.note}"
            </p>
          )}
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phương thức thanh toán</h4>
        <div className="text-sm font-semibold text-gray-700 bg-slate-50 px-4 py-3 rounded-xl flex items-center justify-between">
          <span>{paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : `Thanh toán Online (${paymentMethod})`}</span>
        </div>
      </div>

      {/* Order Summary calculations */}
      <div className="pt-2 space-y-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chi tiết thanh toán</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Tạm tính hàng hóa:</span>
            <span className="font-semibold text-gray-800">{order.subtotal.toLocaleString('vi-VN')}₫</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Mã giảm giá:</span>
              <span className="font-semibold">-{order.discount_amount.toLocaleString('vi-VN')}₫</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Phí vận chuyển:</span>
            <span className="font-semibold text-gray-800">
              {order.shipping_fee === 0 ? 'Miễn phí' : `${order.shipping_fee.toLocaleString('vi-VN')}₫`}
            </span>
          </div>
        </div>

        <div className="pt-3 flex justify-between items-end">
          <span className="text-sm font-bold text-gray-700">Tổng cộng:</span>
          <span className="text-2xl font-black text-[#f36b21]">{order.total_price.toLocaleString('vi-VN')}₫</span>
        </div>
      </div>
    </div>
  );
};
export default OrderDetailSummary;
