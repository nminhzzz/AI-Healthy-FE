import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CartItem } from '@/lib/stores/cartStore';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item, onUpdateQty, onRemove }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-6 hover:bg-slate-50/50 px-2 rounded-xl transition-all">
      {/* Product Image */}
      <div className="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center p-1 relative">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="80px"
            className="object-contain p-1"
          />
        ) : (
          <span className="text-[10px] text-gray-400 font-bold uppercase">No Photo</span>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-grow text-center sm:text-left">
        <h4 className="font-bold text-gray-800 hover:text-emerald-700 transition-colors text-sm line-clamp-2 leading-snug">
          {item.name}
        </h4>
        <p className="text-xs text-gray-400 mt-1">Đơn giá: {item.price.toLocaleString('vi-VN')}₫</p>
      </div>

      {/* Quantity Controls & Total Price */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-4 sm:mt-0">
        {/* Quantity buttons */}
        <div className="flex items-center rounded-full bg-slate-100 overflow-hidden">
          <button
            onClick={() => onUpdateQty(item.id, item.quantity - 1)}
            className="px-3 py-1.5 hover:bg-slate-200 text-gray-650 transition-colors active:scale-90"
            aria-label="Giảm số lượng"
          >
            -
          </button>
          <span className="px-3 text-sm font-bold text-gray-800 select-none min-w-[20px] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
            className="px-3 py-1.5 hover:bg-slate-200 text-gray-655 transition-colors active:scale-90"
            aria-label="Tăng số lượng"
          >
            +
          </button>
        </div>

        {/* Total Item Price */}
        <div className="text-right min-w-[100px]">
          <span className="font-black text-[#f36b21] text-base">
            {(item.price * item.quantity).toLocaleString('vi-VN')}₫
          </span>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all active:scale-90 text-xs font-bold"
          aria-label="Xóa sản phẩm"
        >
          Xóa
        </button>
      </div>
    </div>
  );
};
export default CartItemRow;
