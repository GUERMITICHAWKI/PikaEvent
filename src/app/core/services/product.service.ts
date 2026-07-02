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
      images: ['assets/images/products/amour1.png'],
      description: 'Un plateau élégant avec calligraphie dorée pour célébrer l\'amour.',
      details: [
        { label: 'Nombre de pièces', value: '6 pièces' },
        { label: 'Couleur', value: 'Blanc avec des détails rouges' },
        { label: 'Boîte multifonction décorative', value: 'Ø 8 cm – H 8,6 cm' },
        { label: 'Vase', value: 'Ø 8 cm – H 9,2 cm' },
        { label: 'Porte-bougie', value: 'Ø 8,8 cm × H 4,3 cm' },
        { label: 'Mabkhra', value: 'Ø 8,5 cm × H 5,5 cm' },
        { label: 'Inclus', value: 'Composition florale mixte comprenant des fleurs séchées (gypsophile) et des roses décoratives en plâtre peint, avec de délicates finitions dorées.' }
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
      images: ['assets/images/products/aroussa1.png'],
      description: 'Le pack idéal pour célébrer la mariée, finition papillon doré.',
      details: [
        { label: 'Nombre de pièces', value: '6 pièces' },
        { label: 'Couleur', value: 'Blanc avec détails dorés élégants' },
        { label: 'Boîte multifonction décorative', value: 'Ø 8 cm – H 8,6 cm' },
        { label: 'Vase', value: 'Ø 8 cm – H 9,2 cm' },
        { label: 'Mabkhra', value: 'Ø 8,5 cm × H 5,5 cm' },
        { label: 'Décoration lune et mosquée', value: '8,6 × 9,2 cm' },
        { label: 'Inclus', value: 'Composition florale mixte comprenant des fleurs séchées (gypsophile) et des roses décoratives en plâtre peint, avec de délicates finitions dorées.' }
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
      images: ['assets/images/products/aroussabougie.png'],
      description: 'Pack Aroussa enrichi d\'une bougie décorative.',
      details: [
        { label: 'Nombre de pièces', value: '7 pièces' },
        { label: 'Couleur', value: 'Blanc avec détails dorés élégants' },
        { label: 'Boîte multifonction décorative', value: 'Ø 8 cm – H 8,6 cm' },
        { label: 'Vase', value: 'Ø 8 cm – H 9,2 cm' },
        { label: 'Porte-bougie', value: 'Ø 8,8 cm × H 4,3 cm' },
        { label: 'Mabkhra', value: 'Ø 8,5 cm × H 5,5 cm' },
        { label: 'Décoration lune et mosquée', value: '8,6 × 9,2 cm' },
        { label: 'Inclus', value: 'Composition florale mixte comprenant des fleurs séchées (gypsophile) et des roses décoratives en plâtre peint, avec de délicates finitions dorées.' }
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
      images: ['assets/images/products/rayhan1.png'],
      description: 'Plateau décoratif avec petits pots dorés et fleurs séchées.',
      details: [
        { label: 'Nombre de pièces', value: '6 pièces' },
        { label: 'Couleur', value: 'Beige avec détails dorés élégants' },
        { label: 'Boîte multifonction décorative', value: 'Ø 8 cm – H 8,6 cm' },
        { label: 'Vase', value: 'Ø 8 cm – H 9,2 cm' },
        { label: 'Mabkhra', value: 'Ø 8,5 cm × H 5,5 cm' },
        { label: 'Décoration lune et mosquée', value: '8,6 × 9,2 cm' },
        { label: 'Inclus', value: 'Composition florale mixte : fleurs séchées (gypsophile) et roses décoratives en plâtre peint avec finitions dorées.' }
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
      images: ['assets/images/products/ritej1.png'],
      description: 'Pack décoratif raffiné avec calligraphie et fleurs séchées.',
      details: [
        { label: 'Nombre de pièces', value: '6 pièces' },
        { label: 'Couleur', value: 'Marron avec détails dorés élégants' },
        { label: 'Boîte multifonction décorative', value: 'Ø 8 cm – H 8,6 cm' },
        { label: 'Vase', value: 'Ø 8 cm – H 9,2 cm' },
        { label: 'Mabkhra', value: 'Ø 8,5 cm × H 5,5 cm' },
        { label: 'Décoration lune et mosquée', value: '8,6 × 9,2 cm' },
        { label: 'Inclus', value: 'Composition florale mixte comprenant des fleurs séchées (gypsophile) et des roses décoratives en plâtre peint, avec de délicates finitions dorées.' }
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
      images: ['assets/images/products/ritej2boujie.png'],
      description: 'Pack Ritej enrichi d\'une bougie décorative.',
      details: [
        { label: 'Nombre de pièces', value: '7 pièces' },
        { label: 'Couleur', value: 'Marron avec détails dorés élégants' },
        { label: 'Boîte multifonction décorative', value: 'Ø 8 cm – H 8,6 cm' },
        { label: 'Vase', value: 'Ø 8 cm – H 9,2 cm' },
        { label: 'Porte-bougie', value: 'Ø 8,8 cm × H 4,3 cm' },
        { label: 'Mabkhra', value: 'Ø 8,5 cm × H 5,5 cm' },
        { label: 'Décoration lune et mosquée', value: '8,6 × 9,2 cm' },
        { label: 'Inclus', value: 'Composition florale mixte comprenant des fleurs séchées (gypsophile) et des roses décoratives en plâtre peint, avec de délicates finitions dorées.' }
      ],
      isPromo: true,
      isBestSeller: true,
      rating: 5,
      reviewCount: 4
    },

    // ===== NOUVEAUX PRODUITS — catégorie "Autre" =====

    {
      id: 7,
      name: 'Pack Rymes',
      slug: 'pack-rymes',
      category: 'autre',
      price: 49000,
      originalPrice: 59000,
      discount: 17,
      images: ['assets/images/products/rymes1.png'],
      description: 'Pack décoratif avec pots dorés et calligraphie, finition papillon.',
      details: [
        { label: 'Nombre de pièces', value: '6 pièces' },
        { label: 'Couleur', value: 'Beige-grégé avec détails dorés élégants' },
        { label: 'Boîte multifonction décorative', value: 'Ø 8 cm – H 8,6 cm' },
        { label: 'Vase', value: 'Ø 8 cm – H 9,2 cm' },
        { label: 'Mabkhra', value: 'Ø 8,5 cm × H 5,5 cm' },
        { label: 'Décoration lune et mosquée', value: '8,6 × 9,2 cm' },
        { label: 'Inclus', value: 'Composition florale mixte : fleurs séchées (gypsophile) et roses décoratives en plâtre peint avec finitions dorées.' }
      ],
      isPromo: true,
      rating: 4,
      reviewCount: 0
    },
    {
      id: 8,
      name: 'Pack770',
      slug: 'pack770',
      category: 'autre',
      price: 25000,
      originalPrice: 33000,
      discount: 24,
      images: ['assets/images/products/pack770.png'],
      description: 'Vase décoratif avec bougie et fleurs séchées dorées.',
      details: [
        { label: 'Nombre de pièces', value: '3 pièces' },
        { label: 'Couleur', value: 'Blanc marbré avec détails dorés élégants' },
        { label: 'Porte-bougie', value: 'Ø 8,8 cm × H 4,3 cm' },
        { label: 'Vase', value: 'Ø 8 cm – H 9,2 cm' },
        { label: 'Inclus', value: 'Composition florale mixte comprenant des fleurs séchées (gypsophile) et des roses décoratives en plâtre peint, avec de délicates finitions dorées.' }
      ],
      isPromo: true,
      rating: 4,
      reviewCount: 0
    },
    {
      id: 9,
      name: 'Pack771',
      slug: 'pack771',
      category: 'autre',
      price: 27000,
      originalPrice: 35000,
      discount: 23,
      images: ['assets/images/products/771.png'],
      description: 'Pack décoratif noir et doré avec fleurs séchées.',
      details: [
        { label: 'Nombre de pièces', value: '3 pièces' },
        { label: 'Couleur', value: 'Noir avec détails dorés élégants' },
        { label: 'Boîte multifonction décorative', value: 'Ø 8 cm – H 8,6 cm' },
        { label: 'Vase', value: 'Ø 8 cm – H 9,2 cm' },
        { label: 'Inclus', value: 'Composition florale mixte comprenant des fleurs séchées (gypsophile) et des roses décoratives en plâtre peint, avec de délicates finitions dorées.' }
      ],
      isPromo: true,
      rating: 4,
      reviewCount: 0
    },
    {
      id: 10,
      name: 'Pack772',
      slug: 'pack772',
      category: 'autre',
      price: 25000,
      originalPrice: 33000,
      discount: 24,
      images: ['assets/images/products/772.png'],
      description: 'Bougeoir et vase rose avec fleurs séchées.',
      details: [
        { label: 'Nombre de pièces', value: '3 pièces' },
        { label: 'Couleur', value: 'Rose marbré avec détails dorés élégants' },
        { label: 'Porte-bougie', value: 'Ø 8,8 cm × H 4,3 cm' },
        { label: 'Vase', value: 'Ø 8 cm – H 9,2 cm' },
        { label: 'Inclus', value: 'Composition florale mixte comprenant des fleurs séchées (gypsophile) et des roses décoratives en plâtre peint, avec de délicates finitions dorées.' }
      ],
      isPromo: true,
      rating: 4,
      reviewCount: 0
    },
    {
      id: 11,
      name: 'Pack773',
      slug: 'pack773',
      category: 'autre',
      price: 29900,
      originalPrice: 38000,
      discount: 21,
      images: ['assets/images/products/773.png'],
      description: 'Pack décoratif avec calligraphie "Mashallah" et pot doré.',
      details: [
        { label: 'Nombre de pièces', value: '4 pièces' },
        { label: 'Couleur', value: 'Blanc crème avec détails dorés élégants' },
        { label: 'Porte-bougie', value: 'Ø 8,8 cm × H 4,3 cm' },
        { label: 'Mabkhra', value: 'Ø 8,5 cm × H 5,5 cm' },
        { label: 'Inclus', value: 'Une bougie parfumée 100% cire de soja + des fleurs séchées.' }
      ],
      isPromo: true,
      rating: 4,
      reviewCount: 0
    },
    {
      id: 12,
      name: 'Pack774',
      slug: 'pack774',
      category: 'autre',
      price: 25000,
      originalPrice: 30000,
      discount: 17,
      images: ['assets/images/products/774.png'],
      description: 'Pack spécial Ramadan Kareem avec pince dorée.',
      details: [
        { label: 'Nombre de pièces', value: '3 pièces' },
        { label: 'Couleur', value: 'Blanc avec détails gris élégants' },
        { label: 'Mabkhra', value: 'Ø 8,5 cm × H 5,5 cm' }
      ],
      isPromo: true,
      rating: 4,
      reviewCount: 0
    },
    {
      id: 13,
      name: 'Pack775',
      slug: 'pack775',
      category: 'autre',
      price: 29900,
      originalPrice: 38000,
      discount: 21,
      images: ['assets/images/products/775.png'],
      description: 'Duo vase et pot doré avec fleurs séchées, base dorée.',
      details: [
        { label: 'Nombre de pièces', value: '3 pièces' },
        { label: 'Couleur', value: 'Beige avec détails dorés élégants' },
        { label: 'Porte-bougie', value: 'Ø 8 cm – H 3,8 cm' },
        { label: 'Vase', value: 'Ø 8 cm – H 9,2 cm' },
        { label: 'Inclus', value: 'Composition florale mixte : fleurs séchées (gypsophile) et roses décoratives en plâtre peint avec finitions dorées.' }
      ],
      isPromo: true,
      rating: 4,
      reviewCount: 0
    },
    {
      id: 14,
      name: 'Pack776',
      slug: 'pack776',
      category: 'autre',
      price: 25000,
      originalPrice: 30000,
      discount: 17,
      images: ['assets/images/products/776.png'],
      description: 'Plateau avec pot doré et calligraphie cœurs rouges.',
      details: [
        { label: 'Nombre de pièces', value: '3 pièces' },
        { label: 'Couleur', value: 'Blanc avec des détails rouges' },
        { label: 'Mabkhra', value: 'Ø 8,5 cm × H 5,5 cm' }
      ],
      isPromo: true,
      rating: 4,
      reviewCount: 0
    },
    {
      id: 15,
      name: 'Pack777',
      slug: 'pack777',
      category: 'autre',
      price: 29900,
      originalPrice: 38000,
      discount: 21,
      images: ['assets/images/products/777.png'],
      description: 'Duo pots dorés avec pince et fleurs séchées.',
      details: [
        { label: 'Nombre de pièces', value: '4 pièces' },
        { label: 'Couleur', value: 'Blanc avec détails dorés élégants' },
        { label: 'Boîte multifonction décorative', value: 'Ø 8 cm – H 8,6 cm' },
        { label: 'Mabkhra', value: 'Ø 8,5 cm × H 5,5 cm' }
      ],
      isPromo: true,
      rating: 4,
      reviewCount: 0
    },
    {
      id: 16,
      name: 'Pack778',
      slug: 'pack778',
      category: 'autre',
      price: 25000,
      originalPrice: 33000,
      discount: 24,
      images: ['assets/images/products/778.png'],
      description: 'Pack décoratif lune et pot doré, calligraphie "Tabsomri".',
      details: [
        { label: 'Nombre de pièces', value: '4 pièces' },
        { label: 'Couleur', value: 'Blanc avec détails gris élégants' },
        { label: 'Mabkhra', value: 'Ø 8,5 cm × H 5,5 cm' },
        { label: 'Décoration lune et mosquée', value: '8,6 × 9,2 cm' }
      ],
      isPromo: true,
      rating: 4,
      reviewCount: 0
    },
    {
      id: 17,
      name: 'Pack779',
      slug: 'pack779',
      category: 'autre',
      price: 25000,
      originalPrice: 30000,
      discount: 17,
      images: ['assets/images/products/779.png'],
      description: 'Pack décoratif avec pot doré, calligraphie "Mashallah".',
      details: [
        { label: 'Nombre de pièces', value: '3 pièces' },
        { label: 'Couleur', value: 'Blanc avec détails dorés' },
        { label: 'Mabkhra', value: 'Ø 8,5 cm × H 5,5 cm' }
      ],
      isPromo: true,
      rating: 4,
      reviewCount: 0
    },
    {
      id: 18,
      name: 'Pack781',
      slug: 'pack781',
      category: 'autre',
      price: 29900,
      originalPrice: 38000,
      discount: 21,
      images: ['assets/images/products/781.png'],
      description: 'Duo pots strié blanc et doré, calligraphie "Mashallah".',
      details: [
        { label: 'Nombre de pièces', value: '4 pièces' },
        { label: 'Couleur', value: 'Beige avec détails dorés élégants' },
        { label: 'Boîte multifonction décorative', value: 'Ø 8 cm – H 8,6 cm' },
        { label: 'Mabkhra', value: 'Ø 8,5 cm × H 5,5 cm' }
      ],
      isPromo: true,
      rating: 4,
      reviewCount: 0
    },
    {
      id: 19,
      name: 'Pack782',
      slug: 'pack782',
      category: 'autre',
      price: 29900,
      originalPrice: 38000,
      discount: 21,
      images: ['assets/images/products/782.png'],
      description: 'Pack spécial Ramadan avec feuilles dorées décoratives.',
      details: [
        { label: 'Nombre de pièces', value: '4 pièces' },
        { label: 'Couleur', value: 'Blanc avec détails dorés élégants' },
        { label: 'Boîte multifonction décorative', value: 'Ø 8 cm – H 8,6 cm' },
        { label: 'Mabkhra', value: 'Ø 8,5 cm × H 5,5 cm' }
      ],
      isPromo: true,
      rating: 4,
      reviewCount: 0
    },
    {
      id: 20,
      name: 'Pack783',
      slug: 'pack783',
      category: 'autre',
      price: 27000,
      originalPrice: 35000,
      discount: 23,
      images: ['assets/images/products/783.png'],
      description: 'Pack Ramadan avec lune décorative et pot doré "Ramadan".',
      details: [
        { label: 'Nombre de pièces', value: '4 pièces' },
        { label: 'Couleur', value: 'Blanc avec détails dorés élégants' },
        { label: 'Décoration lune et mosquée', value: '8,6 × 9,2 cm' },
        { label: 'Mabkhra', value: 'Ø 8,5 cm × H 7,7 cm' }
      ],
      isPromo: true,
      rating: 4,
      reviewCount: 0
    },
    {
      id: 21,
      name: 'Pack784',
      slug: 'pack784',
      category: 'autre',
      price: 25000,
      originalPrice: 30000,
      discount: 17,
      images: ['assets/images/products/784.png'],
      description: 'Plateau marbré avec pot doré, motifs lune et étoiles.',
      details: [
        { label: 'Nombre de pièces', value: '3 pièces' },
        { label: 'Couleur', value: 'Blanc avec détails marron élégants' },
        { label: 'Mabkhra', value: 'Ø 8,5 cm × H 7,7 cm' }
      ],
      isPromo: true,
      rating: 4,
      reviewCount: 0
    },
    {
      id: 22,
      name: 'Pack785',
      slug: 'pack785',
      category: 'autre',
      price: 29900,
      originalPrice: 38000,
      discount: 21,
      images: ['assets/images/products/785.png'],
      description: 'Pack décoratif avec pot doré et calligraphie, finition papillon.',
      details: [
        { label: 'Nombre de pièces', value: '4 pièces' },
        { label: 'Couleur', value: 'Blanc avec détails rouges' },
        { label: 'Boîte multifonction décorative', value: 'Ø 8 cm – H 8,6 cm' },
        { label: 'Mabkhra', value: 'Ø 8,5 cm × H 5,5 cm' }
      ],
      isPromo: true,
      rating: 4,
      reviewCount: 0
    },
    {
      id: 23,
      name: 'Pack786',
      slug: 'pack786',
      category: 'autre',
      price: 27000,
      originalPrice: 35000,
      discount: 23,
      images: ['assets/images/products/786.png'],
      description: 'Pack décoratif avec vase, fleurs séchées et silhouette romantique.',
      details: [
        { label: 'Nombre de pièces', value: '3 pièces' },
        { label: 'Couleur', value: 'Blanc avec détails rouges' },
        { label: 'Boîte multifonction décorative', value: 'Ø 8 cm – H 8,6 cm' },
        { label: 'Vase', value: 'Ø 8 cm – H 9,2 cm' },
        { label: 'Inclus', value: 'Composition florale mixte comprenant des fleurs séchées (gypsophile) et des roses décoratives en plâtre peint, avec de délicates finitions dorées.' }
      ],
      isPromo: true,
      rating: 4,
      reviewCount: 0
    },
    {
      id: 24,
      name: 'Pack787',
      slug: 'pack787',
      category: 'autre',
      price: 25000,
      originalPrice: 33000,
      discount: 24,
      images: ['assets/images/products/787.png'],
      description: 'Pack décoratif avec pot en forme de coquillage et fleurs séchées.',
      details: [
        { label: 'Nombre de pièces', value: '3 pièces' },
        { label: 'Couleur', value: 'Blanc avec détails rouges' },
        { label: 'Porte-bougie', value: 'Ø 8,8 cm × H 4,3 cm' },
        { label: 'Vase', value: 'Ø 8 cm – H 9,2 cm' },
        { label: 'Inclus', value: 'Composition florale mixte comprenant des fleurs séchées (gypsophile) et des roses décoratives en plâtre peint, avec de délicates finitions dorées.' }
      ],
      isPromo: true,
      rating: 4,
      reviewCount: 0
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