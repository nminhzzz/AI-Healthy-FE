import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { RatingStars } from '../common/RatingStars';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="border border-gray-200 rounded p-4 hover:shadow-lg transition-shadow bg-white flex flex-col h-full group">
      <Link href={`/products/${product.slug}`} className="block flex-grow relative pb-4">
        <div className="w-full h-48 mb-4 bg-white relative">
          {/* Badge */}
          {product.sale_price && (
            <span className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-br z-10">
              SALE
            </span>
          )}
          {product.image_url ? (
            <Image 
              src={product.image_url} 
              alt={product.name} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">💊</div>
          )}
        </div>
        
        <div className="text-sm text-gray-500 mb-1 line-clamp-1">{product.brand || 'Thương hiệu'}</div>
        <h3 className="text-blue-700 font-bold hover:underline line-clamp-2 leading-tight mb-2 h-10">
          {product.name}
        </h3>
        
        <RatingStars rating={product.average_rating} totalReviews={product.total_reviews} />
        
        <div className="mt-3">
          {product.sale_price ? (
            <div className="flex items-end gap-2">
              <span className="text-xl font-extrabold text-[#f36b21]">{product.sale_price.toLocaleString('vi-VN')}₫</span>
              <span className="text-sm text-gray-400 line-through mb-1">{product.price.toLocaleString('vi-VN')}₫</span>
            </div>
          ) : (
            <div className="text-xl font-extrabold text-[#f36b21]">{product.price.toLocaleString('vi-VN')}₫</div>
          )}
        </div>
      </Link>
      
      <div className="mt-auto pt-4">
        <button 
          className="w-full bg-[#f36b21] hover:bg-[#d95a1a] text-white font-bold py-2 px-4 rounded transition-colors"
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
        </button>
      </div>
    </div>
  );
};
