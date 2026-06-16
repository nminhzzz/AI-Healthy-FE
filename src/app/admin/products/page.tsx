'use client';

import React, { useEffect, useState } from 'react';
import { Product, Category } from '@/types/product';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { ProductModal } from '@/components/admin/ProductModal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const fetchData = async () => {
    try {
      const [prodData, catData] = await Promise.all([
        productService.adminGetProducts(),
        categoryService.getCategories(),
      ]);
      setProducts(prodData);
      setCategories(catData);
    } catch (err) {
      console.error(err);
      alert('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (product: Product | null = null) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productService.adminDeleteProduct(id);
        fetchData();
      } catch (err) {
        console.error(err);
        alert('Lỗi khi xóa sản phẩm');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm & Kho</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500">Đang tải...</div>
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
                <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prod.sku}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <div className="truncate w-64 text-gray-800" title={prod.name}>
                      {prod.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {prod.price.toLocaleString('vi-VN')}₫
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        prod.stock > 10
                          ? 'bg-green-100 text-green-800'
                          : prod.stock > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {prod.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openModal(prod)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                    >
                      Sửa / Kho
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id)}
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

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editProduct}
        categories={categories}
        onSave={fetchData}
      />
    </div>
  );
}
