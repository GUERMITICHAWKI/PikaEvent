import { Component, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './wishlist.component.html',
})
export class WishlistComponent {
  items = computed(() => this.wishlistService.wishlistItems());
  isEmpty = computed(() => this.items().length === 0);

  constructor(
    public wishlistService: WishlistService,
    private cartService: CartService,
    private productService: ProductService
  ) {}

  remove(productId: number) {
    this.wishlistService.remove(productId);
  }

  addToCart(product: Product) {
    this.cartService.add(product);
  }

  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
  }
}