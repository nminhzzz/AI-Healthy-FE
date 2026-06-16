import React from 'react';

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 rounded-2xl p-6 shadow-sm">
      {[
        { title: '100% Chính Hãng', desc: 'Nhập khẩu đầy đủ bill kiểm định' },
        { title: 'Giao Hàng Siêu Tốc', desc: 'Freeship mọi đơn hàng từ 500k' },
        { title: 'AI Tư Vấn 24/7', desc: 'Phân tích & đề xuất theo cơ địa' },
        { title: '30 Ngày Đổi Trả', desc: 'Bảo vệ quyền lợi tối đa 100%' }
      ].map((badge, idx) => (
        <div key={idx} className="flex flex-col gap-1 p-2 hover:bg-slate-100/40 rounded-xl transition-colors">
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-black text-slate-800">{badge.title}</h4>
            <p className="text-[10px] sm:text-xs text-slate-500">{badge.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
