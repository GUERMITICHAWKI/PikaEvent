import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AppSettings, Offer, OfferRequest } from '../models/offer.model';

@Injectable({ providedIn: 'root' })
export class OfferService {

  private readonly apiUrl = 'http://localhost:8080/api/offers';

  private readonly _offers = signal<Offer[]>([]);
  readonly offers = this._offers.asReadonly();

  private readonly _settings = signal<AppSettings | null>(null);
  readonly settings = this._settings.asReadonly();

  constructor(private http: HttpClient) {
    this.loadOffers();
    this.loadSettings();
  }

  loadOffers(): void {
    this.http.get<Offer[]>(this.apiUrl).subscribe({
      next: (data) => this._offers.set([...data].sort((a, b) => b.id - a.id)),
      error: (err) => console.error('Erreur chargement offres :', err)
    });
  }

  loadSettings(): void {
    this.http.get<AppSettings>(`${this.apiUrl}/settings`).subscribe({
      next: (data) => this._settings.set(data),
      error: (err) => console.error('Erreur chargement paramètres :', err)
    });
  }

  getById(id: number): Observable<Offer> {
    return this.http.get<Offer>(`${this.apiUrl}/${id}`);
  }

  create(payload: OfferRequest): Observable<Offer> {
    return this.http.post<Offer>(this.apiUrl, payload).pipe(tap(() => this.loadOffers()));
  }

  update(id: number, payload: OfferRequest): Observable<Offer> {
    return this.http.put<Offer>(`${this.apiUrl}/${id}`, payload).pipe(tap(() => this.loadOffers()));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(tap(() => this.loadOffers()));
  }

  toggleActive(offer: Offer): Observable<Offer> {
    const payload: OfferRequest = {
      title: offer.title,
      description: offer.description,
      type: offer.type,
      value: offer.value,
      minCartAmount: offer.minCartAmount,
      stockThreshold: offer.stockThreshold,
      startDate: offer.startDate,
      endDate: offer.endDate,
      active: !offer.active,
      promoCode: offer.promoCode,
      sameProductOnly: offer.sameProductOnly,
      targetProductIds: offer.targetProducts.map(p => p.id),
      giftProductId: offer.giftProduct?.id,
      tiers: offer.tiers
    };
    return this.update(offer.id, payload);
  }

  updateSettings(visible: boolean): Observable<AppSettings> {
    return this.http.put<AppSettings>(`${this.apiUrl}/settings`, { offersPageVisible: visible })
      .pipe(tap((s) => this._settings.set(s)));
  }
}