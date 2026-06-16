export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  brand: string | null;
  price: number;
  sale_price: number | null;
  stock: number;
  
  description: string | null;
  ingredients: string | null;
  usage_guide: string | null;
  benefits: string | null;
  warnings: string | null;
  
  image_url: string | null;
  category_id: number;
  is_active: boolean;
  
  average_rating: number;
  total_reviews: number;
  
  created_at: string;
  updated_at: string;

  category?: Category;
}

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}
