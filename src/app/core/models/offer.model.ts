export enum OfferType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE_SHIPPING = 'FREE_SHIPPING',
  BOGO = 'BOGO',
  BUNDLE = 'BUNDLE',
  FLASH_SALE = 'FLASH_SALE',
  PROGRESSIVE_STOCK = 'PROGRESSIVE_STOCK',
  TIERED_QUANTITY = 'TIERED_QUANTITY',
  GIFT = 'GIFT'
}

export const OFFER_TYPE_LABELS: Record<OfferType, string> = {
  [OfferType.PERCENTAGE]: 'Remise en pourcentage',
  [OfferType.FIXED_AMOUNT]: 'Remise montant fixe',
  [OfferType.FREE_SHIPPING]: 'Livraison gratuite',
  [OfferType.BOGO]: 'Un acheté = un offert/réduit',
  [OfferType.BUNDLE]: 'Lot de produits (bundle)',
  [OfferType.FLASH_SALE]: 'Vente flash',
  [OfferType.PROGRESSIVE_STOCK]: 'Remise selon stock',
  [OfferType.TIERED_QUANTITY]: 'Remise par palier de quantité',
  [OfferType.GIFT]: 'Cadeau offert'
};

export interface OfferTier {
  minQuantity: number;
  discountPercentage: number;
}

export interface OfferProductRef {
  id: number;
  name: string;
  imageUrl?: string;
}

export interface Offer {
  id: number;
  title: string;
  description?: string;
  type: OfferType;
  value?: number;
  minCartAmount?: number;
  stockThreshold?: number;
  startDate?: string;
  endDate?: string;
  active: boolean;
  promoCode?: string;
  sameProductOnly: boolean;
  targetProducts: OfferProductRef[];
  giftProduct?: OfferProductRef;
  tiers: OfferTier[];
  currentlyValid: boolean;
}

export interface OfferRequest {
  title: string;
  description?: string;
  type: OfferType;
  value?: number;
  minCartAmount?: number;
  stockThreshold?: number;
  startDate?: string;
  endDate?: string;
  active: boolean;
  promoCode?: string;
  sameProductOnly: boolean;
  targetProductIds: number[];
  giftProductId?: number;
  tiers: OfferTier[];
}

export interface AppSettings {
  id: number;
  offersPageVisible: boolean;
}