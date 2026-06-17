'use client';

import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/stores/cartStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { cartService } from '@/services/cartService';
import { CartItemList } from '@/components/cart/CartItemList';
import { CartSummary } from '@/components/cart/CartSummary';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [syncing, setSyncing] = useState(false);

  // Đồng bộ giỏ hàng từ Redis khi người dùng đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      setSyncing(true);
      cartService.getCart()
        .then((data) => {
          const formattedItems = data.items.map(i => ({
            id: i.product.id,
            name: i.product.name,
            price: i.product.sale_price !== null ? i.product.sale_price : i.product.price,
            quantity: i.quantity,
            image_url: i.product.image_url || ''
          }));
          // Cập nhật lại Zustand store bằng dữ liệu sạch từ Server Redis
          useCartStore.setState({ items: formattedItems });
        })
        .catch((err) => {
          console.error('Lỗi khi tải giỏ hàng từ Redis:', err);
        })
        .finally(() => setSyncing(false));
    }
  }, [isAuthenticated]);

  const handleUpdateQuantity = async (id: number, qty: number) => {
    // 1. Cập nhật local state
    updateQuantity(id, qty);

    // 2. Gửi request ngầm đồng bộ lên Redis nếu đã đăng nhập
    if (isAuthenticated) {
      try {
        await cartService.updateCartQty(id, qty);
      } catch (err) {
        console.error('Không thể đồng bộ số lượng sản phẩm lên Redis:', err);
      }
    }
  };

  const handleRemoveItem = async (id: number) => {
    // 1. Xóa khỏi local state
    removeItem(id);

    // 2. Gửi request xóa trên Redis nếu đã đăng nhập
    if (isAuthenticated) {
      try {
        await cartService.removeFromCart(id);
      } catch (err) {
        console.error('Không thể xóa sản phẩm khỏi Redis:', err);
      }
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ sản phẩm khỏi giỏ hàng?')) {
      // 1. Xóa sạch local state
      clearCart();

      // 2. Xóa sạch trên Redis nếu đã đăng nhập
      if (isAuthenticated) {
        try {
          await cartService.clearCart();
        } catch (err) {
          console.error('Không thể làm sạch giỏ hàng trên Redis:', err);
        }
      }
    }
  };

  const subtotal = totalPrice();

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl min-h-[60vh]">
      <h1 className="text-3xl font-extrabold text-[#458500] mb-8">Giỏ hàng của bạn</h1>

      {syncing ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#458500]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cột trái: Danh sách sản phẩm */}
          <div className="lg:col-span-2">
            <CartItemList
              items={items}
              onUpdateQty={handleUpdateQuantity}
              onRemove={handleRemoveItem}
            />
          </div>

          {/* Cột phải: Khung tạm tính */}
          <div className="lg:col-span-1">
            <CartSummary
              subtotal={subtotal}
              onClearCart={items.length > 0 ? handleClearCart : undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
}
