import { Injectable } from '@angular/core';
import { Product, SortOption } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private products: Product[] = [
    {
      id: 1,
      name: 'Pack Amour Chic',
      slug: 'pack-amour-chic',
      category: 'packs-decoration',
      price: 49000,
      originalPrice: 59000,
      discount: 16,
      images: ['assets/images/products/p1.jpg'],
      description: 'Un pack romantique élégant pour vos occasions spéciales.',
      details: [
        { label: 'Pièces',   value: '6 pièces' },
        { label: 'Couleur',  value: 'Blanc avec détails rouges' },
        { label: 'Vase',     value: 'Ø 8 cm – H 9,2 cm' },
        { label: 'Mabkhra', value: 'Ø 8,5 cm × H 5,5 cm' }
      ],
      isPromo: true,
      isBestSeller: true,
      rating: 4,
      reviewCount: 12,
      includes: 'Fleurs séchées (gypsophile) et roses décoratives en plâtre peint.'
    },
    {
      id: 2,
      name: 'Pack Aroussa',
      slug: 'pack-aroussa',
      category: 'packs-decoration',
      price: 49000,
      originalPrice: 59000,
      discount: 16,
      images: ['assets/images/products/p2.jpg'],
      description: 'Le pack idéal pour célébrer la mariée.',
      details: [{ label: 'Plateau', value: '27 cm' }],
      isPromo: true,
      isBestSeller: true,
      rating: 5,
      reviewCount: 8
    },
    {
      id: 3,
      name: 'Pack Aroussa Avec Bougie',
      slug: 'pack-aroussa-bougie',
      category: 'packs-decoration',
      price: 59000,
      originalPrice: 69000,
      discount: 14,
      images: ['assets/images/products/p3.jpg'],
      description: 'Pack aroussa enrichi d\'une bougie décorative.',
      details: [{ label: 'Bougie', value: 'Incluse' }],
      isPromo: true,
      rating: 3.5,
      reviewCount: 5
    },
    {
      id: 4,
      name: 'Pack773',
      slug: 'pack-773',
      category: 'packs-decoration',
      price: 29900,
      originalPrice: 38000,
      discount: 21,
      images: ['assets/images/products/p4.jpg'],
      description: 'Pack décoratif élégant.',
      details: [{ label: 'Largeur', value: '17,6 cm' }],
      isPromo: true
    },
    {
      id: 5,
      name: 'Pack778',
      slug: 'pack-778',
      category: 'packs-decoration',
      price: 25000,
      originalPrice: 33000,
      discount: 24,
      images: ['assets/images/products/p5.jpg'],
      description: 'Pack moderne et raffiné.',
      details: [{ label: 'Largeur', value: '17,5 cm' }],
      isPromo: true
    },
    {
      id: 6,
      name: 'Pack771',
      slug: 'pack-771',
      category: 'packs-decoration',
      price: 27000,
      originalPrice: 35000,
      discount: 23,
      images: ['assets/images/products/p6.jpg'],
      description: 'Pack noir et or très tendance.',
      details: [{ label: 'Diamètre', value: '9,2 cm' }],
      isPromo: true
    }
  ];

  getAll(): Product[] { return this.products; }

  getBySlug(slug: string): Product | undefined {
    return this.products.find(p => p.slug === slug);
  }

  getSimilar(product: Product, limit = 3): Product[] {
    return this.products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, limit);
  }

  getPopular(limit = 6): Product[] {
    return this.products.filter(p => p.isBestSeller).slice(0, limit);
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