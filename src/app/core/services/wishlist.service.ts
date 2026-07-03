import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../models/product.model';
import { ToastService } from './toast.service';

const WISHLIST_STORAGE_KEY = 'pika-event-wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistService {

  private items = signal<Product[]>(this.loadFromStorage());

  wishlistItems = computed(() => this.items());
  wishlistCount = computed(() => this.items().length);

  constructor(private toastService: ToastService) {
    effect(() => {
      this.saveToStorage(this.items());
    });
  }

  isInWishlist(productId: number): boolean {
    return this.items().some(p => p.id === productId);
  }

  toggle(product: Product): void {
    const exists = this.isInWishlist(product.id);
    if (exists) {
      this.items.update(list => list.filter(p => p.id !== product.id));
      this.toastService.show(`${product.name} retiré des favoris`, 'info', '💔');
    } else {
      this.items.update(list => [...list, product]);
      this.toastService.show(`${product.name} ajouté aux favoris`, 'success', '❤️');
    }
  }

  remove(productId: number): void {
    this.items.update(list => list.filter(p => p.id !== productId));
  }

  clear(): void {
    this.items.set([]);
  }

  private loadFromStorage(): Product[] {
    try {
      const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Erreur lecture wishlist localStorage', e);
      return [];
    }
  }

  private saveToStorage(items: Product[]): void {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Erreur sauvegarde wishlist localStorage', e);
    }
  }
}