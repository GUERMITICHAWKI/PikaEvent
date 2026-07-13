export interface OfferProductRef {
[x: string]: any|string;
  id: number;
  name: string;
  imageUrl?: string;
}

export interface OfferTier {
  minQuantity: number;
  discountPercentage: number;
}

export interface PublicOffer {
  sameProductOnly: any;
  id: number;
  title: string;
  description?: string;
  type: string;
  value?: number;
  minCartAmount?: number;
  startDate?: string;
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