import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Product, SortOption } from '../../core/models/product.model';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductCardComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {

  allProducts = signal<Product[]>([]);
  selectedCategory = signal<string>('tous');
  selectedSort = signal<SortOption>('default');
  searchQuery = signal<string>('');

  categories = [
    { key: 'tous',             label: 'Tous' },
    { key: 'packs-decoration', label: 'Packs Décoration' },
  ];

  sortOptions = [
    { key: 'default',    label: 'Tri par défaut' },
    { key: 'popularity', label: 'Tri par popularité' },
    { key: 'rating',     label: 'Tri par notes' },
    { key: 'newest',     label: 'Plus récent' },
    { key: 'price-asc',  label: 'Prix croissant' },
    { key: 'price-desc', label: 'Prix décroissant' },
  ];

  filteredProducts = computed(() => {
    let list = this.allProducts();

    // Filtre catégorie
    if (this.selectedCategory() !== 'tous') {
      list = list.filter(p => p.category === this.selectedCategory());
    }

    // Filtre recherche
    if (this.searchQuery().trim()) {
      const q = this.searchQuery().toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Tri
    return this.productService.sort(list, this.selectedSort());
  });

  productCount = computed(() => this.filteredProducts().length);

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.allProducts.set(this.productService.getAll());
  }

  setCategory(cat: string) {
    this.selectedCategory.set(cat);
  }

  setSort(event: Event) {
    const val = (event.target as HTMLSelectElement).value as SortOption;
    this.selectedSort.set(val);
  }

  setSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  addToCart(product: Product) {
    this.cartService.add(product);
  }

  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
  }
}