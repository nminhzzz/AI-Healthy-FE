'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export const CAROUSEL_SLIDES = [
  {
    title: 'Đại Tiệc Vitamin Hè Giảm Sâu Đến 20%',
    description: 'Tăng cường đề kháng, bảo vệ sức khỏe gia đình bạn với các dòng Vitamin nhập khẩu chính hãng từ Mỹ.',
    buttonText: 'Khám Phá Deal',
    link: '/products?category=vitamins',
    gradient: 'from-emerald-50 via-teal-50/50 to-emerald-100/50',
    badge: 'Bán Chạy Nhất'
  },
  {
    title: 'Hỏi Đáp Sức Khỏe Miễn Phí Với Bác Sĩ AI',
    description: 'Nhận ngay tư vấn lộ trình sức khỏe, thực phẩm bổ sung phù hợp hoàn toàn miễn phí nhờ Trợ Lý AI của HealthShop.',
    buttonText: 'Hỏi AI Ngay',
    link: '/chat',
    gradient: 'from-indigo-50 via-teal-50/30 to-emerald-50/50',
    badge: 'Tính Năng Đột Phá'
  },
  {
    title: 'Flash Sale - Đếm Ngược Mỗi Ngày',
    description: 'Săn deal chớp nhoáng các dòng thực phẩm bổ sung xương khớp, tim mạch & làm đẹp cực sốc.',
    buttonText: 'Săn Deal Ngay',
    link: '#super-deals',
    gradient: 'from-orange-50 via-slate-50 to-orange-100/30',
    badge: 'Số Lượng Có Hạn'
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-sm bg-slate-50 min-h-[340px] flex items-center">
      {CAROUSEL_SLIDES.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} p-8 sm:p-12 flex flex-col justify-center transition-all duration-700 ease-in-out ${
            idx === currentSlide ? 'opacity-100 translate-x-0 scale-100 z-10' : 'opacity-0 translate-x-4 scale-95 z-0 pointer-events-none'
          }`}
        >
          <div className="max-w-xl space-y-4">
            <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              {slide.badge}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight text-slate-800">
              {slide.title}
            </h2>
            <p className="text-slate-650 text-slate-600 text-sm sm:text-base leading-relaxed">
              {slide.description}
            </p>
            <div className="pt-2">
              <Link
                href={slide.link}
                className="inline-flex items-center gap-2 bg-[#f36b21] hover:bg-[#d95a1a] text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-105 shadow-lg shadow-[#f36b21]/30 active:scale-95"
              >
                {slide.buttonText}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Dots Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {CAROUSEL_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === currentSlide ? 'w-8 bg-emerald-600' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Arrow Buttons */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length)}
        className="absolute left-4 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-sm transition-colors hidden sm:flex"
        aria-label="Slide trước"
      >
        ←
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length)}
        className="absolute right-4 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-sm transition-colors hidden sm:flex"
        aria-label="Slide sau"
      >
        →
      </button>
    </div>
  );
}
