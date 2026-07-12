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
  specialOffer = computed(() => this.offerService.getOfferForProduct(this.product.id));

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
      FREE_SHIPPING: 'Livraison offerte'
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