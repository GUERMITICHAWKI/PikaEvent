import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Product, SortOption } from '../../core/models/product.model';

@Component({
    selector: 'app-shop',
    imports: [FormsModule, ProductCardComponent],
    templateUrl: './shop.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './shop.component.scss'
})
export class ShopComponent {

  selectedCategory = signal<string>('tous');
  selectedSort = signal<SortOption>('default');
  searchQuery = signal<string>('');
  isTransitioning = signal<boolean>(false);

  categories = this.productService.getCategories();

  categoryCounts = computed(() => {
    const counts: Record<string, number> = { tous: this.productService.products().length };
    this.categories.forEach(c => {
      if (c.key !== 'tous') {
        counts[c.key] = this.productService.products().filter(p => p.category === c.key).length;
      }
    });
    return counts;
  });

  sortOptions = [
    { key: 'default',    label: 'Tri par défaut' },
    { key: 'price-asc',  label: 'Prix croissant' },
    { key: 'price-desc', label: 'Prix décroissant' },
    { key: 'rating',     label: 'Tri par notes' },
  ];

  filteredProducts = computed(() => {
    let list = this.productService.products();

    if (this.selectedCategory() !== 'tous') {
      list = list.filter(p => p.category === this.selectedCategory());
    }

    if (this.searchQuery().trim()) {
      const q = this.searchQuery().toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    return this.productService.sort(list, this.selectedSort());
  });

  productCount = computed(() => this.filteredProducts().length);

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  private triggerTransition(action: () => void) {
    this.isTransitioning.set(true);
    setTimeout(() => {
      action();
      // Petit délai supplémentaire pour laisser le fondu d'entrée jouer
      setTimeout(() => this.isTransitioning.set(false), 20);
    }, 200);
  }

  setCategory(cat: string) {
    if (cat === this.selectedCategory()) return;
    this.triggerTransition(() => this.selectedCategory.set(cat));
  }

  setSort(event: Event) {
    const val = (event.target as HTMLSelectElement).value as SortOption;
    this.triggerTransition(() => this.selectedSort.set(val));
  }

  setSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val); // pas de transition sur la frappe, trop de saccades sinon
  }

  addToCart(product: Product) {
    this.cartService.add(product);
  }

  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
  }
}