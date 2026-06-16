'use client';

import React, { useEffect, useState } from 'react';
import { Product, Category } from '@/types/product';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { ProductCard } from '@/components/product/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    productService.getProducts({ category_id: selectedCategory || undefined, search })
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory, search]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb / Search bar area */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-[#458500]">Sản phẩm của chúng tôi</h1>
        <div className="w-full md:w-96">
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#458500]"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Danh mục</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-2 py-1 rounded hover:bg-gray-200 transition-colors ${selectedCategory === null ? 'font-bold text-[#458500]' : 'text-gray-700'}`}
                >
                  Tất cả sản phẩm
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button 
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-2 py-1 rounded hover:bg-gray-200 transition-colors ${selectedCategory === cat.id ? 'font-bold text-[#458500]' : 'text-gray-700'}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#458500]"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-lg">
              Không tìm thấy sản phẩm nào phù hợp.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
