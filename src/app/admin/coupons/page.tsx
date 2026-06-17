'use client';

import React, { useEffect, useState } from 'react';
import { Coupon, couponService } from '@/services/couponService';
import { CouponModal } from '@/components/admin/coupons/CouponModal';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const fetchCoupons = async () => {
    try {
      const data = await couponService.adminGetCoupons();
      setCoupons(data);
    } catch (err) {
      console.error(err);
      alert('Không thể tải danh sách mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openModal = (coupon: Coupon | null = null) => {
    setSelectedCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
      try {
        await couponService.adminDeleteCoupon(id);
        fetchCoupons();
      } catch (err: any) {
        console.error(err);
        alert(err.response?.data?.detail || 'Lỗi khi xóa mã giảm giá');
      }
    }
  };

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Vô thời hạn';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Title block */}
      <div className="bg-white p-6 rounded-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Mã giảm giá</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tạo mới và quản trị các chương trình mã giảm giá.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-md transition-colors cursor-pointer"
        >
          Thêm mã giảm giá
        </button>
      </div>

      {/* Main content grid */}
      <div className="bg-white p-6 rounded-lg">
        {loading ? (
          <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg">
            Đang tải dữ liệu...
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg">
            Chưa có mã giảm giá nào được tạo.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider text-left">
                <tr>
                  <th className="px-6 py-3">Mã giảm giá</th>
                  <th className="px-6 py-3">Số tiền giảm</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3">Hạn sử dụng</th>
                  <th className="px-6 py-3">Ngày tạo</th>
                  <th className="px-6 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-50 text-slate-700 text-sm">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {coupon.code}
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-700">
                      {formatVND(coupon.discount_amount)}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.is_active ? (
                        <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full text-xs">
                          Active
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full text-xs">
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(coupon.expires_at)}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(coupon.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => openModal(coupon)}
                        className="text-slate-800 hover:text-slate-600 font-semibold cursor-pointer"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="text-rose-600 hover:text-rose-500 font-semibold cursor-pointer"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CouponModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCoupon(null);
        }}
        coupon={selectedCoupon}
        onSave={fetchCoupons}
      />
    </div>
  );
}
