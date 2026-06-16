'use client';

import React, { useEffect, useState } from 'react';
import { Category } from '@/types/product';
import { categoryService } from '@/services/categoryService';
import { uploadService } from '@/services/uploadService';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', image_url: '', is_active: true });
  const [uploading, setUploading] = useState(false);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      alert('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadService.uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: url }));
    } catch (err) {
      console.error(err);
      alert('Lỗi tải ảnh lên Cloudinary');
    } finally {
      setUploading(false);
    }
  };

  const openModal = (category: Category | null = null) => {
    setEditCategory(category);
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image_url: category.image_url || '',
        is_active: category.is_active,
      });
    } else {
      setFormData({ name: '', slug: '', description: '', image_url: '', is_active: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editCategory) {
        await categoryService.adminUpdateCategory(editCategory.id, formData);
      } else {
        await categoryService.adminCreateCategory(formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert('Error saving category');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryService.adminDeleteCategory(id);
        fetchCategories();
      } catch (err) {
        console.error(err);
        alert('Error deleting category');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Danh mục</h1>
        <button 
          onClick={() => openModal()} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          + Thêm danh mục
        </button>
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cat.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {cat.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal(cat)} className="text-indigo-600 hover:text-indigo-900 mr-4">Sửa</button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-900">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
                <input 
                  type="text" required 
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (để trống sẽ tự tạo)</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded p-2"
                  value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea 
                  className="w-full border border-gray-300 rounded p-2"
                  rows={3}
                  value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2"
                    checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  />
                  Kích hoạt
                </label>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded" disabled={uploading}>Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={uploading}>Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
