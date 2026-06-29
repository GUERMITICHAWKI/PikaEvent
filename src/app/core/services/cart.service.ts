import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {

  private items = signal<CartItem[]>([]);

  cartItems  = computed(() => this.items());
  cartCount  = computed(() => this.items().reduce((s, i) => s + i.quantity, 0));
  cartTotal  = computed(() => this.items().reduce((s, i) => s + i.product.price * i.quantity, 0));

  add(product: Product, qty = 1): void {
    this.items.update(list => {
      const existing = list.find(i => i.product.id === product.id);
      if (existing) {
        return list.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...list, { product, quantity: qty }];
    });
  }

  remove(productId: number): void {
    this.items.update(list => list.filter(i => i.product.id !== productId));
  }

  updateQty(productId: number, qty: number): void {
    if (qty <= 0) { this.remove(productId); return; }
    this.items.update(list =>
      list.map(i => i.product.id === productId ? { ...i, quantity: qty } : i)
    );
  }

  clear(): void { this.items.set([]); }

  formatPrice(millimes: number): string {
    return (millimes / 1000).toFixed(3) + ' ت.د';
  }
}