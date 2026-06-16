'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/product/ProductCard';

interface SuperDealsProps {
  products: Product[];
  loading: boolean;
}

export default function SuperDeals({ products, loading }: SuperDealsProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ hours: 24, minutes: 0, seconds: 0 });
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours: h, minutes: m, seconds: s });
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const superDealsList = products.filter((p) => p.sale_price !== null).slice(0, 4);

  return (
    <div id="super-deals" className="space-y-6">
      <div className="bg-gradient-to-r from-red-50/20 via-slate-50 to-slate-50 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="bg-[#f36b21] text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-md">
              SUPER DEALS
            </span>
            <h3 className="text-xl font-black text-slate-800">Khuyến mãi cực sốc</h3>
          </div>
          
          {/* Countdown Timer UI */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
            <span>KẾT THÚC SAU:</span>
            <div className="flex gap-1">
              <span className="bg-white px-2.5 py-1.5 rounded-md text-red-600 font-black tracking-widest text-sm shadow animate-pulse">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-white px-2.5 py-1.5 rounded-md text-red-600 font-black tracking-widest text-sm shadow animate-pulse">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-white px-2.5 py-1.5 rounded-md text-red-600 font-black tracking-widest text-sm shadow animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-80 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : superDealsList.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {superDealsList.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-sm">
            Hiện tại không có chương trình Flash Sale nào diễn ra. Vui lòng quay lại sau!
          </div>
        )}
      </div>
    </div>
  );
}
