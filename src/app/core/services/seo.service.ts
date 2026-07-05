import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoData {
  title: string;
  description: string;
}

const SITE_NAME = 'Pika Event';

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