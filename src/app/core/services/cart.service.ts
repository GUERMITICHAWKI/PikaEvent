import { Injectable, signal, computed, effect } from '@angular/core';
import { CartItem, AppliedOffer } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { ToastService } from './toast.service';
import { OfferService } from './offer.service';
import { ProductService } from './product.service';

const CART_STORAGE_KEY = 'pika-event-cart';

@Injectable({ providedIn: 'root' })
export class CartService {

  readonly STANDARD_SHIPPING_FEE = 7000;

  private items = signal<CartItem[]>(this.loadFromStorage());

  cartItems  = computed(() => this.items());
  cartCount  = computed(() => this.items().reduce((s, i) => s + i.quantity, 0));

  cartTotal  = computed(() => this.items().reduce((s, i) => {
    const unitPrice = i.appliedOffer?.unitPrice ?? i.product.price;
    return s + unitPrice * i.quantity;
  }, 0));

  // --- FLASH_SALE ---
  flashSaleOffer = computed(() => {
    const now = new Date();
    return this.offerService.activeOffers().find(o => {
      if (o.type !== 'FLASH_SALE' || o.value == null) return false;
      if (o.startDate && new Date(o.startDate) > now) return false;
      if (o.endDate && new Date(o.endDate) < now) return false;
      return true;
    }) ?? null;
  });

  flashSaleDiscount = computed(() => {
    const offer = this.flashSaleOffer();
    if (!offer || offer.value == null) return 0;
    const base = this.eligibleSubtotal(offer);
    return Math.round(base * offer.value / 100);
  });

  // --- PERCENTAGE (remises simples hors vente flash) ---
  percentageDiscount = computed(() => {
    const offers = this.offerService.activeOffers().filter(o => o.type === 'PERCENTAGE' && o.value != null);
    return offers.reduce((total, offer) => {
      const base = this.eligibleSubtotal(offer);
      return total + Math.round(base * offer.value! / 100);
    }, 0);
  });

  // --- FIXED_AMOUNT ---
  fixedAmountDiscount = computed(() => {
    const offers = this.offerService.activeOffers().filter(o => o.type === 'FIXED_AMOUNT' && o.value != null);
    return offers.reduce((total, offer) => {
      const base = this.eligibleSubtotal(offer);
      return total + Math.min(offer.value!, base);
    }, 0);
  });

  // --- BOGO (1 acheté = 1 offert/réduit) ---
  bogoDiscount = computed(() => {
    const offers = this.offerService.activeOffers().filter(o => o.type === 'BOGO' && o.value != null);
    return offers.reduce((total, offer) => {
      const targets = this.eligibleItems(offer);
      const totalQty = targets.reduce((s, i) => s + i.quantity, 0);
      if (totalQty < 2) return total;

      const prices = targets.map(i => i.appliedOffer?.unitPrice ?? i.product.price);
      const cheapestPrice = Math.min(...prices);
      const pairs = Math.floor(totalQty / 2);
      const discountPerItem = Math.round(cheapestPrice * offer.value! / 100);
      return total + discountPerItem * pairs;
    }, 0);
  });

  // --- BUNDLE (lot de produits différents à prix fixe) ---
  bundleDiscount = computed(() => {
    const offers = this.offerService.activeOffers().filter(o =>
      o.type === 'BUNDLE' && o.value != null && o.targetProducts.length > 0
    );
    return offers.reduce((total, offer) => {
      const currentItems = this.items().filter(i => i.appliedOffer?.type !== 'GIFT');
      const allPresent = offer.targetProducts.every(tp =>
        currentItems.some(i => i.product.id === tp.id)
      );
      if (!allPresent) return total;

      const normalTotal = offer.targetProducts.reduce((s, tp) => {
        const item = currentItems.find(i => i.product.id === tp.id);
        const price = item?.appliedOffer?.unitPrice ?? item?.product.price ?? 0;
        return s + price;
      }, 0);

      return total + Math.max(0, normalTotal - offer.value!);
    }, 0);
  });

  // --- TIERED_QUANTITY (remise par palier, même produit ou combiné) ---
  tieredQuantityDiscount = computed(() => {
    const offers = this.offerService.activeOffers().filter(o =>
      o.type === 'TIERED_QUANTITY' && o.tiers && o.tiers.length > 0
    );

    return offers.reduce((total, offer) => {
      const targets = this.eligibleItems(offer);

      if (offer.sameProductOnly) {
        const byProduct = new Map<number, { qty: number; subtotal: number }>();
        for (const item of targets) {
          const price = item.appliedOffer?.unitPrice ?? item.product.price;
          const entry = byProduct.get(item.product.id) ?? { qty: 0, subtotal: 0 };
          entry.qty += item.quantity;
          entry.subtotal += price * item.quantity;
          byProduct.set(item.product.id, entry);
        }
        let sub = 0;
        for (const { qty, subtotal } of byProduct.values()) {
          const tier = this.bestTier(offer.tiers, qty);
          if (tier) sub += Math.round(subtotal * tier.discountPercentage / 100);
        }
        return total + sub;
      } else {
        const qty = targets.reduce((s, i) => s + i.quantity, 0);
        const subtotal = this.eligibleSubtotal(offer);
        const tier = this.bestTier(offer.tiers, qty);
        return total + (tier ? Math.round(subtotal * tier.discountPercentage / 100) : 0);
      }
    }, 0);
  });

