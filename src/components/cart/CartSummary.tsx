import React from 'react';
import Link from 'next/link';

interface CartSummaryProps {
  subtotal: number;
  onClearCart?: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, onClearCart }) => {
  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  return (
    <div className="bg-white rounded-2xl p-6 space-y-6">
      <h3 className="text-lg font-bold text-gray-800 pb-3">Tóm tắt đơn hàng</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tạm tính:</span>
          <span className="font-semibold text-gray-800">{subtotal.toLocaleString('vi-VN')}₫</span>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>Phí vận chuyển:</span>
          <span className="font-semibold text-gray-800">
            {shippingFee === 0 ? (
              <span className="text-green-600 font-bold">Miễn phí</span>
            ) : (
              `${shippingFee.toLocaleString('vi-VN')}₫`
            )}
          </span>
        </div>

        {shippingFee > 0 && (
          <div className="bg-emerald-50 text-[#458500] text-xs p-3 rounded-lg leading-relaxed font-medium">
            Mua thêm <strong>{(500000 - subtotal).toLocaleString('vi-VN')}₫</strong> nữa để được <strong>Miễn phí vận chuyển</strong>!
          </div>
        )}
      </div>

      <div className="pt-4 flex justify-between items-end">
        <span className="text-sm font-bold text-gray-700">Tổng cộng:</span>
        <span className="text-2xl font-black text-[#f36b21]">{total.toLocaleString('vi-VN')}₫</span>
      </div>

      <div className="space-y-3 pt-2">
        <Link
          href="/checkout"
          className="block w-full text-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3.5 px-6 rounded-full transition-all duration-200 hover:scale-[1.02] text-sm"
        >
          Tiến hành thanh toán
        </Link>
        
        <Link
          href="/products"
          className="block w-full text-center bg-slate-50 hover:bg-slate-100 text-gray-600 font-bold py-3 rounded-full transition-all text-xs"
        >
          Tiếp tục mua sắm
        </Link>

        {onClearCart && (
          <button
            onClick={onClearCart}
            className="w-full text-center text-xs text-red-500 hover:text-red-650 hover:underline pt-2"
          >
            Làm trống giỏ hàng
          </button>
        )}
      </div>
    </div>
  );
};
export default CartSummary;
