import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product';
import { OrderService } from '../../core/services/order';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html'
})
export class DashboardComponent {

  totalProducts = computed(() => this.productService.products().length);
  promoProducts = computed(() => this.productService.products().filter(p => p.isPromo).length);

  totalOrders = computed(() => this.orderService.orders().length);
  pendingOrders = computed(() =>
    this.orderService.orders().filter(o => o.status === 'EN_ATTENTE').length
  );
  totalRevenue = computed(() =>
    this.orderService.orders()
      .filter(o => o.status !== 'ANNULEE')
      .reduce((sum, o) => sum + o.total, 0)
  );

  recentOrders = computed(() => this.orderService.orders().slice(0, 5));

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  formatPrice(millimes: number): string {
    return (millimes / 1000).toFixed(3) + ' ت.د';
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  }
}