import { CategoryEnum } from './category.enum';

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: CategoryEnum;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl?: string;
  description: string;
  details: string;
  isPromo: boolean;
  rating?: number;
  reviewCount?: number;
}

// Payload envoyé au backend (sans id, sans isPromo qui est calculé côté serveur)
export interface ProductPayload {
  name: string;
  slug: string;
  category: CategoryEnum;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl?: string;
  description: string;
  details: string;
  rating?: number;
  reviewCount?: number;
}