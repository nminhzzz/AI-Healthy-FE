import React from 'react';
import Link from 'next/link';
import { CartItem } from '@/lib/stores/cartStore';
import { CartItemRow } from './CartItemRow';

interface CartItemListProps {
  items: CartItem[];
  onUpdateQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}

export const CartItemList: React.FC<CartItemListProps> = ({ items, onUpdateQty, onRemove }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl p-8 space-y-6">
        <h3 className="text-xl font-bold text-gray-800">Giỏ hàng của bạn đang trống</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
          Hãy khám phá các sản phẩm bảo vệ sức khỏe và thực phẩm chức năng cao cấp của chúng tôi ngay.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-8 py-3 rounded-full transition-all duration-200 hover:scale-105"
          >
            Mua sắm ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6">
      <div className="flow-root">
        <div className="-my-6">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdateQty={onUpdateQty}
              onRemove={onRemove}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default CartItemList;
