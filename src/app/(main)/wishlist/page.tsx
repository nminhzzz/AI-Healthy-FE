'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { WishlistItem, wishlistService } from '@/services/wishlistService';
import { ProductCard } from '@/components/product/ProductCard';
import { useAuthStore } from '@/lib/stores/authStore';

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  const fetchWishlist = async () => {
    try {
      const data = await wishlistService.getWishlist();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleToggle = async (productId: number) => {
    try {
      await wishlistService.toggleWishlist(productId);
      fetchWishlist(); // Refresh to remove the item from list
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Danh sách yêu thích</h1>
        <p className="text-slate-500">
          Vui lòng đăng nhập để xem và quản lý danh sách sản phẩm yêu thích của bạn.
        </p>
        <div className="pt-4">
          <Link
            href="/login"
            className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-6 rounded-md transition-colors cursor-pointer"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-20 text-slate-500">Đang tải sản phẩm yêu thích...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
      <div className="bg-slate-50 p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-slate-800">Sản phẩm yêu thích</h1>
        <p className="text-sm text-slate-500 mt-1">
          Danh sách các sản phẩm bạn đã lưu để mua sau.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-slate-50 text-center py-16 text-slate-500 rounded-lg space-y-4">
          <p>Bạn chưa lưu sản phẩm yêu thích nào.</p>
          <div>
            <Link
              href="/products"
              className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-6 rounded-md transition-colors cursor-pointer"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="relative group">
              {/* Product Card */}
              <ProductCard product={item.product} />
              
              {/* Flat Remove button overlay */}
              <button
                onClick={() => handleToggle(item.product_id)}
                className="absolute top-2 right-2 bg-white text-rose-600 hover:bg-rose-50 text-xs font-bold py-1.5 px-2.5 rounded shadow-sm transition-colors cursor-pointer"
              >
                Bỏ lưu
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
