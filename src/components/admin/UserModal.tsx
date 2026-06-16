import React, { useEffect, useState } from 'react';
import { User } from '@/types/user';
import { userService } from '@/services/userService';
import { uploadService } from '@/services/uploadService';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: () => void;
}

const initialForm = {
  email: '',
  full_name: '',
  phone_number: '',
  password: '',
  role: 'USER',
  is_active: true,
  avatar_url: '',
};

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState<any>(initialForm);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        full_name: user.full_name || '',
        phone_number: user.phone_number || '',
        password: '', // Blank when editing
        role: user.role,
        is_active: user.is_active,
        avatar_url: user.avatar_url || '',
      });
    } else {
      setFormData(initialForm);
    }
  }, [user, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadService.uploadImage(file);
      setFormData((prev: any) => ({ ...prev, avatar_url: url }));
    } catch (err) {
      console.error(err);
      alert('Lỗi tải ảnh lên Cloudinary');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      
      // If editing and password is empty, don't send it to backend
      if (user && !payload.password) {
        delete payload.password;
      }

      if (user) {
        await userService.adminUpdateUser(user.id, payload);
      } else {
        if (!payload.password) {
          alert('Vui lòng nhập mật khẩu cho người dùng mới');
          return;
        }
        await userService.adminCreateUser(payload);
      }
      onSave();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || 'Lỗi khi lưu thông tin người dùng');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[95vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {user ? 'Cập nhật thông tin User' : 'Thêm User mới'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <label className="block text-sm font-medium text-gray-700 self-start">Ảnh đại diện</label>
            <div className="relative w-24 h-24 bg-gray-100 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center">
              {formData.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={formData.avatar_url} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-gray-400">Chưa có ảnh</span>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-[10px] text-white font-medium">
                  Tải lên...
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              disabled={!!user}
              className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {user ? 'Mật khẩu mới (Để trống nếu giữ nguyên)' : 'Mật khẩu *'}
            </label>
            <input
              type="password"
              required={!user}
              placeholder={user ? '••••••••' : 'Nhập mật khẩu'}
              className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
              <select
                className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div className="flex flex-col justify-end pb-2">
              <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                Kích hoạt hoạt động
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
