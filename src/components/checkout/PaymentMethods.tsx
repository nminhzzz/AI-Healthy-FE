import React from 'react';

interface PaymentMethodsProps {
  selectedMethod: string;
  onSelect: (method: string) => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({ selectedMethod, onSelect }) => {
  const methods = [
    {
      id: 'COD',
      title: 'Thanh toán khi nhận hàng (COD)',
      description: 'Nhận hàng rồi mới thanh toán tiền mặt cho nhân viên giao hàng.',
    },
    {
      id: 'VNPAY',
      title: 'Thanh toán VNPAY (Thẻ ATM/QR-Code)',
      description: 'Chuyển hướng an toàn tới cổng VNPay để thanh toán bằng QR hoặc Thẻ nội địa.',
    },
    {
      id: 'MOMO',
      title: 'Ví điện tử MoMo',
      description: 'Thanh toán nhanh chóng qua ví điện tử MoMo (Giả lập).',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 space-y-6">
      <h3 className="text-lg font-bold text-gray-800 pb-3">
        Phương thức thanh toán
      </h3>

      <div className="space-y-3">
        {methods.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <div
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`rounded-xl p-4 flex items-start gap-4 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-emerald-50 text-emerald-900'
                  : 'bg-slate-55 hover:bg-slate-100 text-gray-800'
              }`}
            >
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm">{method.title}</h4>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#458500]'
                        : 'bg-gray-305 bg-slate-200'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{method.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default PaymentMethods;
