import { Component, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Product } from '../../core/models/product.model';

@Component({
    selector: 'app-product-detail',
    imports: [RouterLink, ProductCardComponent],
    templateUrl: './product-detail.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {

  private currentSlug = signal<string | null>(null);

  product = signal<Product | null>(null);
  similarProducts = signal<Product[]>([]);
  quantity = signal<number>(1);
  selectedImage = signal<number>(0);
  addedToCart = signal<boolean>(false);

  stars = computed(() => {
    const rating = this.product()?.rating || 0;
    return [1, 2, 3, 4, 5].map(s => ({
      full:  s <= Math.floor(rating),
      half:  s === Math.ceil(rating) && rating % 1 !== 0,
      empty: s > Math.ceil(rating)
    }));
  });

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private seoService: SeoService
  ) {
    // Met à jour le signal à chaque changement de route (nouveau slug dans l'URL)
    this.route.params.subscribe(params => {
      this.currentSlug.set(params['slug'] ?? null);
    });

    // Se redéclenche quand le slug change OU quand les produits arrivent/changent
    effect(() => {
      const slugValue = this.currentSlug();
      const products = this.productService.products();

      if (!slugValue || products.length === 0) return;

      const product = this.productService.getBySlug(slugValue);

      if (product) {
        this.product.set(product);
        this.seoService.update({
          title: product.name,
          description: product.description?.slice(0, 155) || `Découvrez ${product.name}, une création handmade Pika Event.`
        });
        this.seoService.setProductJsonLd({
          name: product.name,
          description: product.description || `${product.name}, création handmade Pika Event.`,
          image: product.images?.[0],
          price: product.price,
          currency: 'TND'
        });
        this.similarProducts.set(
          this.productService.getSimilar(product, 3)
        );
        this.selectedImage.set(0);
        this.quantity.set(1);
      }
    });
  }

  increaseQty() {
    this.quantity.update(q => q + 1);
  }

  decreaseQty() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart() {
    const product = this.product();
    if (product) {
      this.cartService.add(product, this.quantity());
      this.addedToCart.set(true);
      setTimeout(() => this.addedToCart.set(false), 2500);
    }
  }

  addSimilarToCart(product: Product) {
    this.cartService.add(product);
  }

  selectImage(index: number) {
    this.selectedImage.set(index);
  }

  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
  }
}