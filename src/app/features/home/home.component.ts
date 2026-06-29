import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  popularProducts = signal<Product[]>([]);

  features = [
    {
      icon: '🚚',
      title: 'Livraison gratuite',
      desc: 'Livraison offerte sur toute la Tunisie'
    },
    {
      icon: '💛',
      title: 'Emballé avec amour',
      desc: 'Chaque commande soigneusement emballée'
    },
    {
      icon: '⭐',
      title: 'Service excellent',
      desc: 'Satisfaction client garantie'
    },
    {
      icon: '🎁',
      title: 'Pièces uniques',
      desc: 'Créations 100% handmade originales'
    }
  ];

  stats = [
    { value: '500+', label: 'Clients satisfaits' },
    { value: '24',   label: 'Packs disponibles' },
    { value: '100%', label: 'Handmade' },
    { value: '5★',   label: 'Note moyenne' }
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.popularProducts.set(this.productService.getPopular(6));
  }

  addToCart(product: Product) {
    this.cartService.add(product);
  }

  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
  }
}