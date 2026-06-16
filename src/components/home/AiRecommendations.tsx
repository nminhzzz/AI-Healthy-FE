'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/product/ProductCard';

interface AiRecommendationsProps {
  products: Product[];
  loading: boolean;
}

export default function AiRecommendations({ products, loading }: AiRecommendationsProps) {
  const [aiFilter, setAiFilter] = useState<'all' | 'sleep' | 'immunity' | 'energy'>('all');

  const aiRecommended = products.filter((p) => {
    if (aiFilter === 'sleep') {
      return p.name.toLowerCase().includes('ashwagandha') || p.name.toLowerCase().includes('oil') || p.ingredients?.toLowerCase().includes('ashwagandha');
    }
    if (aiFilter === 'immunity') {
      return p.name.toLowerCase().includes('vitamin') || p.name.toLowerCase().includes('probiotic') || p.name.toLowerCase().includes('lactobif');
    }
    if (aiFilter === 'energy') {
      return p.name.toLowerCase().includes('whey') || p.name.toLowerCase().includes('protein') || p.name.toLowerCase().includes('alive');
    }
    return true; // 'all'
  }).slice(0, 4);

  return (
    <div id="ai-recommendations" className="space-y-6">
      <div className="relative bg-slate-50 rounded-2xl p-6 overflow-hidden shadow-sm">
        {/* Glowing neon background lights */}
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                AI ENGINE RECOMMENDED
              </div>
              <h3 className="text-xl font-black text-slate-800">Đề xuất sức khỏe cho bạn</h3>
            </div>

            {/* AI Goal Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Tất cả gợi ý' },
                { id: 'immunity', label: 'Tăng miễn dịch' },
                { id: 'sleep', label: 'Giúp ngủ ngon' },
                { id: 'energy', label: 'Thể thao & Năng lượng' }
              ].map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setAiFilter(tag.id as any)}
                  className={`text-xs px-4 py-2 rounded-full font-bold transition-all duration-205 cursor-pointer ${
                    aiFilter === tag.id
                      ? 'bg-emerald-600 text-white font-black shadow-md scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products List */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-80 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : aiRecommended.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {aiRecommended.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-450 text-sm">
              Không tìm thấy sản phẩm đề xuất phù hợp cho mục tiêu sức khỏe này.
            </div>
          )}

          {/* Bot Link CTA */}
          <div className="bg-slate-100/80 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="space-y-0.5">
                <h5 className="text-sm font-black text-slate-800">Trợ Lý AI: Bạn chưa biết cơ thể mình cần bổ sung vi chất nào?</h5>
                <p className="text-xs text-slate-500">Hãy hỏi Trợ lý AI của chúng tôi để được chẩn đoán và nhận tư vấn kê đơn phù hợp.</p>
              </div>
            </div>
            <Link
              href="/chat"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black py-2.5 px-5 rounded-full transition-all duration-200 text-center shadow-md shadow-emerald-500/10"
            >
              HỎI AI NGAY
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
