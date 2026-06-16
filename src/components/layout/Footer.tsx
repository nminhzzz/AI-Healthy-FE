import Link from 'next/link';

const aboutLinks = [
  { label: 'Giới thiệu', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Tuyển dụng', href: '/careers' },
  { label: 'Liên hệ', href: '/contact' },
];

const supportLinks = [
  { label: 'Hướng dẫn mua hàng', href: '/guide' },
  { label: 'Chính sách đổi trả', href: '/return-policy' },
  { label: 'Chính sách bảo mật', href: '/privacy' },
  { label: 'FAQ', href: '/faq' },
];

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-slate-800 bg-slate-900">
      {/* Top gradient border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="group inline-flex items-center gap-2">
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">🌿</span>
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-xl font-bold text-transparent">
                HealthShop AI
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Nền tảng mua sắm sản phẩm sức khỏe thông minh, được hỗ trợ bởi AI để
              tư vấn cá nhân hóa. Cam kết sản phẩm chính hãng, giao hàng nhanh
              toàn quốc.
            </p>
            {/* Trust badges */}
            <div className="mt-5 flex items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                ✓ Chính hãng 100%
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-400 ring-1 ring-teal-500/20">
                ✓ AI Tư vấn
              </span>
            </div>
          </div>

          {/* Column 2: About */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Về chúng tôi
            </h3>
            <ul className="mt-4 space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-slate-400 transition-colors duration-200 hover:text-emerald-400"
                  >
                    <span className="mr-2 inline-block h-1 w-1 rounded-full bg-slate-600 transition-all duration-200 group-hover:w-2 group-hover:bg-emerald-400" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Hỗ trợ
            </h3>
            <ul className="mt-4 space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-slate-400 transition-colors duration-200 hover:text-emerald-400"
                  >
                    <span className="mr-2 inline-block h-1 w-1 rounded-full bg-slate-600 transition-all duration-200 group-hover:w-2 group-hover:bg-emerald-400" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Liên hệ
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <span>support@healthshop.ai</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                <span>1900 xxxx xx</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <span>123 Nguyễn Huệ, Q.1, TP.HCM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © 2024 HealthShop AI. Tất cả quyền được bảo lưu.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {['Facebook', 'Instagram', 'YouTube', 'TikTok'].map((social) => {
              const urls: Record<string, string> = {
                Facebook: 'https://facebook.com',
                Instagram: 'https://instagram.com',
                YouTube: 'https://youtube.com',
                TikTok: 'https://tiktok.com',
              };
              return (
                <a
                  key={social}
                  href={urls[social] || 'https://google.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 ring-1 ring-slate-700/50 transition-all duration-200 hover:bg-emerald-500/10 hover:text-emerald-400 hover:ring-emerald-500/30"
                >
                  <span className="text-xs font-bold">{social[0]}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
