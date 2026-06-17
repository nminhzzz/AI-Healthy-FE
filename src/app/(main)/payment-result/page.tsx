'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { paymentService } from '@/services/paymentService';
import Link from 'next/link';

function PaymentResultContent() {
  const searchParams = useSearchParams();
  
  const orderCode = searchParams.get('order_code') || '';
  const paymentIdStr = searchParams.get('payment_id') || '';
  const amountStr = searchParams.get('amount') || '';
  const provider = searchParams.get('provider') || '';
  const statusStr = searchParams.get('status_str') || '';
  const paymentMethod = searchParams.get('payment_method') || '';

  const [loading, setLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState<'pending' | 'success' | 'failed'>(
    statusStr === 'success' ? 'success' : statusStr === 'failed' ? 'failed' : 'pending'
  );
  const [message, setMessage] = useState('');

  const paymentId = paymentIdStr ? parseInt(paymentIdStr) : null;

  useEffect(() => {
    if (paymentMethod === 'COD' || statusStr === 'success') {
      setResultStatus('success');
    }
  }, [paymentMethod, statusStr]);

  const handleSimulatePayment = async (status: 'success' | 'failed') => {
    if (!orderCode || !paymentId) return;

    setLoading(true);
    try {
      const res = await paymentService.updatePaymentStatus(orderCode, paymentId, status);
      setResultStatus(status);
      setMessage(res.message);
    } catch (err) {
      console.error(err);
      alert('Không thể đồng bộ cập nhật trạng thái thanh toán lên máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  if (resultStatus === 'success') {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center space-y-6 min-h-[60vh]">
        <h2 className="text-3xl font-black text-emerald-850 text-emerald-700">Đặt hàng thành công!</h2>
        <div className="bg-gray-50 p-6 rounded-2xl space-y-2.5 text-sm text-left">
          <p className="text-gray-600">Mã đơn hàng: <strong className="text-gray-800">{orderCode}</strong></p>
          {amountStr && (
            <p className="text-gray-600">Tổng tiền: <strong className="text-gray-850 text-[#f36b21]">{parseFloat(amountStr).toLocaleString('vi-VN')}₫</strong></p>
          )}
          <p className="text-gray-600">Hình thức: <strong className="text-emerald-700 font-bold">{paymentMethod || provider}</strong></p>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          Cảm ơn bạn đã tin dùng HealthShop AI. Đơn hàng của bạn đang được tiếp nhận và xử lý đóng gói.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            href="/orders"
            className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-full transition-colors text-sm text-center"
          >
            Lịch sử đơn hàng
          </Link>
          <Link
            href="/products"
            className="flex-grow bg-slate-100 hover:bg-slate-200 text-gray-600 font-bold py-3 px-6 rounded-full transition-colors text-sm text-center"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  if (resultStatus === 'failed') {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center space-y-6 min-h-[60vh]">
        <h2 className="text-3xl font-black text-red-700">Thanh toán thất bại</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Giao dịch thanh toán trực tuyến của bạn đã bị từ chối hoặc bị hủy bỏ.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            href="/checkout"
            className="flex-grow bg-[#f36b21] hover:bg-[#d95a1a] text-white font-bold py-3 px-6 rounded-full transition-colors text-sm text-center"
          >
            Thử lại thanh toán
          </Link>
          <Link
            href="/products"
            className="flex-grow bg-slate-100 hover:bg-slate-200 text-gray-650 font-bold py-3 px-6 rounded-full transition-colors text-sm text-center"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg min-h-[70vh] flex items-center justify-center">
      <div className="bg-slate-50 rounded-3xl p-6 md:p-8 space-y-6 w-full">
        <div className="text-center pb-4">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider">Cổng thanh toán giả lập ({provider})</h2>
          <p className="text-xs text-gray-400 mt-1">Hệ thống Sandbox dành cho kiểm thử nhà phát triển</p>
        </div>

        <div className="bg-white p-6 rounded-2xl space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Mã đơn hàng:</span>
            <span className="font-bold text-gray-800">{orderCode}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Nhà cung cấp:</span>
            <span className="font-bold text-emerald-700">{provider}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Số tiền thanh toán:</span>
            <span className="font-black text-[#f36b21] text-lg">
              {amountStr ? `${parseFloat(amountStr).toLocaleString('vi-VN')}₫` : '---'}
            </span>
          </div>
        </div>

        <p className="text-xs text-center text-slate-500 leading-relaxed italic">
          Vui lòng bấm nút dưới đây để giả lập phản hồi kết quả giao dịch thanh toán từ Ngân hàng / Ví điện tử.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={() => handleSimulatePayment('success')}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:bg-gray-300 text-sm"
          >
            {loading ? 'Đang cập nhật...' : 'Thanh toán Thành công'}
          </button>
          <button
            onClick={() => handleSimulatePayment('failed')}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:bg-gray-300 text-sm"
          >
            {loading ? 'Đang cập nhật...' : 'Giao dịch thất bại'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-20 min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#458500]"></div>
      </div>
    }>
      <PaymentResultContent />
    </Suspense>
  );
}
