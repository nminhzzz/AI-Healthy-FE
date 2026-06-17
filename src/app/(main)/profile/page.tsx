'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/authStore';
import { userService } from '@/services/userService';
import { uploadService } from '@/services/uploadService';
import { shippingService, ShippingAddress } from '@/services/shippingService';

export default function ProfilePage() {
  const { user, accessToken, setAuth, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'password'>('profile');

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    phone_number: '',
    avatar_url: '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Address Book State
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    receiver_name: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    address_detail: '',
    is_default: false,
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || '',
        phone_number: user.phone_number || '',
        avatar_url: user.avatar_url || '',
      });
    }
  }, [user]);

  // Load addresses when address tab is active
  const fetchAddresses = async () => {
    setAddressLoading(true);
    try {
      const data = await shippingService.getAddresses();
      setAddresses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [isAuthenticated, activeTab]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Trang cá nhân</h1>
        <p className="text-slate-500">
          Vui lòng đăng nhập để xem thông tin và quản lý sổ địa chỉ của bạn.
        </p>
        <div className="pt-4">
          <Link
            href="/login"
            className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-6 rounded-md transition-colors cursor-pointer"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  // Handle Avatar Upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const url = await uploadService.uploadImage(file);
      setProfileForm((prev) => ({ ...prev, avatar_url: url }));
      // Save to server immediately if desired, or let them click save
    } catch (err) {
      console.error(err);
      alert('Không thể tải ảnh đại diện lên.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Save profile changes
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const updatedUser = await userService.updateProfile({
        full_name: profileForm.full_name,
        phone_number: profileForm.phone_number,
        avatar_url: profileForm.avatar_url,
      });
      if (accessToken) {
        setAuth(accessToken, updatedUser);
      }
      alert('Cập nhật thông tin cá nhân thành công!');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || 'Lỗi khi cập nhật thông tin cá nhân');
    } finally {
      setProfileSaving(false);
    }
  };

  // Change password
  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert('Mật khẩu mới xác nhận không trùng khớp.');
      return;
    }
    setPasswordSaving(true);
    try {
      await userService.changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      });
      setPasswordForm({
        old_password: '',
        new_password: '',
        confirm_password: '',
      });
      alert('Đổi mật khẩu thành công!');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || 'Lỗi khi đổi mật khẩu');
    } finally {
      setPasswordSaving(false);
    }
  };

  // Address CRUD actions
  const openAddressForm = (addr: ShippingAddress | null = null) => {
    if (addr) {
      setEditingAddress(addr);
      setAddressForm({
        receiver_name: addr.receiver_name,
        phone: addr.phone,
        province: addr.province,
        district: addr.district,
        ward: addr.ward,
        address_detail: addr.address_detail,
        is_default: addr.is_default,
      });
    } else {
      setEditingAddress(null);
      setAddressForm({
        receiver_name: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        address_detail: '',
        is_default: false,
      });
    }
    setIsAddressFormOpen(true);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await shippingService.updateAddress(editingAddress.id, addressForm);
      } else {
        await shippingService.createAddress(addressForm);
      }
      setIsAddressFormOpen(false);
      fetchAddresses();
    } catch (err: any) {
      console.error(err);
      alert('Lỗi khi lưu địa chỉ giao nhận.');
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      try {
        await shippingService.deleteAddress(id);
        fetchAddresses();
      } catch (err) {
        console.error(err);
        alert('Lỗi khi xóa địa chỉ.');
      }
    }
  };

  const handleSetDefaultAddress = async (id: number) => {
    try {
      await shippingService.setDefaultAddress(id);
      fetchAddresses();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi đổi địa chỉ mặc định.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
      <div className="bg-slate-50 p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-slate-800">Trang cá nhân của bạn</h1>
        <p className="text-sm text-slate-500 mt-1">
          Quản lý thông tin bảo mật, thông tin cá nhân và sổ địa chỉ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar Tabs - Flat design */}
        <div className="space-y-1.5 bg-slate-100 p-2 rounded-lg self-start">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-md text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'profile' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left px-4 py-3 rounded-md text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'addresses' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Sổ địa chỉ
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`w-full text-left px-4 py-3 rounded-md text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'password' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Đổi mật khẩu
          </button>
        </div>

        {/* Content Area - Flat wrapper */}
        <div className="md:col-span-3 bg-white p-6 rounded-lg">
          
          {/* TAB 1: Profile Details */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Thông tin cá nhân</h2>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 bg-slate-50 p-4 rounded-lg">
                <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center font-bold text-lg text-slate-600 overflow-hidden relative">
                  {profileForm.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profileForm.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    (profileForm.full_name || 'U').substring(0, 2).toUpperCase()
                  )}
                </div>
                <div className="space-y-2">
                  <label className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 px-4 rounded-md transition-colors cursor-pointer inline-block">
                    {uploadingAvatar ? 'Đang tải...' : 'Tải ảnh đại diện'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                  </label>
                  <p className="text-xs text-slate-400">Định dạng JPG, PNG. Dung lượng dưới 2MB.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Email đăng ký
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full bg-slate-50 text-slate-400 py-2.5 px-4 rounded-lg outline-none cursor-not-allowed border-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, full_name: e.target.value }))}
                    className="w-full bg-slate-100 text-slate-800 py-2.5 px-4 rounded-lg outline-none focus:bg-slate-200 transition-colors border-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={profileForm.phone_number}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, phone_number: e.target.value }))}
                    className="w-full bg-slate-100 text-slate-800 py-2.5 px-4 rounded-lg outline-none focus:bg-slate-200 transition-colors border-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-6 rounded-md transition-colors cursor-pointer"
                >
                  {profileSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Address Book */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-800">Sổ địa chỉ nhận hàng</h2>
                {!isAddressFormOpen && (
                  <button
                    onClick={() => openAddressForm()}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 px-4 rounded-md transition-colors cursor-pointer"
                  >
                    Thêm địa chỉ mới
                  </button>
                )}
              </div>

              {isAddressFormOpen ? (
                /* Address Form */
                <form onSubmit={handleAddressSubmit} className="space-y-4 bg-slate-50 p-5 rounded-lg">
                  <h3 className="font-bold text-slate-800 text-sm">
                    {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Người nhận</label>
                      <input
                        type="text"
                        required
                        value={addressForm.receiver_name}
                        onChange={(e) => setAddressForm((prev) => ({ ...prev, receiver_name: e.target.value }))}
                        className="w-full bg-white text-slate-800 py-2 px-3 rounded outline-none focus:bg-slate-100 border-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Số điện thoại</label>
                      <input
                        type="text"
                        required
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm((prev) => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-white text-slate-800 py-2 px-3 rounded outline-none focus:bg-slate-100 border-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tỉnh/Thành phố</label>
                      <input
                        type="text"
                        required
                        value={addressForm.province}
                        onChange={(e) => setAddressForm((prev) => ({ ...prev, province: e.target.value }))}
                        className="w-full bg-white text-slate-800 py-2 px-3 rounded outline-none focus:bg-slate-100 border-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Quận/Huyện</label>
                      <input
                        type="text"
                        required
                        value={addressForm.district}
                        onChange={(e) => setAddressForm((prev) => ({ ...prev, district: e.target.value }))}
                        className="w-full bg-white text-slate-800 py-2 px-3 rounded outline-none focus:bg-slate-100 border-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Xã/Phường</label>
                      <input
                        type="text"
                        required
                        value={addressForm.ward}
                        onChange={(e) => setAddressForm((prev) => ({ ...prev, ward: e.target.value }))}
                        className="w-full bg-white text-slate-800 py-2 px-3 rounded outline-none focus:bg-slate-100 border-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Địa chỉ chi tiết (Số nhà, Tên đường)</label>
                    <input
                      type="text"
                      required
                      value={addressForm.address_detail}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, address_detail: e.target.value }))}
                      className="w-full bg-white text-slate-800 py-2 px-3 rounded outline-none focus:bg-slate-100 border-none text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      id="is_default"
                      checked={addressForm.is_default}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, is_default: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded bg-white cursor-pointer"
                    />
                    <label htmlFor="is_default" className="text-xs text-slate-700 font-semibold cursor-pointer">
                      Đặt làm địa chỉ giao hàng mặc định
                    </label>
                  </div>

                  <div className="flex gap-2 pt-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsAddressFormOpen(false)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-1.5 px-4 rounded text-xs transition-colors cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-1.5 px-4 rounded text-xs transition-colors cursor-pointer"
                    >
                      Lưu địa chỉ
                    </button>
                  </div>
                </form>
              ) : (
                /* Address List */
                <div className="space-y-4">
                  {addressLoading ? (
                    <div className="text-center py-4 text-slate-400">Đang tải địa chỉ...</div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg">
                      Bạn chưa lưu địa chỉ nhận hàng nào.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map((addr) => (
                        <div key={addr.id} className="bg-slate-50 p-4 rounded-lg flex flex-col sm:flex-row justify-between gap-4">
                          <div className="space-y-1 text-sm text-slate-700">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{addr.receiver_name}</span>
                              <span className="text-slate-400">|</span>
                              <span>{addr.phone}</span>
                              {addr.is_default && (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ml-2">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <div>{addr.address_detail}</div>
                            <div className="text-xs text-slate-500">
                              {addr.ward}, {addr.district}, {addr.province}
                            </div>
                          </div>
                          <div className="flex flex-wrap sm:flex-col items-start sm:items-end justify-center gap-2 text-xs">
                            {!addr.is_default && (
                              <button
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                className="text-emerald-700 hover:underline font-semibold cursor-pointer"
                              >
                                Đặt mặc định
                              </button>
                            )}
                            <div className="space-x-3">
                              <button
                                onClick={() => openAddressForm(addr)}
                                className="text-slate-800 hover:underline font-semibold cursor-pointer"
                              >
                                Chỉnh sửa
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="text-rose-600 hover:underline font-semibold cursor-pointer"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Change Password */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSave} className="space-y-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Đổi mật khẩu tài khoản</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.old_password}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, old_password: e.target.value }))}
                    className="w-full bg-slate-100 text-slate-800 py-2.5 px-4 rounded-lg outline-none focus:bg-slate-200 transition-colors border-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, new_password: e.target.value }))}
                    className="w-full bg-slate-100 text-slate-800 py-2.5 px-4 rounded-lg outline-none focus:bg-slate-200 transition-colors border-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirm_password: e.target.value }))}
                    className="w-full bg-slate-100 text-slate-800 py-2.5 px-4 rounded-lg outline-none focus:bg-slate-200 transition-colors border-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-6 rounded-md transition-colors cursor-pointer"
                >
                  {passwordSaving ? 'Đang lưu...' : 'Thay đổi mật khẩu'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
