'use client';

import React, { useEffect, useState } from 'react';
import { Product, Category } from '@/types/product';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { uploadService } from '@/services/uploadService';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Form DTO
  const initialForm = {
    name: '', slug: '', sku: '', brand: '', price: 0, sale_price: 0, stock: 0,
    category_id: 0, description: '', ingredients: '', usage_guide: '', image_url: '', is_active: true
  };
  const [formData, setFormData] = useState<any>(initialForm);

  const fetchData = async () => {
    try {
      const [prodData, catData] = await Promise.all([
        productService.adminGetProducts(),
        categoryService.getCategories()
      ]);
      setProducts(prodData);
      setCategories(catData);
    } catch (err) {
      console.error(err);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadService.uploadImage(file);
      setFormData((prev: any) => ({ ...prev, image_url: url }));
    } catch (err) {
      console.error(err);
      alert('Lỗi tải ảnh lên Cloudinary');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (product: Product | null = null) => {
    setEditProduct(product);
    if (product) {
      setFormData({
        name: product.name, slug: product.slug, sku: product.sku, brand: product.brand || '',
        price: product.price, sale_price: product.sale_price || 0, stock: product.stock,
        category_id: product.category_id, description: product.description || '',
        ingredients: product.ingredients || '', usage_guide: product.usage_guide || '',
        image_url: product.image_url || '', is_active: product.is_active
      });
    } else {
      setFormData({...initialForm, category_id: categories.length > 0 ? categories[0].id : 0});
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.sale_price) payload.sale_price = null; // Backend accepts null

      if (editProduct) {
        await productService.adminUpdateProduct(editProduct.id, payload);
      } else {
        await productService.adminCreateProduct(payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || 'Error saving product');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.adminDeleteProduct(id);
        fetchData();
      } catch (err) {
        console.error(err);
        alert('Error deleting product');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm & Kho</h1>
        <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
          + Thêm sản phẩm
        </button>
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã (SKU)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên Sản phẩm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá bán</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kho (Stock)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((prod) => (
                <tr key={prod.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prod.sku}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <div className="truncate w-64" title={prod.name}>{prod.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {prod.price.toLocaleString('vi-VN')}₫
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${prod.stock > 10 ? 'bg-green-100 text-green-800' : prod.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {prod.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal(prod)} className="text-indigo-600 hover:text-indigo-900 mr-4">Sửa / Kho</button>
                    <button onClick={() => handleDelete(prod.id)} className="text-red-600 hover:text-red-900">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal - Basic layout for brevity, normally you'd split this into tabs or a separate page */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">{editProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
                  <input type="text" required className="w-full border border-gray-300 rounded p-2" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục *</label>
                  <select required className="w-full border border-gray-300 rounded p-2" value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: Number(e.target.value)})}>
                    <option value="">Chọn danh mục</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                  <input type="text" required className="w-full border border-gray-300 rounded p-2" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá cơ bản *</label>
                  <input type="number" required min="0" className="w-full border border-gray-300 rounded p-2" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho (Stock) *</label>
                  <input type="number" required min="0" className="w-full border border-gray-300 rounded p-2 bg-yellow-50 font-bold" value={formData.stock} onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh sản phẩm</label>
                {formData.image_url && (
                  <div className="mb-2 relative w-48 h-48 bg-gray-100 rounded overflow-hidden flex items-center justify-center border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={formData.image_url} 
                      alt="Product Preview" 
                      className="object-contain max-h-full max-w-full"
                    />
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, image_url: '' })}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 text-xs shadow"
                      title="Xóa ảnh"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Tải ảnh lên</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploading && <p className="text-sm text-blue-600 mt-1">Đang tải ảnh lên...</p>}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Hoặc dán URL hình ảnh</label>
                    <input 
                      type="text" 
                      placeholder="https://example.com/image.jpg"
                      className="w-full border border-gray-300 rounded p-2 text-sm" 
                      value={formData.image_url} 
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})} 
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                <textarea className="w-full border border-gray-300 rounded p-2" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="flex justify-end gap-2 mt-8 border-t pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded font-medium" disabled={uploading}>Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-medium" disabled={uploading}>Lưu Sản phẩm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
