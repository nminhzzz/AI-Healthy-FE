import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { RatingStars } from '../common/RatingStars';
import { useCartStore } from '@/lib/stores/cartStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.sale_price || product.price,
      quantity: 1,
      image_url: product.image_url || '',
    });
  };

  return (
    <div className="rounded-xl p-4 hover:shadow-xl transition-all duration-300 bg-white text-slate-800 flex flex-col h-full group shadow-sm">
      <Link href={`/products/${product.slug}`} className="block flex-grow relative pb-4">
        <div className="w-full h-48 mb-4 bg-slate-50 rounded-lg p-2 relative flex items-center justify-center">
          {/* Badge */}
          {product.sale_price && (
            <span className="absolute top-2 left-2 bg-[#f36b21] text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10 uppercase tracking-wider">
              SALE
            </span>
          )}
          {product.image_url ? (
            <Image 
              src={product.image_url} 
              alt={product.name} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-wider">Không có ảnh</div>
          )}
        </div>
        
        <div className="text-xs text-slate-500 mb-1 line-clamp-1">{product.brand || 'Thương hiệu'}</div>
        <h3 className="text-emerald-800 font-bold hover:text-emerald-700 transition-colors line-clamp-2 leading-tight mb-2 h-10 text-sm">
          {product.name}
        </h3>
        
        <RatingStars rating={product.average_rating} totalReviews={product.total_reviews} />
        
        <div className="mt-3">
          {product.sale_price ? (
            <div className="flex items-end gap-2">
              <span className="text-lg font-black text-[#f36b21]">{product.sale_price.toLocaleString('vi-VN')}₫</span>
              <span className="text-xs text-slate-400 line-through mb-0.5">{product.price.toLocaleString('vi-VN')}₫</span>
            </div>
          ) : (
            <div className="text-lg font-black text-[#f36b21]">{product.price.toLocaleString('vi-VN')}₫</div>
          )}
        </div>
      </Link>
      
      <div className="mt-auto pt-4">
        <button 
          onClick={handleAddToCart}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 text-sm hover:scale-[1.02] active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 disabled:pointer-events-none"
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
        </button>
      </div>
    </div>
  );
};
