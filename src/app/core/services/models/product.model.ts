export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  description: string;
  details: { label: string; value: string }[];
  isPromo: boolean;
  isBestSeller?: boolean;
  rating?: number;
  reviewCount?: number;
  includes?: string;
}

export type SortOption =
  | 'default'
  | 'popularity'
  | 'rating'
  | 'newest'
  | 'price-asc'
  | 'price-desc';