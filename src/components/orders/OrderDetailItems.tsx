import React from 'react';
import { OrderItem } from '@/services/orderService';
import Link from 'next/link';

interface OrderDetailItemsProps {
  items: OrderItem[];
}

export const OrderDetailItems: React.FC<OrderDetailItemsProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-2xl p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-800 pb-3">
        Danh sách sản phẩm
      </h3>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <Link 
                href={`/products?search=${encodeURIComponent(item.product_name)}`}
                className="font-bold text-gray-800 hover:text-emerald-700 transition-colors text-sm line-clamp-2 leading-snug"
              >
                {item.product_name}
              </Link>
              <span className="text-xs text-gray-400 block">
                Số lượng: <strong className="text-gray-700 font-semibold">{item.quantity}</strong>
              </span>
            </div>
            
            <div className="text-right flex-shrink-0">
              <span className="text-xs text-gray-400 block">
                {item.unit_price.toLocaleString('vi-VN')}₫ / sản phẩm
              </span>
              <span className="font-bold text-[#f36b21] text-sm">
                {item.total_price.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default OrderDetailItems;
