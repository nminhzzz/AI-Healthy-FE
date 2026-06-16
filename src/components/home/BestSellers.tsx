'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/product/ProductCard';

interface BestSellersProps {
  products: Product[];
  loading: boolean;
}

export default function BestSellers({ products, loading }: BestSellersProps) {
  const bestSellersList = [...products].sort((a, b) => b.total_reviews - a.total_reviews).slice(0, 4);

  return (
    <div id="best-sellers" className="space-y-6">
      <div className="flex justify-between items-end pb-3">
        <h3 className="text-lg font-black tracking-tight text-slate-800">
          Sản Phẩm Bán Chạy Nhất
        </h3>
        <Link href="/products" className="text-xs text-emerald-600 font-bold hover:underline">
          Xem tất cả →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-80 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : bestSellersList.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bestSellersList.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400 text-sm">
          Chưa có dữ liệu sản phẩm bán chạy.
        </div>
      )}
    </div>
  );
}
