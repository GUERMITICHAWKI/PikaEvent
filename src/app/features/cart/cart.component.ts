import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart-item.model';

@Component({
    selector: 'app-cart',
    imports: [CommonModule, RouterLink],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss'
})
export class CartComponent {

  cartItems  = computed(() => this.cartService.cartItems());
  cartCount  = computed(() => this.cartService.cartCount());
  cartTotal  = computed(() => this.cartService.cartTotal());
  isEmpty    = computed(() => this.cartService.cartCount() === 0);

  constructor(private cartService: CartService) {}

  increase(item: CartItem) {
    this.cartService.updateQty(item.product.id, item.quantity + 1);
  }

  decrease(item: CartItem) {
    this.cartService.updateQty(item.product.id, item.quantity - 1);
  }

  remove(productId: number) {
    this.cartService.remove(productId);
  }

  clear() {
    this.cartService.clear();
  }

  formatPrice(price: number): string {
    return this.cartService.formatPrice(price);
  }
}