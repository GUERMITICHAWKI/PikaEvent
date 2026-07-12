export interface OfferProductRef {
  id: number;
  name: string;
  imageUrl?: string;
}

export interface OfferTier {
  minQuantity: number;
  discountPercentage: number;
}

export interface PublicOffer {
  id: number;
  title: string;
  description?: string;
  type: string;
  value?: number;
  minCartAmount?: number;
  endDate?: string;
  promoCode?: string;
  targetProducts: OfferProductRef[];
  giftProduct?: OfferProductRef;
  tiers: OfferTier[];
}

export interface AppSettings {
  id: number;
  offersPageVisible: boolean;
}