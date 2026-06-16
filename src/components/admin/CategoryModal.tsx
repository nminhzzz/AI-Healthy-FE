import React, { useEffect, useState } from 'react';
import { Category } from '@/types/product';
import { categoryService } from '@/services/categoryService';
import { uploadService } from '@/services/uploadService';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: () => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    is_active: true,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image_url: category.image_url || '',
        is_active: category.is_active,
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        is_active: true,
      });
    }
  }, [category, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadService.uploadImage(file);
      setFormData((prev) => ({ ...prev, image_url: url }));
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
      if (category) {
        await categoryService.adminUpdateCategory(category.id, formData);
      } else {
        await categoryService.adminCreateCategory(formData);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi lưu danh mục');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {category ? 'Sửa danh mục' : 'Thêm danh mục mới'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (để trống sẽ tự tạo)</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              className="w-full border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh danh mục</label>
            {formData.image_url && (
              <div className="mb-2 relative w-full h-32 bg-gray-100 rounded overflow-hidden flex items-center justify-center border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.image_url}
                  alt="Category Preview"
                  className="object-contain max-h-full max-w-full"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image_url: '' })}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 text-xs"
                  title="Xóa ảnh"
                >
                  ✕
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && <p className="text-sm text-blue-600 mt-1">Đang tải ảnh lên...</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <label className="flex items-center text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              Kích hoạt
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-6">
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
