'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types/product';

interface CategoryGridProps {
  categories: Category[];
  loading: boolean;
}

export default function CategoryGrid({ categories, loading }: CategoryGridProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end pb-3">
        <h3 className="text-lg font-black tracking-tight text-slate-800">
          Danh Mục Nổi Bật
        </h3>
        <Link href="/products" className="text-xs text-emerald-600 font-bold hover:underline">
          Xem tất cả →
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 animate-pulse">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-slate-100" />
                <div className="h-3 w-16 bg-slate-100 rounded" />
              </div>
            ))
          : categories.slice(0, 6).map((cat) => {
              const initials = cat.name
                ? cat.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : '💊';
              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="flex flex-col items-center gap-3 group text-center"
                >
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center text-sm font-black bg-slate-100 text-emerald-700 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-emerald-500/10 group-hover:bg-slate-200 relative overflow-hidden">
                    {cat.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover rounded-full"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-600 group-hover:text-emerald-700 transition-colors line-clamp-2 px-1 max-w-[110px]">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
      </div>
    </div>
  );
}