  // --- FREE_SHIPPING ---
  freeShippingOffer = computed(() => {
    const paidSubtotal = this.cartTotal();
    return this.offerService.activeOffers().find(o =>
      o.type === 'FREE_SHIPPING' && o.minCartAmount != null && paidSubtotal >= o.minCartAmount
    ) ?? null;
  });

  shippingFee = computed(() => this.freeShippingOffer() ? 0 : this.STANDARD_SHIPPING_FEE);

  // Total de toutes les remises combinées
  totalDiscount = computed(() =>
    this.flashSaleDiscount() +
    this.percentageDiscount() +
    this.fixedAmountDiscount() +
    this.bogoDiscount() +
    this.bundleDiscount() +
    this.tieredQuantityDiscount()
  );

  // Total final de la commande
  orderTotal = computed(() =>
    this.cartTotal() - this.totalDiscount() + this.shippingFee()
  );

  constructor(
    private toastService: ToastService,
    private offerService: OfferService,
    private productService: ProductService
  ) {
    effect(() => {
      this.saveToStorage(this.items());
    });

    effect(() => {
      this.syncGifts();
    });
  }

  add(product: Product, qty = 1, appliedOffer?: AppliedOffer): void {
    this.items.update(list => {
      const existing = list.find(i =>
        i.product.id === product.id &&
        i.appliedOffer?.offerId === appliedOffer?.offerId
      );
      if (existing) {
        return list.map(i =>
          (i.product.id === product.id && i.appliedOffer?.offerId === appliedOffer?.offerId)
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...list, { product, quantity: qty, appliedOffer }];
    });

    this.toastService.show(`${product.name} ajouté au panier`, 'success', '🛒');
  }

  remove(productId: number, offerId?: number): void {
    this.items.update(list =>
      list.filter(i => !(i.product.id === productId && i.appliedOffer?.offerId === offerId))
    );
  }

  updateQty(productId: number, qty: number, offerId?: number): void {
    if (qty <= 0) { this.remove(productId, offerId); return; }
    this.items.update(list =>
      list.map(i =>
        (i.product.id === productId && i.appliedOffer?.offerId === offerId)
          ? { ...i, quantity: qty }
          : i
      )
    );
  }

  clear(): void {
    this.items.set([]);
  }

  formatPrice(millimes: number): string {
    return (millimes / 1000).toFixed(3) + ' ت.د';
  }

  // -- Utilitaires internes pour les calculs de remise --

  private matchesProduct(offer: { targetProducts: { id: number }[] }, productId: number): boolean {
    return offer.targetProducts.length === 0 || offer.targetProducts.some(p => p.id === productId);
  }

  private eligibleItems(offer: { targetProducts: { id: number }[] }): CartItem[] {
    return this.items().filter(i =>
      i.appliedOffer?.type !== 'GIFT' && this.matchesProduct(offer, i.product.id)
    );
  }

  private eligibleSubtotal(offer: { targetProducts: { id: number }[] }): number {
    return this.eligibleItems(offer).reduce(
      (s, i) => s + (i.appliedOffer?.unitPrice ?? i.product.price) * i.quantity, 0
    );
  }

  private bestTier(tiers: { minQuantity: number; discountPercentage: number }[], qty: number) {
    return tiers
      .filter(t => qty >= t.minQuantity)
      .sort((a, b) => b.minQuantity - a.minQuantity)[0] ?? null;
  }

  private syncGifts(): void {
    const offers = this.offerService.activeOffers().filter(o =>
      o.type === 'GIFT' && o.minCartAmount != null && o.giftProduct
    );

    if (offers.length === 0) return;

    const currentList = this.items();

    const paidTotal = currentList
      .filter(i => i.appliedOffer?.type !== 'GIFT')
      .reduce((s, i) => s + (i.appliedOffer?.unitPrice ?? i.product.price) * i.quantity, 0);

    let list = currentList;
    let changed = false;

    for (const offer of offers) {
      const eligible = paidTotal >= (offer.minCartAmount ?? Infinity);
      const existingIndex = list.findIndex(i =>
        i.appliedOffer?.offerId === offer.id && i.appliedOffer?.type === 'GIFT'
      );

      if (eligible && existingIndex === -1) {
        const giftProductFull = this.productService.products().find(p => p.id === offer.giftProduct!.id);
        if (giftProductFull) {
          list = [...list, {
            product: giftProductFull,
            quantity: 1,
            appliedOffer: {
              offerId: offer.id,
              title: offer.title,
              type: offer.type,
              unitPrice: 0
            }
          }];
          changed = true;
          this.toastService.show(`🎁 Cadeau ajouté : ${giftProductFull.name}`, 'success', '🎁');
        }
      } else if (!eligible && existingIndex !== -1) {
        list = list.filter((_, idx) => idx !== existingIndex);
        changed = true;
      }
    }

    if (changed) {
      this.items.set(list);
    }
  }

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Erreur lecture panier localStorage', e);
      return [];
    }
  }

  private saveToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Erreur sauvegarde panier localStorage', e);
    }
  }
}