import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings, PublicOffer } from '../models/offer.model';

@Injectable({ providedIn: 'root' })
export class OfferService {

  private readonly apiUrl = 'http://localhost:8080/api/offers';

  private readonly _activeOffers = signal<PublicOffer[]>([]);
  readonly activeOffers = this._activeOffers.asReadonly();

  private readonly _settings = signal<AppSettings | null>(null);
  readonly settings = this._settings.asReadonly();

  // Vente flash actuellement en cours (endDate dans le futur), s'il y en a une
  readonly activeFlashSale = computed(() => {
    const now = new Date();
    return this._activeOffers().find(o =>
      o.type === 'FLASH_SALE' && o.endDate && new Date(o.endDate) > now
    ) ?? null;
  });

  constructor(private http: HttpClient) {
    this.loadActiveOffers();
    this.loadSettings();
  }

  private loadActiveOffers(): void {
    this.http.get<PublicOffer[]>(`${this.apiUrl}/active`).subscribe({
      next: (data) => this._activeOffers.set(data),
      error: (err) => console.error('Erreur chargement offres :', err)
    });
  }

  private loadSettings(): void {
    this.http.get<AppSettings>(`${this.apiUrl}/settings`).subscribe({
      next: (data) => this._settings.set(data),
      error: (err) => console.error('Erreur chargement paramètres :', err)
    });
  }

  private matchesProduct(offer: PublicOffer, productId: number): boolean {
    return offer.targetProducts.length === 0 || offer.targetProducts.some(p => p.id === productId);
  }

  isProductOnOffer(productId: number): boolean {
    return this._activeOffers().some(offer => this.matchesProduct(offer, productId));
  }

  getOfferForProduct(productId: number): PublicOffer | null {
    const offers = this._activeOffers().filter(offer =>
      offer.targetProducts.length > 0 && offer.targetProducts.some(p => p.id === productId)
    );
    return offers.length > 0 ? offers[0] : null;
  }

  getOffersForProduct(productId: number): PublicOffer[] {
    return this._activeOffers().filter(offer => this.matchesProduct(offer, productId));
  }
}