import { Product } from './product.model';

export interface AppliedOffer {
  offerId: number;
  title: string;
  type: string;
  unitPrice: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  appliedOffer?: AppliedOffer;
}