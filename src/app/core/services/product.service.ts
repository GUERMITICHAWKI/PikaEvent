import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, SortOption } from '../models/product.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Structure exacte renvoyée par le backend Spring Boot
interface CategoryApi {
  id: number;
  key: string;
  label: string;
}

interface ProductApi {
  id: number;
  name: string;
  slug: string;
  category: string; // "AMOUR_CHIC", "AROUSSA", etc. — plus un objet
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl: string;
  description: string;
  details: string;
  isPromo: boolean;
  rating?: number;
  reviewCount?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {

  private readonly apiUrl = 'http://localhost:8080/api/products';

  // Signal contenant les produits transformés, prêt à l'emploi pour les templates
  private readonly _products = signal<Product[]>([]);
  readonly products = this._products.asReadonly();

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.http.get<ProductApi[]>(this.apiUrl).subscribe({
      next: (data) => this._products.set(data.map(p => this.transform(p))),
      error: (err) => console.error('Erreur chargement produits :', err)
    });
  }

  // Convertit un produit reçu du backend vers le format attendu par l'app Angular
  private transform(p: ProductApi): Product {
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category.toLowerCase().replace(/_/g, '-'), // AMOUR_CHIC -> amour-chic
      price: p.price,
      originalPrice: p.originalPrice,
      discount: p.discount,
      images: [p.imageUrl],
      description: p.description,
      details: (p.details || '')
        .split('|')
        .map(part => part.trim())
        .filter(part => part.length > 0)
        .map(part => {
          const [label, ...rest] = part.split(':');
          return { label: label.trim(), value: rest.join(':').trim() };
        }),
      isPromo: p.isPromo,
      isBestSeller: false,
      rating: p.rating,
      reviewCount: p.reviewCount
    };
  }

  getAll(): Product[] {
    return this._products();
  }

  getBySlug(slug: string): Product | undefined {
    return this._products().find(p => p.slug === slug);
  }

  getByCategory(category: string): Product[] {
    if (category === 'tous') return this._products();
    return this._products().filter(p => p.category === category);
  }

  getSimilar(product: Product, limit = 3): Product[] {
    return this._products()
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, limit);
  }

  getPopular(limit = 6): Observable<Product[]> {
  return this.http.get<ProductApi[]>(`${this.apiUrl}/popular?limit=${limit}`)
    .pipe(map(data => data.map(p => this.transform(p))));
}

  getCategories(): { key: string; label: string; icon: string }[] {
    return [
      { key: 'tous',       label: 'Tous',        icon: 'sparkle' },
      { key: 'amour-chic', label: 'Amour Chic',  icon: 'heart'   },
      { key: 'aroussa',    label: 'Aroussa',     icon: 'ring'    },
      { key: 'rayhan',     label: 'Rayhan',      icon: 'flower'  },
      { key: 'ritej',      label: 'Ritej',       icon: 'leaf'    },
      { key: 'autre',      label: 'Autre',       icon: 'sparkle' },
    ];
  }

  sort(products: Product[], option: SortOption): Product[] {
    const list = [...products];
    switch (option) {
      case 'price-asc':  return list.sort((a, b) => a.price - b.price);
      case 'price-desc': return list.sort((a, b) => b.price - a.price);
      case 'rating':     return list.sort((a, b) => (b.rating||0) - (a.rating||0));
      default:           return list;
    }
  }

  formatPrice(millimes: number): string {
    return (millimes / 1000).toFixed(3) + ' ت.د';
  }
}