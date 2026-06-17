import React, { useEffect, useState } from 'react';
import { Coupon, couponService } from '@/services/couponService';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon: Coupon | null;
  onSave: () => void;
}

const initialForm = {
  code: '',
  discount_amount: 0,
  is_active: true,
  expires_at: '',
};

export const CouponModal: React.FC<CouponModalProps> = ({
  isOpen,
  onClose,
  coupon,
  onSave,
}) => {
  const [formData, setFormData] = useState<any>(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (coupon) {
      // Format expires_at to YYYY-MM-DDThh:mm for datetime-local input
      let formattedDate = '';
      if (coupon.expires_at) {
        try {
          const d = new Date(coupon.expires_at);
          formattedDate = d.toISOString().slice(0, 16);
        } catch {
          formattedDate = '';
        }
      }
      setFormData({
        code: coupon.code,
        discount_amount: coupon.discount_amount,
        is_active: coupon.is_active,
        expires_at: formattedDate,
      });
    } else {
      setFormData(initialForm);
    }
  }, [coupon, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        discount_amount: parseFloat(formData.discount_amount) || 0,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
      };

      if (coupon) {
        await couponService.adminUpdateCoupon(coupon.id, payload);
      } else {
        await couponService.adminCreateCoupon(payload);
      }
      onSave();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || 'Lỗi khi lưu thông tin mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-slate-800">
          {coupon ? 'Cập nhật mã giảm giá' : 'Thêm mã giảm giá mới'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Mã giảm giá
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, code: e.target.value.toUpperCase() }))}
              placeholder="VD: HEALTH100"
              className="w-full bg-slate-100 text-slate-800 py-2.5 px-4 rounded-lg outline-none focus:bg-slate-200 transition-colors border-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Số tiền giảm (VND)
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.discount_amount}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, discount_amount: e.target.value }))}
              placeholder="VD: 50000"
              className="w-full bg-slate-100 text-slate-800 py-2.5 px-4 rounded-lg outline-none focus:bg-slate-200 transition-colors border-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Ngày hết hạn (Để trống nếu không giới hạn)
            </label>
            <input
              type="datetime-local"
              value={formData.expires_at}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, expires_at: e.target.value }))}
              className="w-full bg-slate-100 text-slate-800 py-2.5 px-4 rounded-lg outline-none focus:bg-slate-200 transition-colors border-none"
            />
          </div>

          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, is_active: e.target.checked }))}
              className="w-4 h-4 text-emerald-600 border-none rounded bg-slate-100 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="is_active" className="text-sm text-slate-700 font-semibold cursor-pointer">
              Đang hoạt động
            </label>
          </div>

          <div className="flex gap-2 pt-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-4 rounded-md transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-md transition-colors cursor-pointer"
            >
              {loading ? 'Đang lưu...' : 'Lưu lại'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
