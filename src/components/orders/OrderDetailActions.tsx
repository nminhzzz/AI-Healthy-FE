import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Order, orderService } from '@/services/orderService';
import Link from 'next/link';

interface OrderDetailActionsProps {
  order: Order;
  onStatusUpdated: (updatedOrder: Order) => void;
}

export const OrderDetailActions: React.FC<OrderDetailActionsProps> = ({ order, onStatusUpdated }) => {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState('');

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    setError('');
    try {
      const updated = await orderService.cancelOrder(order.id);
      onStatusUpdated(updated);
      setIsConfirming(false);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Không thể hủy đơn hàng vào lúc này. Vui lòng liên hệ hỗ trợ.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-800 pb-3">Thao tác</h3>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium leading-normal">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {order.status === 'PENDING' && (
          <>
            {!isConfirming ? (
              <button
                onClick={() => setIsConfirming(true)}
                className="w-full text-center bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-bold py-3.5 px-6 rounded-full transition-all text-sm active:scale-95"
              >
                Hủy đơn hàng này
              </button>
            ) : (
              <div className="bg-rose-50/30 p-4 rounded-xl space-y-3">
                <p className="text-xs text-gray-650 leading-relaxed font-semibold text-center">
                  Bạn chắc chắn muốn hủy đơn hàng này chứ? Hành động này không thể khôi phục và số lượng hàng sẽ được hoàn trả lại kho.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-full text-xs transition-colors disabled:bg-gray-300"
                  >
                    {isCancelling ? 'Đang hủy...' : 'Đúng, Hủy đơn'}
                  </button>
                  <button
                    onClick={() => setIsConfirming(false)}
                    disabled={isCancelling}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold py-2.5 rounded-full text-xs transition-colors"
                  >
                    Quay lại
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <Link
          href="/orders"
          className="block w-full text-center bg-slate-50 hover:bg-slate-100 text-gray-700 font-bold py-3 px-6 rounded-full transition-all text-xs active:scale-95"
        >
          Quay lại Lịch sử đơn hàng
        </Link>
        
        <Link
          href="/products"
          className="block w-full text-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-full transition-all text-xs active:scale-95 shadow-md shadow-emerald-500/10"
        >
          Tiếp tục Mua sắm
        </Link>
      </div>
    </div>
  );
};
export default OrderDetailActions;
