'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* ── Background Effects ───────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pt-36">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            AI-Powered Health Store
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
            <span className="block text-white">Sức Khỏe</span>
            <span className="mt-2 block bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
              Thông Minh
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg lg:text-xl">
            Cửa hàng thực phẩm chức năng & sản phẩm sức khỏe được{' '}
            <span className="font-semibold text-emerald-400">AI tư vấn cá nhân hóa</span>{' '}
            — Phân tích hồ sơ sức khỏe, đề xuất sản phẩm phù hợp nhất cho bạn.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/products"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/40 active:scale-95"
            >
              <span className="relative z-10">Khám Phá Ngay</span>
              <svg className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-full border border-slate-600/50 bg-slate-800/50 px-8 py-3.5 text-base font-semibold text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:bg-slate-800 hover:text-white hover:scale-105"
            >
              🤖 Hỏi AI Tư Vấn
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature Cards ────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-500 hover:border-emerald-500/30 hover:bg-white/10 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Glow effect on hover */}
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

              <span className="text-4xl">{feature.icon}</span>
              <h3 className="mt-4 text-xl font-bold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats Section ────────────────────────────────────────── */}
      <section className="relative border-y border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-emerald-400 sm:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── Data ────────────────────────────────────────────────────────────────────
const features = [
  {
    icon: '🤖',
    title: 'AI Tư Vấn Thông Minh',
    description:
      'Trợ lý AI phân tích hồ sơ sức khỏe cá nhân và đề xuất sản phẩm phù hợp nhất cho bạn. Tư vấn 24/7 không giới hạn.',
  },
  {
    icon: '🛡️',
    title: 'Chính Hãng 100%',
    description:
      'Cam kết tất cả sản phẩm đều chính hãng, nguồn gốc rõ ràng, có đầy đủ giấy tờ kiểm định chất lượng.',
  },
  {
    icon: '🚀',
    title: 'Giao Hàng Siêu Tốc',
    description:
      'Miễn phí vận chuyển cho đơn hàng từ 500K. Giao hàng nhanh trong 2h tại nội thành HCM & Hà Nội.',
  },
];

const stats = [
  { value: '10K+', label: 'Sản phẩm' },
  { value: '50K+', label: 'Khách hàng' },
  { value: '99.8%', label: 'Hài lòng' },
  { value: '24/7', label: 'Hỗ trợ AI' },
];
