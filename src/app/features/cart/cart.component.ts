import { Component, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart-item.model';

@Component({
    selector: 'app-cart',
    imports: [RouterLink],
    templateUrl: './cart.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './cart.component.scss'
})
export class CartComponent {

  cartItems  = computed(() => this.cartService.cartItems());
  cartCount  = computed(() => this.cartService.cartCount());
  cartTotal  = computed(() => this.cartService.cartTotal());
  isEmpty    = computed(() => this.cartService.cartCount() === 0);

  flashSaleOffer    = computed(() => this.cartService.flashSaleOffer());
  flashSaleDiscount = computed(() => this.cartService.flashSaleDiscount());
  shippingFee       = computed(() => this.cartService.shippingFee());
  orderTotal        = computed(() => this.cartService.orderTotal());

  constructor(private cartService: CartService) {}

  increase(item: CartItem) {
    this.cartService.updateQty(item.product.id, item.quantity + 1, item.appliedOffer?.offerId);
  }

  decrease(item: CartItem) {
    this.cartService.updateQty(item.product.id, item.quantity - 1, item.appliedOffer?.offerId);
  }

  remove(item: CartItem) {
    this.cartService.remove(item.product.id, item.appliedOffer?.offerId);
  }

  clear() {
    this.cartService.clear();
  }

  formatPrice(price: number): string {
    return this.cartService.formatPrice(price);
  }
}