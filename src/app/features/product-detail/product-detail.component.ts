import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Product } from '../../core/models/product.model';

@Component({
    selector: 'app-product-detail',
    imports: [RouterLink, ProductCardComponent],
    templateUrl: './product-detail.component.html',
    styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {

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
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      const product = this.productService.getBySlug(slug);
      if (product) {
        this.product.set(product);
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