"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types/product";
import { productService } from "@/services/productService";
import { RatingStars } from "@/components/common/RatingStars";
import { ReviewSection } from "@/components/product/ReviewSection";
import { useCartStore } from "@/lib/stores/cartStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { cartService } from "@/services/cartService";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (slug) {
      productService
        .getProductBySlug(slug as string)
        .then(setProduct)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.sale_price || product.price,
      quantity: qty,
      image_url: product.image_url || '',
    });

    if (isAuthenticated) {
      try {
        await cartService.addToCart(product.id, qty);
      } catch (err) {
        console.error('Lỗi khi đồng bộ sản phẩm vào giỏ hàng Redis:', err);
      }
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (loading) return <div className="text-center py-20">Đang tải...</div>;
  if (!product)
    return <div className="text-center py-20">Không tìm thấy sản phẩm.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row gap-12 bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-100 mb-12">
        {/* Image Gallery */}
        <div className="w-full lg:w-2/5 flex items-center justify-center bg-gray-50 rounded-lg p-8 min-h-[400px] relative">
          {product.image_url ? (
            <div className="relative w-full h-[350px] md:h-[400px]">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-contain mix-blend-multiply"
              />
            </div>
          ) : (
            <div className="text-gray-400 text-6xl">Hình ảnh đang cập nhật</div>
          )}
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-3/5">
          <div className="text-sm text-[#458500] font-bold mb-2 uppercase tracking-wide">
            {product.brand || "Thương hiệu"}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <RatingStars
              rating={product.average_rating}
              totalReviews={product.total_reviews}
              size="md"
            />
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">Mã: {product.sku}</span>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-100">
            {product.sale_price ? (
              <div className="flex items-end gap-3 mb-2">
                <span className="text-4xl font-black text-[#f36b21]">
                  {product.sale_price.toLocaleString("vi-VN")}₫
                </span>
                <span className="text-xl text-gray-400 line-through mb-1">
                  {product.price.toLocaleString("vi-VN")}₫
                </span>
              </div>
            ) : (
              <div className="text-4xl font-black text-[#f36b21] mb-2">
                {product.price.toLocaleString("vi-VN")}₫
              </div>
            )}

            <div
              className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {product.stock > 0 ? "✓ Còn hàng" : "✗ Hết hàng"}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-2">Mô tả ngắn:</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description || "Chưa có mô tả."}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="w-24">
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                min={1}
                max={product.stock}
                className="w-full h-12 bg-slate-100 rounded text-center font-bold focus:outline-none"
                disabled={product.stock === 0}
              />
            </div>
            <button
              onClick={handleAddToCart}
              className={`flex-grow h-12 font-bold rounded text-white text-lg transition-colors
                ${product.stock > 0 ? (isAdded ? "bg-emerald-600" : "bg-[#f36b21] hover:bg-[#d95a1a]") : "bg-gray-400 cursor-not-allowed"}`}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? (isAdded ? "Đã thêm!" : "Thêm vào giỏ hàng") : "Hết hàng"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs / Detailed Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-[#458500]"></span> Thành phần
            </h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.ingredients || "Chưa cập nhật thông tin thành phần."}
            </p>
          </div>
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-[#458500]"></span> Hướng dẫn sử dụng
            </h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.usage_guide || "Chưa cập nhật hướng dẫn sử dụng."}
            </p>
          </div>
          <div className="p-8 border-t border-gray-200 md:border-t-0">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-[#458500]"></span> Công dụng nổi bật
            </h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.benefits || "Chưa cập nhật công dụng."}
            </p>
          </div>
          <div className="p-8 border-t border-gray-200 md:border-t-0">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-[#458500]"></span> Cảnh báo
            </h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.warnings || "Không có cảnh báo đặc biệt."}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <ReviewSection
        productId={product.id}
        averageRating={product.average_rating}
        totalReviews={product.total_reviews}
      />
    </div>
  );
}
