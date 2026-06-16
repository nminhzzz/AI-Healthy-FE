'use client';

import { useState, useEffect } from 'react';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { Product, Category } from '@/types/product';

import HeroCarousel from '@/components/home/HeroCarousel';
import TrustBadges from '@/components/home/TrustBadges';
import CategoryGrid from '@/components/home/CategoryGrid';
import SuperDeals from '@/components/home/SuperDeals';
import AiRecommendations from '@/components/home/AiRecommendations';
import BestSellers from '@/components/home/BestSellers';

// ── Fallback Premium Categories ─────────────────────────────────────────────
const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, name: 'Vitamin & Khoáng chất', slug: 'vitamins', description: 'Bổ sung vi chất thiết yếu', image_url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=150&h=150&q=80', is_active: true },
  { id: 2, name: 'Dầu cá & Omega', slug: 'omega', description: 'Tốt cho tim mạch & não bộ', image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=150&h=150&q=80', is_active: true },
  { id: 3, name: 'Dinh dưỡng Thể thao', slug: 'sports', description: 'Tăng cơ & phục hồi năng lượng', image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=150&h=150&q=80', is_active: true },
  { id: 4, name: 'Chăm sóc da & Tóc', slug: 'beauty', description: 'Nuôi dưỡng vẻ đẹp tự nhiên', image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=150&h=150&q=80', is_active: true },
  { id: 5, name: 'Hệ tiêu hóa & Gut', slug: 'digestion', description: 'Hỗ trợ đường ruột khỏe mạnh', image_url: 'https://images.unsplash.com/photo-1607619056574-7b8d304a3b24?auto=format&fit=crop&w=150&h=150&q=80', is_active: true },
  { id: 6, name: 'Thảo dược tự nhiên', slug: 'herbs', description: 'Giải pháp từ thiên nhiên', image_url: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=150&h=150&q=80', is_active: true },
];

// ── Fallback Premium Products ───────────────────────────────────────────────
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 101,
    name: 'Omega-3 Premium Fish Oil 180mg EPA / 120mg DHA',
    slug: 'omega-3-premium-fish-oil',
    sku: 'CGN-01031',
    brand: 'California Gold Nutrition',
    price: 450000,
    sale_price: 360000,
    stock: 15,
    description: 'Dầu cá cô đặc siêu tinh khiết hỗ trợ tim mạch và trí não vượt trội.',
    ingredients: 'Dầu cá tự nhiên',
    usage_guide: 'Uống 2 viên mỗi ngày sau ăn.',
    benefits: 'Tốt cho tim, não, khớp.',
    warnings: 'Tránh xa tầm tay trẻ em.',
    image_url: null,
    category_id: 2,
    is_active: true,
    average_rating: 4.8,
    total_reviews: 1240,
    created_at: '',
    updated_at: ''
  },
  {
    id: 102,
    name: 'Multivitamin Daily Alive! Multi-System Booster',
    slug: 'multivitamin-daily-alive',
    sku: 'NWAY-92415',
    brand: "Nature's Way",
    price: 320000,
    sale_price: null,
    stock: 8,
    description: 'Cung cấp 23 loại vitamin khoáng chất cùng tinh chất rau củ quả hữu cơ.',
    ingredients: 'Vitamin A, C, D, E, K, B-complex',
    usage_guide: 'Nhai 1 viên mỗi sáng.',
    benefits: 'Tăng cường đề kháng toàn diện.',
    warnings: 'Không dùng quá liều khuyên dùng.',
    image_url: null,
    category_id: 1,
    is_active: true,
    average_rating: 4.5,
    total_reviews: 320,
    created_at: '',
    updated_at: ''
  },
  {
    id: 103,
    name: 'Organic Ashwagandha Stress Relief 450mg',
    slug: 'organic-ashwagandha-stress-relief',
    sku: 'NOW-04610',
    brand: 'Now Foods',
    price: 580000,
    sale_price: 460000,
    stock: 20,
    description: 'Nhân sâm Ấn Độ Ashwagandha hỗ trợ làm dịu thần kinh, giảm stress, ngủ ngon.',
    ingredients: 'Tinh chất Ashwagandha rễ khô hữu cơ',
    usage_guide: 'Uống 1 viên trước khi ngủ.',
    benefits: 'Giảm cortisol, ngủ ngon giấc.',
    warnings: 'Phụ nữ mang thai không nên dùng.',
    image_url: null,
    category_id: 6,
    is_active: true,
    average_rating: 4.7,
    total_reviews: 842,
    created_at: '',
    updated_at: ''
  },
  {
    id: 104,
    name: '100% Gold Standard Whey Protein Isolate Double Rich Chocolate',
    slug: 'whey-protein-gold-standard',
    sku: 'ON-31045',
    brand: 'Optimum Nutrition',
    price: 1200000,
    sale_price: 999000,
    stock: 5,
    description: 'Sữa whey cô đặc tinh khiết hỗ trợ xây dựng cơ bắp nhanh chóng sau tập.',
    ingredients: 'Whey Protein Isolate, BCAA',
    usage_guide: 'Pha 1 muỗng với 250ml nước lạnh, uống ngay sau tập.',
    benefits: 'Phục hồi cơ bắp cấp tốc.',
    warnings: 'Chứa thành phần từ sữa.',
    image_url: null,
    category_id: 3,
    is_active: true,
    average_rating: 4.9,
    total_reviews: 4122,
    created_at: '',
    updated_at: ''
  },
  {
    id: 105,
    name: 'Hydrolyzed Collagen Peptides Type I & III',
    slug: 'hydrolyzed-collagen-peptides',
    sku: 'SR-29402',
    brand: 'Sports Research',
    price: 850000,
    sale_price: null,
    stock: 12,
    description: 'Collagen thủy phân siêu nhỏ giúp hấp thụ tối đa cho làn da sáng mịn và móng tóc bóng khỏe.',
    ingredients: 'Collagen Bovine Peptides',
    usage_guide: 'Pha 1 muỗng vào cafe, sinh tố hoặc trà.',
    benefits: 'Đẹp da, móng tóc chắc khỏe.',
    warnings: 'Bảo quản nơi khô ráo thoáng mát.',
    image_url: null,
    category_id: 4,
    is_active: true,
    average_rating: 4.6,
    total_reviews: 512,
    created_at: '',
    updated_at: ''
  },
  {
    id: 106,
    name: 'LactoBif Probiotics 30 Billion CFU Balanced Support',
    slug: 'lactobif-probiotics-30-billion',
    sku: 'LB-08492',
    brand: 'LactoBif',
    price: 390000,
    sale_price: 312000,
    stock: 0,
    description: 'Men vi sinh 30 tỷ lợi khuẩn giúp bảo vệ tối ưu hệ tiêu hóa và tăng miễn dịch.',
    ingredients: '8 chủng khuẩn có lợi đã thử nghiệm lâm sàng',
    usage_guide: 'Uống 1 viên mỗi ngày kèm hoặc không kèm thức ăn.',
    benefits: 'Ổn định đường ruột, hỗ trợ ruột kích thích.',
    warnings: 'Nên bảo quản lạnh sau khi mở seal.',
    image_url: null,
    category_id: 5,
    is_active: true,
    average_rating: 4.7,
    total_reviews: 215,
    created_at: '',
    updated_at: ''
  }
];

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const [catsRes, prodsRes] = await Promise.all([
          categoryService.getCategories(0, 50).catch((err) => {
            console.warn('Failed to fetch categories, falling back to mock.', err);
            return FALLBACK_CATEGORIES;
          }),
          productService.getProducts({ limit: 100 }).catch((err) => {
            console.warn('Failed to fetch products, falling back to mock.', err);
            return FALLBACK_PRODUCTS;
          })
        ]);

        setCategories(catsRes && catsRes.length > 0 ? catsRes : FALLBACK_CATEGORIES);
        setProducts(prodsRes && prodsRes.length > 0 ? prodsRes : FALLBACK_PRODUCTS);
      } catch (error) {
        console.error('Data initialization failed', error);
        setCategories(FALLBACK_CATEGORIES);
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  return (
    <div className="relative bg-white text-slate-800 min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        <HeroCarousel />
        <TrustBadges />
        <CategoryGrid categories={categories} loading={loading} />
        <SuperDeals products={products} loading={loading} />
        <AiRecommendations products={products} loading={loading} />
        <BestSellers products={products} loading={loading} />
      </div>
    </div>
  );
}
