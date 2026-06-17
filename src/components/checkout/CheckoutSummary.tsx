import React from 'react';
import { CartItem } from '@/lib/stores/cartStore';

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  items,
  subtotal,
  isSubmitting,
  onSubmit,
}) => {
  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  return (
    <div className="bg-white rounded-2xl p-6 space-y-6">
      <h3 className="text-lg font-bold text-gray-800 pb-3">Tóm tắt đơn hàng</h3>

      {/* Item list */}
      <div className="space-y-4 max-h-[240px] overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 text-sm">
            <div className="flex-grow">
              <h5 className="font-bold text-gray-800 line-clamp-1 text-xs">{item.name}</h5>
              <span className="text-xs text-gray-400">
                {item.quantity} x {item.price.toLocaleString('vi-VN')}₫
              </span>
            </div>
            <span className="font-bold text-gray-800 flex-shrink-0 text-xs">
              {(item.price * item.quantity).toLocaleString('vi-VN')}₫
            </span>
          </div>
        ))}
      </div>

      <div className="h-px bg-transparent"></div>

      {/* Totals */}
      <div className="space-y-3">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Tạm tính:</span>
          <span className="font-semibold text-gray-800">{subtotal.toLocaleString('vi-VN')}₫</span>
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Phí vận chuyển:</span>
          <span className="font-semibold text-gray-800">
            {shippingFee === 0 ? (
              <span className="text-green-600 font-bold">Miễn phí</span>
            ) : (
              `${shippingFee.toLocaleString('vi-VN')}₫`
            )}
          </span>
        </div>
      </div>

      <div className="h-px bg-transparent"></div>

      <div className="flex justify-between items-end">
        <span className="text-sm font-bold text-gray-700">Tổng cộng:</span>
        <span className="text-xl font-black text-[#f36b21]">{total.toLocaleString('vi-VN')}₫</span>
      </div>

      <div className="pt-2">
        <button
          onClick={onSubmit}
          disabled={isSubmitting || items.length === 0}
          className="w-full bg-gradient-to-r from-[#f36b21] to-[#d95a1a] hover:from-[#d95a1a] hover:to-[#b8430f] text-white font-bold py-3.5 px-6 rounded-full transition-all duration-250 disabled:bg-gray-300 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-sm hover:scale-[1.01]"
        >
          {isSubmitting ? 'Đang đặt hàng...' : 'Xác nhận Đặt hàng'}
        </button>
      </div>
    </div>
  );
};
export default CheckoutSummary;
