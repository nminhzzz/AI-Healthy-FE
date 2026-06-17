'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/stores/cartStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { orderService } from '@/services/orderService';
import { paymentService } from '@/services/paymentService';
import { ShippingForm, ShippingFormData } from '@/components/checkout/ShippingForm';
import { PaymentMethods } from '@/components/checkout/PaymentMethods';
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [shippingData, setShippingData] = useState<ShippingFormData>({
    receiver_name: user?.full_name || '',
    phone: user?.phone_number || '',
    province: '',
    district: '',
    ward: '',
    address_detail: '',
    note: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Điền trước thông tin của User nếu có
  useEffect(() => {
    if (user) {
      setShippingData((prev) => ({
        ...prev,
        receiver_name: prev.receiver_name || user.full_name || '',
        phone: prev.phone || user.phone_number || '',
      }));
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center space-y-6 min-h-[60vh]">
        <h3 className="text-xl font-bold text-gray-800">Yêu cầu đăng nhập</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Bạn cần đăng nhập tài khoản để tiến hành điền thông tin giao hàng và thanh toán đặt sản phẩm.
        </p>
        <Link
          href="/login?redirect=/checkout"
          className="block w-full bg-[#458500] hover:bg-[#386b00] text-white font-bold py-3 rounded-full transition-colors text-sm"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center space-y-6 min-h-[60vh]">
        <h3 className="text-xl font-bold text-gray-800">Giỏ hàng của bạn đang trống</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Không có sản phẩm nào để tiến hành thanh toán đặt hàng. Hãy quay lại trang cửa hàng để chọn mua sản phẩm nhé!
        </p>
        <Link
          href="/products"
          className="block w-full bg-[#458500] hover:bg-[#386b00] text-white font-bold py-3 rounded-full transition-colors text-sm"
        >
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !shippingData.receiver_name ||
      !shippingData.phone ||
      !shippingData.province ||
      !shippingData.district ||
      !shippingData.ward ||
      !shippingData.address_detail
    ) {
      setError('Vui lòng điền đầy đủ các thông tin giao nhận bắt buộc (*).');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Tạo đơn hàng trong MySQL
      const order = await orderService.createOrder({
        receiver_name: shippingData.receiver_name,
        phone: shippingData.phone,
        province: shippingData.province,
        district: shippingData.district,
        ward: shippingData.ward,
        address_detail: shippingData.address_detail,
        note: shippingData.note || undefined,
        payment_method: paymentMethod,
      });

      // 2. Xử lý thanh toán dựa trên phương thức được chọn
      if (paymentMethod === 'COD') {
        // Thanh toán COD -> Chuyển trực tiếp tới trang thành công
        clearCart();
        router.push(`/payment-result?order_code=${order.order_code}&status_str=success&payment_method=COD`);
      } else {
        // Thanh toán Online (VNPAY / MOMO)
        const provider = paymentMethod as 'VNPAY' | 'MOMO' | 'STRIPE';
        const paymentRes = await paymentService.createPaymentUrl(order.id, provider);
        
        if (paymentRes.payment_url) {
          // Làm trống giỏ hàng local
          clearCart();
          // Chuyển hướng người dùng tới Link thanh toán giả lập
          window.location.href = paymentRes.payment_url;
        } else {
          throw new Error('Lỗi khởi tạo đường dẫn thanh toán từ máy chủ.');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Đã xảy ra lỗi trong quá trình đặt hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = totalPrice();

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl min-h-[70vh]">
      <h1 className="text-3xl font-extrabold text-[#458500] mb-8">Thanh toán đơn hàng</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cột trái: Form nhập thông tin & Chọn thanh toán */}
        <div className="lg:col-span-2 space-y-6">
          <ShippingForm formData={shippingData} onChange={handleInputChange} />
          <PaymentMethods selectedMethod={paymentMethod} onSelect={setPaymentMethod} />
        </div>

        {/* Cột phải: Tóm tắt tiền và bấm đặt hàng */}
        <div className="lg:col-span-1">
          <CheckoutSummary
            items={items}
            subtotal={subtotal}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </div>
      </form>
    </div>
  );
}
