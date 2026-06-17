import React, { useState } from 'react';
import { Order } from '@/services/orderService';

interface AdminOrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onStatusUpdate: (orderId: number, newStatus: string) => Promise<void>;
}

const statusOptions = [
  { value: 'PENDING', label: 'Chờ duyệt (PENDING)' },
  { value: 'PAID', label: 'Đã thanh toán (PAID)' },
  { value: 'SHIPPING', label: 'Đang giao hàng (SHIPPING)' },
  { value: 'COMPLETED', label: 'Hoàn thành (COMPLETED)' },
  { value: 'CANCELLED', label: 'Hủy đơn (CANCELLED)' },
];

export const AdminOrderDetailModal: React.FC<AdminOrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  onStatusUpdate,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [updating, setUpdating] = useState(false);

  React.useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const handleStatusChangeSubmit = async () => {
    if (selectedStatus === order.status) return;
    setUpdating(true);
    try {
      await onStatusUpdate(order.id, selectedStatus);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || 'Lỗi khi cập nhật trạng thái đơn hàng');
    } finally {
      setUpdating(false);
    }
  };

  const isFinalState = order.status === 'COMPLETED' || order.status === 'CANCELLED';

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header - Flat, no border */}
        <div className="flex justify-between items-center mb-6 bg-slate-50 p-4 rounded-lg">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Chi tiết đơn hàng: {order.order_code}
            </h2>
            <div className="text-xs text-slate-500 mt-1">
              ID: {order.id} | Ngày tạo: {new Date(order.created_at).toLocaleString('vi-VN')}
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-1.5 px-4 rounded-md transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: Customer & Shipping Address */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-slate-50 p-5 rounded-lg">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                Thông tin người nhận
              </h3>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="grid grid-cols-3">
                  <span className="text-slate-500">Họ và tên:</span>
                  <span className="col-span-2 font-medium">{order.receiver_name || 'Không rõ'}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-500">Số điện thoại:</span>
                  <span className="col-span-2 font-medium">{order.phone || 'Không rõ'}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-500">Địa chỉ:</span>
                  <span className="col-span-2 font-medium">
                    {order.address_detail}, {order.ward}, {order.district}, {order.province}
                  </span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-500">Ghi chú:</span>
                  <span className="col-span-2 font-medium italic text-slate-600">
                    {order.note || 'Không có ghi chú'}
                  </span>
                </div>
              </div>
            </div>

            {/* Product items table */}
            <div className="bg-slate-50 p-5 rounded-lg">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                Sản phẩm đặt mua
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 text-left">
                  <thead>
                    <tr className="bg-slate-200/50 text-slate-700 text-xs uppercase font-bold">
                      <th className="px-4 py-2.5">Tên sản phẩm</th>
                      <th className="px-4 py-2.5 text-right">Đơn giá</th>
                      <th className="px-4 py-2.5 text-center">SL</th>
                      <th className="px-4 py-2.5 text-right">Tổng cộng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {order.items.map((item) => (
                      <tr key={item.id} className="text-slate-700">
                        <td className="px-4 py-3 font-medium">{item.product_name}</td>
                        <td className="px-4 py-3 text-right">{formatVND(item.unit_price)}</td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {formatVND(item.total_price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Column 2: Status update & Totals summary */}
          <div className="space-y-4">
            
            {/* Status change actions */}
            <div className="bg-slate-50 p-5 rounded-lg">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                Trạng thái & Xử lý
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Trạng thái hiện tại:</div>
                  <span className="bg-slate-200 text-slate-800 font-semibold text-sm px-3 py-1.5 rounded-full inline-block">
                    {order.status}
                  </span>
                </div>

                {!isFinalState ? (
                  <div className="space-y-3 pt-2">
                    <div className="text-xs text-slate-500">Thay đổi trạng thái:</div>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full bg-white text-slate-800 py-2 px-3 rounded-md outline-none border-none focus:bg-slate-100 transition-colors"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleStatusChangeSubmit}
                      disabled={updating || selectedStatus === order.status}
                      className={`w-full py-2 px-4 rounded-md font-semibold text-center text-sm transition-colors cursor-pointer ${
                        selectedStatus === order.status
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      {updating ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-200 text-slate-600 p-3 rounded text-xs">
                    Đơn hàng đã ở trạng thái cuối cùng ({order.status}). Không thể chỉnh sửa thêm.
                  </div>
                )}
              </div>
            </div>

            {/* Totals Summary */}
            <div className="bg-slate-50 p-5 rounded-lg space-y-3 text-sm text-slate-700">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">
                Tóm tắt thanh toán
              </h3>
              <div className="flex justify-between">
                <span className="text-slate-500">Tiền hàng:</span>
                <span>{formatVND(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Giảm giá:</span>
                <span className="text-rose-600">-{formatVND(order.discount_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phí vận chuyển:</span>
                <span>{formatVND(order.shipping_fee)}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-slate-900 pt-2 bg-slate-200/30 px-2 rounded">
                <span>Tổng cộng:</span>
                <span className="text-emerald-700">{formatVND(order.total_price)}</span>
              </div>
              <div className="flex justify-between text-xs pt-1">
                <span className="text-slate-500">Phương thức:</span>
                <span className="font-semibold">{order.payment_method}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
