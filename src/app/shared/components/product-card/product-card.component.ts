import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCartEvent = new EventEmitter<Product>();

  isFavorite = computed(() => this.wishlistService.isInWishlist(this.product.id));

  constructor(
    private productService: ProductService,
    public wishlistService: WishlistService
  ) {}

  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
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