'use client';

import React, { useEffect, useState } from 'react';
import { User } from '@/types/user';
import { userService } from '@/services/userService';
import { uploadService } from '@/services/uploadService';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  
  // Form DTO
  const initialForm = {
    email: '',
    full_name: '',
    phone_number: '',
    password: '',
    role: 'USER',
    is_active: true,
    avatar_url: '',
  };
  const [formData, setFormData] = useState<any>(initialForm);
  const [uploading, setUploading] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const openModal = (user: User | null = null) => {
    setEditUser(user);
    if (user) {
      setFormData({
        email: user.email,
        full_name: user.full_name || '',
        phone_number: user.phone_number || '',
        password: '', // blank by default when editing
        role: user.role,
        is_active: user.is_active,
        avatar_url: user.avatar_url || '',
      });
    } else {
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      
      // If editing and password is empty, don't send it to backend
      if (editUser && !payload.password) {
        delete payload.password;
      }

      if (editUser) {
        await userService.adminUpdateUser(editUser.id, payload);
      } else {
        if (!payload.password) {
          alert('Vui lòng nhập mật khẩu cho người dùng mới');
          return;
        }
        await userService.adminCreateUser(payload);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || 'Lỗi khi lưu thông tin người dùng');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await userService.adminDeleteUser(id);
        fetchUsers();
      } catch (err: any) {
        console.error(err);
        alert(err.response?.data?.detail || 'Lỗi khi xóa người dùng');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Khách hàng & User</h1>
        <button 
          onClick={() => openModal()} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          + Thêm người dùng
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500">Đang tải...</div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành viên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      {user.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={user.avatar_url} 
                          alt={user.full_name || 'Avatar'} 
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                          {(user.full_name || 'U').substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-800">{user.full_name || 'Chưa cập nhật'}</div>
                        <div className="text-xs text-gray-400">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone_number || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Banned'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => openModal(user)} 
                      className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)} 
                      className="text-red-600 hover:text-red-900 transition-colors"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[95vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">{editUser ? 'Cập nhật thông tin User' : 'Thêm User mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-700 self-start">Ảnh đại diện</label>
                <div className="relative w-24 h-24 bg-gray-100 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center">
                  {formData.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={formData.avatar_url} 
                      alt="Avatar Preview" 
                      className="w-full h-full object-cover"
                    />
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
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input 
                  type="email" required
                  disabled={!!editUser}
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
                  value={formData.phone_number} 
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editUser ? 'Mật khẩu mới (Để trống nếu giữ nguyên)' : 'Mật khẩu *'}
                </label>
                <input 
                  type="password"
                  required={!editUser}
                  placeholder={editUser ? '••••••••' : 'Nhập mật khẩu'}
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                  <select 
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
                    value={formData.role} 
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
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
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    />
                    Kích hoạt hoạt động
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
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
      )}
    </div>
  );
}
