import React from 'react';

export interface ShippingFormData {
  receiver_name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address_detail: string;
  note: string;
}

interface ShippingFormProps {
  formData: ShippingFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ShippingForm: React.FC<ShippingFormProps> = ({ formData, onChange }) => {
  return (
    <div className="bg-white rounded-2xl p-6 space-y-6">
      <h3 className="text-lg font-bold text-gray-800 pb-3">
        Thông tin giao hàng
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Receiver Name */}
        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1.5">Họ tên người nhận *</label>
          <input
            type="text"
            name="receiver_name"
            value={formData.receiver_name}
            onChange={onChange}
            required
            placeholder="Ví dụ: Nguyễn Văn A"
            className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none transition-all"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1.5">Số điện thoại *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            required
            placeholder="Ví dụ: 0912345678"
            className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Province */}
        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1.5">Tỉnh / Thành phố *</label>
          <input
            type="text"
            name="province"
            value={formData.province}
            onChange={onChange}
            required
            placeholder="Ví dụ: Hà Nội"
            className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none transition-all"
          />
        </div>

        {/* District */}
        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1.5">Quận / Huyện *</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={onChange}
            required
            placeholder="Ví dụ: Cầu Giấy"
            className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none transition-all"
          />
        </div>

        {/* Ward */}
        <div>
          <label className="text-xs font-bold text-gray-600 block mb-1.5">Xã / Phường *</label>
          <input
            type="text"
            name="ward"
            value={formData.ward}
            onChange={onChange}
            required
            placeholder="Ví dụ: Dịch Vọng"
            className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Address Detail */}
      <div>
        <label className="text-xs font-bold text-gray-600 block mb-1.5">Địa chỉ cụ thể *</label>
        <input
          type="text"
          name="address_detail"
          value={formData.address_detail}
          onChange={onChange}
          required
          placeholder="Ví dụ: Số 123, Đường Trần Hưng Đạo"
          className="w-full bg-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none transition-all"
        />
      </div>

      {/* Note */}
      <div>
        <label className="text-xs font-bold text-gray-600 block mb-1.5">Ghi chú giao hàng (tùy chọn)</label>
        <textarea
          name="note"
          value={formData.note}
          onChange={onChange}
          rows={3}
          placeholder="Ghi chú về thời gian giao hàng, chỉ dẫn đường đi..."
          className="w-full bg-slate-100 rounded-lg p-3 text-sm focus:outline-none transition-all"
        ></textarea>
      </div>
    </div>
  );
};
export default ShippingForm;
