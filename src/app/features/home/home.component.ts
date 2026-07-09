import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Product } from '../../core/models/product.model';

@Component({
    selector: 'app-home',
    imports: [RouterLink, ProductCardComponent],
    templateUrl: './home.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './home.component.scss'
})
export class HomeComponent {

  activeCategory = signal<string>('tous');
  isTransitioning = signal<boolean>(false);

  categories = this.productService.getCategories();

  allProducts = signal<Product[]>([]);

  filteredProducts = computed(() => {
    const cat = this.activeCategory();
    return cat === 'tous'
      ? this.allProducts()
      : this.allProducts().filter(p => p.category === cat);
  });

  categoryCounts = computed(() => {
    const counts: Record<string, number> = { tous: this.allProducts().length };
    this.categories.forEach(c => {
      if (c.key !== 'tous') {
        counts[c.key] = this.allProducts().filter(p => p.category === c.key).length;
      }
    });
    return counts;
  });

  features = [
    { icon: '🚚', title: 'Livraison gratuite',  desc: 'Partout en Tunisie' },
    { icon: '💛', title: 'Emballé avec amour',  desc: 'Chaque commande soignée' },
    { icon: '⭐', title: 'Service excellent',   desc: 'Satisfaction garantie' },
    { icon: '🎁', title: 'Pièces uniques',      desc: '100% handmade originales' }
  ];

  stats = [
    { value: '500+', label: 'Clients satisfaits' },
    { value: '24',   label: 'Packs disponibles' },
    { value: '100%', label: 'Handmade' },
    { value: '5★',   label: 'Note moyenne' }
  ];

  heromainLoaded: any;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService
  ) {
    this.productService.getPopular(6).subscribe(products => {
      this.allProducts.set(products);
    });
  }

  setCategory(cat: string) {
    if (cat === this.activeCategory()) return;
    this.isTransitioning.set(true);
    setTimeout(() => {
      this.activeCategory.set(cat);
      this.isTransitioning.set(false);
    }, 150);
  }

  addToCart(product: Product) {
    this.cartService.add(product);
    this.toastService.show(`${product.name} ajouté au panier !`);
  }

  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
  }
}