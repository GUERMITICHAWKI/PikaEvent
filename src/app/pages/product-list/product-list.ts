import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product';
import { CATEGORY_LABELS } from '../../core/models/category.enum';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-list.html'
})
export class ProductListComponent {

  products = computed(() => this.productService.products());
  categoryLabels = CATEGORY_LABELS;

  constructor(private productService: ProductService) {}

  deleteProduct(product: Product) {
    if (!confirm(`Supprimer "${product.name}" ? Cette action est irréversible.`)) return;
    this.productService.delete(product.id).subscribe({
      error: (err) => alert('Erreur lors de la suppression : ' + err.message)
    });
  }

  formatPrice(millimes: number): string {
    return (millimes / 1000).toFixed(3) + ' ت.د';
  }
}