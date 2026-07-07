import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoData {
  title: string;
  description: string;
}

export interface ProductSeoData {
  name: string;
  description: string;
  image?: string;
  price: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
}

const SITE_NAME = 'Pika Event';
const JSON_LD_ID = 'seo-jsonld';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);

  update(data: SeoData): void {
    const fullTitle = data.title.includes(SITE_NAME)
      ? data.title
      : `${data.title} | ${SITE_NAME}`;

    // Title
    this.titleService.setTitle(fullTitle);

    // Meta description
    this.metaService.updateTag({ name: 'description', content: data.description });

    // Open Graph (sans og:url / og:image tant qu'il n'y a pas de domaine)
    this.metaService.updateTag({ property: 'og:title', content: fullTitle });
    this.metaService.updateTag({ property: 'og:description', content: data.description });

    // ⚠️ À ajouter une fois le domaine défini :
    // - og:url, og:image
    // - canonical (via updateCanonical ci-dessous)
    // - twitter:card, twitter:title, twitter:description, twitter:image
  }

  /**
   * Injecte les données structurées Schema.org "Product" en JSON-LD.
   * Permet à Google d'afficher prix / note / disponibilité directement
   * dans les résultats de recherche (rich snippets).
   * Fonctionne même sans domaine (les champs url/image absolus sont
   * simplement omis en attendant).
   */
  setProductJsonLd(product: ProductSeoData): void {
    const jsonLd: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency || 'TND',
        availability: product.inStock === false
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock'
      }
    };

    if (product.image) {
      jsonLd['image'] = product.image;
    }

    if (product.rating && product.reviewCount) {
      jsonLd['aggregateRating'] = {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount
      };
    }

    this.injectJsonLd(jsonLd);
  }

  /** Supprime le JSON-LD (utile en quittant une page produit). */
  clearJsonLd(): void {
    const existing = document.getElementById(JSON_LD_ID);
    existing?.remove();
  }

  private injectJsonLd(data: Record<string, any>): void {
    this.clearJsonLd();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = JSON_LD_ID;
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  // Prêt à l'emploi dès que vous aurez un domaine :
  //
  // private updateCanonical(url: string): void {
  //   let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
  //   if (!link) {
  //     link = document.createElement('link');
  //     link.setAttribute('rel', 'canonical');
  //     document.head.appendChild(link);
  //   }
  //   link.setAttribute('href', url);
  // }
}