import { Component, Input, Output, EventEmitter, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { OfferService } from '../../../core/services/offer.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCartEvent = new EventEmitter<Product>();

  isFavorite = computed(() => this.wishlistService.isInWishlist(this.product.id));

  // Offre affichée en badge (tous types confondus, hors offres panier-global grâce à getOfferForProduct)
  specialOffer = computed(() => this.offerService.getOfferForProduct(this.product.id));

  // Offre de remise automatique simple (PERCENTAGE, FIXED_AMOUNT, PROGRESSIVE_STOCK)
  // → celle qui doit modifier le prix affiché sur la carte, pour rester cohérent avec la fiche produit.
  autoDiscountOffer = computed(() => {
    const offers = this.offerService.getOffersForProduct(this.product.id);
    return offers.find(o =>
      (o.type === 'PERCENTAGE' || o.type === 'FIXED_AMOUNT' || o.type === 'PROGRESSIVE_STOCK') && o.value != null
    ) ?? null;
  });

  displayPrice = computed(() => {
    const offer = this.autoDiscountOffer();
    if (!offer || offer.value == null) return this.product.price;
    if (offer.type === 'FIXED_AMOUNT') {
      return Math.max(0, this.product.price - offer.value);
    }
    return Math.round(this.product.price * (1 - offer.value / 100));
  });

  displayOriginalPrice = computed(() => {
    return this.autoDiscountOffer() ? this.product.price : this.product.originalPrice;
  });

  // Le badge de réduction (coin haut-droit) n'apparaît QUE si une offre automatique
  // (PERCENTAGE, FIXED_AMOUNT, PROGRESSIVE_STOCK) est active — jamais à partir
  // du champ natif product.originalPrice seul.
  cardDiscountPercent = computed(() => {
    const offer = this.autoDiscountOffer();
    if (!offer) return null;
    const original = this.product.price;
    if (!original) return null;
    const pct = Math.round((1 - this.displayPrice() / original) * 100);
    return pct > 0 ? pct : null;
  });

  constructor(
    private productService: ProductService,
    public wishlistService: WishlistService,
    private offerService: OfferService
  ) {}

  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
  }

  specialOfferLabel(): string {
    const offer = this.specialOffer();
    if (!offer) return '';
    const labels: Record<string, string> = {
      GIFT: '🎁 Cadeau',
      BOGO: '1 acheté = 1 offert',
      BUNDLE: 'Lot disponible',
      TIERED_QUANTITY: 'Remise par quantité',
      FLASH_SALE: '⚡ Vente flash',
      FREE_SHIPPING: 'Livraison offerte',
      PERCENTAGE: '🔥 Promo',
      FIXED_AMOUNT: '🔥 Promo',
      PROGRESSIVE_STOCK: '⚡ Stock limité'
    };
    return labels[offer.type] || offer.title;
  }

  onAddToCart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.addToCartEvent.emit(this.product);
  }

  onToggleWishlist(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.wishlistService.toggle(this.product);
  }
}