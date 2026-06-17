'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, Category } from '@/types/product';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { ProductCard } from '@/components/product/ProductCard';

function ProductsContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState(urlSearch);
  
  // Bộ lọc giá & sắp xếp mới
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [priceFilter, setPriceFilter] = useState<{ min?: number; max?: number }>({});
  const [sortBy, setSortBy] = useState('');

  // Phân trang mới
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  // Đồng bộ từ khóa tìm kiếm từ URL khi tham số thay đổi
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(console.error);
  }, []);

  // Reset trang về 1 khi bất kỳ bộ lọc hoặc sắp xếp nào thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, search, priceFilter, sortBy]);

  useEffect(() => {
    setLoading(true);
    productService.searchProducts({ 
      category_id: selectedCategory || undefined, 
      q: search || undefined,
      price_min: priceFilter.min,
      price_max: priceFilter.max,
      sort_by: sortBy || undefined,
      page: currentPage,
      limit: productsPerPage
    })
      .then((data) => {
        setProducts(data.items);
        setTotalProducts(data.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory, search, priceFilter, sortBy, currentPage]);

  const handleApplyPriceFilter = () => {
    setPriceFilter({
      min: minPrice ? parseFloat(minPrice) : undefined,
      max: maxPrice ? parseFloat(maxPrice) : undefined,
    });
  };

  const handleClearPriceFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    setPriceFilter({});
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

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

          {/* Lọc theo giá */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Khoảng giá</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Giá từ</label>
                <input
                  type="number"
                  placeholder="đ"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#458500]"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Đến</label>
                <input
                  type="number"
                  placeholder="đ"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#458500]"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleApplyPriceFilter}
                  className="flex-1 bg-[#458500] hover:bg-[#386b00] text-white text-xs font-bold py-2 px-3 rounded transition-colors"
                >
                  Lọc giá
                </button>
                {(minPrice || maxPrice || priceFilter.min || priceFilter.max) && (
                  <button
                    onClick={handleClearPriceFilter}
                    className="border border-gray-300 hover:bg-gray-100 text-gray-600 text-xs font-bold py-2 px-3 rounded transition-colors"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid & Sorting header */}
        <div className="flex-grow">
          {/* Header hiển thị kết quả và sắp xếp */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
            <div className="text-sm text-gray-500">
              Tìm thấy <strong className="text-gray-800">{totalProducts}</strong> sản phẩm
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 whitespace-nowrap font-medium">Sắp xếp theo:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#458500]/20 focus:border-[#458500] cursor-pointer"
              >
                <option value="">Mặc định</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
                <option value="name_asc">Tên: A - Z</option>
                <option value="name_desc">Tên: Z - A</option>
                <option value="rating_desc">Đánh giá tốt nhất</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#458500]"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-lg">
              Không tìm thấy sản phẩm nào phù hợp.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Giao diện thanh phân trang */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Trước
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                          currentPage === pageNum
                            ? 'bg-[#458500] text-white shadow-md shadow-[#458500]/10'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#458500]"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
