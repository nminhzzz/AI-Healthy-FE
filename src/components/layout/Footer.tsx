'use client';

import { useState } from 'react';
import Link from 'next/link';

const exploreLinks = [
  { label: 'Vitamins & Khoáng chất', href: '/products?category=vitamins' },
  { label: 'Dầu cá & Omega', href: '/products?category=omega' },
  { label: 'Dinh dưỡng thể thao', href: '/products?category=sports' },
  { label: 'Chăm sóc cá nhân', href: '/products?category=beauty' },
  { label: 'Sức khỏe đường ruột', href: '/products?category=digestion' },
];

const supportLinks = [
  { label: 'Trung tâm trợ giúp (FAQs)', href: '/faq' },
  { label: 'Hướng dẫn mua hàng', href: '/guide' },
  { label: 'Chính sách vận chuyển', href: '/shipping-policy' },
  { label: 'Chính sách hoàn tiền & đổi trả', href: '/return-policy' },
  { label: 'Chính sách bảo mật', href: '/privacy' },
];

const companyLinks = [
  { label: 'Giới thiệu HealthShop AI', href: '/about' },
  { label: 'Ứng dụng di động', href: '/mobile-app' },
  { label: 'Cộng đồng & Đánh giá', href: '/reviews' },
  { label: 'Tuyển dụng', href: '/careers' },
  { label: 'Liên hệ', href: '/contact' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="relative mt-auto bg-slate-50 text-slate-600">

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          
          {/* Column 1: Brand Info */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-6">
            <Link href="/" className="group inline-flex items-center gap-2">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-2xl font-black tracking-tight text-transparent">
                HealthShop AI
              </span>
            </Link>
            
            <p className="max-w-sm text-sm leading-relaxed text-slate-500">
              Nền tảng thương mại điện tử thực phẩm chức năng hàng đầu Việt Nam. Được tích hợp trợ lý AI thông minh tư vấn lộ trình chăm sóc sức khỏe cá nhân hóa 24/7.
            </p>

            {/* Quality Seals / Trust badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                100% Chính Hãng
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-teal-50 px-3.5 py-1 text-xs font-semibold text-teal-700 shadow-sm">
                Kiểm Định FDA/GMP
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-[#f36b21]/10 px-3.5 py-1 text-xs font-semibold text-[#f36b21] shadow-sm">
                Trợ Lý AI Tư Vấn
              </div>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Khám Phá
            </h3>
            <ul className="mt-4 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-slate-500 transition-colors duration-200 hover:text-emerald-600"
                  >
                    <span className="mr-2 inline-block h-1 w-1 rounded-full bg-slate-300 transition-all duration-200 group-hover:w-2 group-hover:bg-emerald-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Hỗ Trợ
            </h3>
            <ul className="mt-4 space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-slate-500 transition-colors duration-200 hover:text-emerald-600"
                  >
                    <span className="mr-2 inline-block h-1 w-1 rounded-full bg-slate-300 transition-all duration-200 group-hover:w-2 group-hover:bg-emerald-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company Links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Về Chúng Tôi
            </h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-slate-500 transition-colors duration-200 hover:text-emerald-600"
                  >
                    <span className="mr-2 inline-block h-1 w-1 rounded-full bg-slate-300 transition-all duration-200 group-hover:w-2 group-hover:bg-emerald-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Newsletter SignUp */}
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Đăng Ký Nhận Tin
            </h3>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Đăng ký để nhận voucher giảm giá 10% cho đơn hàng đầu tiên và thông tin ưu đãi sức khỏe mới nhất từ AI.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Email của bạn..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full bg-white border border-slate-200 px-4 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold py-2 px-4 transition-all duration-200 shadow-md shadow-emerald-500/10 active:scale-95"
              >
                {subscribed ? '✓ ĐÃ ĐĂNG KÝ!' : 'ĐĂNG KÝ NGAY'}
              </button>
            </form>
          </div>

        </div>

        {/* Middle Line: Payment Partners & Contacts */}
        <div className="mt-12 pt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-t border-slate-200/50">
          {/* Payment Methods */}
          <div className="space-y-2">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">Đối tác thanh toán bảo mật</span>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="bg-white px-3 py-1 rounded-md text-[10px] font-bold text-slate-655 text-slate-600 border border-slate-200/80">MoMo</div>
              <div className="bg-white px-3 py-1 rounded-md text-[10px] font-bold text-slate-655 text-slate-600 border border-slate-200/80">VNPAY</div>
              <div className="bg-white px-3 py-1 rounded-md text-[10px] font-bold text-slate-655 text-slate-600 border border-slate-200/80">Visa</div>
              <div className="bg-white px-3 py-1 rounded-md text-[10px] font-bold text-slate-655 text-slate-600 border border-slate-200/80">MasterCard</div>
              <div className="bg-white px-3 py-1 rounded-md text-[10px] font-bold text-slate-655 text-slate-600 border border-slate-200/80">COD (Tiền mặt)</div>
            </div>
          </div>

          {/* Hotlines / Support contacts */}
          <div className="flex flex-wrap gap-6 text-xs text-slate-550 text-slate-500">
            <div className="flex items-center gap-2">
              <span className="text-emerald-700 font-bold">Hotline:</span>
              <a href="tel:19008888" className="hover:text-emerald-600 font-bold transition-colors">1900 8888</a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-700 font-bold">Email hỗ trợ:</span>
              <a href="mailto:support@healthshop.ai" className="hover:text-emerald-600 font-bold transition-colors">support@healthshop.ai</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="mt-8 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row border-t border-slate-200/50">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} HealthShop AI. Tất cả quyền được bảo lưu. Thiết kế và vận hành chuyên nghiệp lấy cảm hứng từ iHerb.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-2">
            {[
              { name: 'Facebook', url: 'https://facebook.com', label: 'FB' },
              { name: 'Instagram', url: 'https://instagram.com', label: 'IG' },
              { name: 'YouTube', url: 'https://youtube.com', label: 'YT' },
              { name: 'TikTok', url: 'https://tiktok.com', label: 'TK' },
            ].map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 border border-slate-200 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-650 hover:text-emerald-600 text-xs font-bold"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
