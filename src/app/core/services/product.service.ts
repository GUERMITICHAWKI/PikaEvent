import { Injectable } from '@angular/core';
import { Product, SortOption } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private products: Product[] = [
    {
      id: 1,
      name: 'Pack Amour Chic',
      slug: 'pack-amour-chic',
      category: 'amour-chic',
      price: 49000,
      originalPrice: 59000,
      discount: 17,
      images: ['assets/images/products/pack-amour-chic.jpg'],
      description: 'Un plateau élégant avec calligraphie dorée pour célébrer l\'amour.',
      details: [
        { label: 'Diamètre', value: '27 cm' },
        { label: 'Finition', value: 'Calligraphie rouge et or' }
      ],
      isPromo: true,
      isBestSeller: true,
      rating: 4,
      reviewCount: 12
    },
    {
      id: 2,
      name: 'Pack Aroussa',
      slug: 'pack-aroussa',
      category: 'aroussa',
      price: 49000,
      originalPrice: 59000,
      discount: 17,
      images: ['assets/images/products/pack-aroussa.jpg'],
      description: 'Le pack idéal pour célébrer la mariée, finition papillon doré.',
      details: [
        { label: 'Diamètre', value: '27 cm' }
      ],
      isPromo: true,
      rating: 5,
      reviewCount: 8
    },
    {
      id: 3,
      name: 'Pack Aroussa Avec Bougie',
      slug: 'pack-aroussa-bougie',
      category: 'aroussa',
      price: 59000,
      originalPrice: 69000,
      discount: 14,
      images: ['assets/images/products/pack-aroussa-bougie.jpg'],
      description: 'Pack Aroussa enrichi d\'une bougie décorative.',
      details: [
        { label: 'Bougie', value: 'Incluse' }
      ],
      isPromo: false,
      isBestSeller: true,
      rating: 4,
      reviewCount: 5
    },
    {
      id: 4,
      name: 'Pack Rayhan',
      slug: 'pack-rayhan',
      category: 'rayhan',
      price: 49000,
      originalPrice: 59000,
      discount: 17,
      images: ['assets/images/products/pack-rayhan.jpg'],
      description: 'Plateau décoratif avec petits pots dorés et fleurs séchées.',
      details: [
        { label: 'Composition', value: 'Pots dorés, fleurs séchées, encensoir' }
      ],
      isPromo: true,
      rating: 4.5,
      reviewCount: 6
    },
    {
      id: 5,
      name: 'Pack Ritej',
      slug: 'pack-ritej',
      category: 'ritej',
      price: 49000,
      originalPrice: 59000,
      discount: 17,
      images: ['assets/images/products/pack-ritej.jpg'],
      description: 'Pack décoratif raffiné avec calligraphie et fleurs séchées.',
      details: [
        { label: 'Diamètre', value: '9,6 cm' }
      ],
      isPromo: true,
      rating: 4,
      reviewCount: 3
    },
    {
      id: 6,
      name: 'Pack Ritej Avec Bougie',
      slug: 'pack-ritej-bougie',
      category: 'ritej',
      price: 59000,
      originalPrice: 69000,
      discount: 14,
      images: ['assets/images/products/pack-ritej-bougie.jpg'],
      description: 'Pack Ritej enrichi d\'une bougie décorative.',
      details: [
        { label: 'Bougie', value: 'Incluse' }
      ],
      isPromo: true,
      isBestSeller: true,
      rating: 5,
      reviewCount: 4
    },

    {
      id: 7,
      name: 'Pack Ritej Avec Bougie',
      slug: 'pack-ritej-bougie',
      category: 'ritej',
      price: 59000,
      originalPrice: 69000,
      discount: 14,
      images: ['assets/images/products/pack-ritej-bougie.jpg'],
      description: 'Pack Ritej enrichi d\'une bougie décorative.',
      details: [
        { label: 'Bougie', value: 'Incluse' }
      ],
      isPromo: true,
      isBestSeller: true,
      rating: 5,
      reviewCount: 4
    },
    {
      id: 7,
      name: 'Pack Ritej Avec Bougie',
      slug: 'pack-ritej-bougie',
      category: 'ritej',
      price: 59000,
      originalPrice: 69000,
      discount: 14,
      images: ['assets/images/products/pack-ritej-bougie.jpg'],
      description: 'Pack Ritej enrichi d\'une bougie décorative.',
      details: [
        { label: 'Bougie', value: 'Incluse' }
      ],
      isPromo: true,
      isBestSeller: true,
      rating: 5,
      reviewCount: 4
    },
    {
      id: 7,
      name: 'Pack Ritej Avec Bougie',
      slug: 'pack-ritej-bougie',
      category: 'ritej',
      price: 59000,
      originalPrice: 69000,
      discount: 14,
      images: ['assets/images/products/pack-ritej-bougie.jpg'],
      description: 'Pack Ritej enrichi d\'une bougie décorative.',
      details: [
        { label: 'Bougie', value: 'Incluse' }
      ],
      isPromo: true,
      isBestSeller: true,
      rating: 5,
      reviewCount: 4
    }
    
    
  ];
  

  getAll(): Product[] { return this.products; }

  getBySlug(slug: string): Product | undefined {
    return this.products.find(p => p.slug === slug);
  }

  getByCategory(category: string): Product[] {
    if (category === 'tous') return this.products;
    return this.products.filter(p => p.category === category);
  }

  getSimilar(product: Product, limit = 3): Product[] {
    return this.products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, limit);
  }

  getPopular(limit = 6): Product[] {
    return this.products.filter(p => p.isBestSeller).slice(0, limit);
  }

  getCategories(): { key: string; label: string; icon: string }[] {
    return [
      { key: 'tous',       label: 'Tous',        icon: '✨' },
      { key: 'amour-chic', label: 'Amour Chic',  icon: '💕' },
      { key: 'aroussa',    label: 'Aroussa',     icon: '💍' },
      { key: 'rayhan',     label: 'Rayhan',      icon: '🌸' },
      { key: 'ritej',      label: 'Ritej',       icon: '🌿' },
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