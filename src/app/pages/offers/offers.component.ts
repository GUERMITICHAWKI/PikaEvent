import { Component, computed, signal, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { OfferService } from '../../core/services/offer.service';
import { PublicOffer } from '../../core/models/offer.model';

interface OfferTypeStyle {
  icon: string;
  badgeClasses: string;
  cardBorderClasses: string;
}

const TYPE_STYLES: Record<string, OfferTypeStyle> = {
  FLASH_SALE:         { icon: '⚡', badgeClasses: 'bg-red-500/10 text-red-500',       cardBorderClasses: 'border-red-500/40' },
  GIFT:               { icon: '🎁', badgeClasses: 'bg-green-500/10 text-green-500',   cardBorderClasses: 'border-green-500/30' },
  FREE_SHIPPING:      { icon: '🚚', badgeClasses: 'bg-blue-500/10 text-blue-400',     cardBorderClasses: 'border-blue-500/30' },
  BOGO:               { icon: '🛍️', badgeClasses: 'bg-purple-500/10 text-purple-400', cardBorderClasses: 'border-purple-500/30' },
  BUNDLE:             { icon: '📦', badgeClasses: 'bg-purple-500/10 text-purple-400', cardBorderClasses: 'border-purple-500/30' },
  TIERED_QUANTITY:    { icon: '📊', badgeClasses: 'bg-gold/10 text-gold',             cardBorderClasses: 'border-gold/40' },
  PROGRESSIVE_STOCK:  { icon: '📉', badgeClasses: 'bg-orange-500/10 text-orange-400', cardBorderClasses: 'border-orange-500/30' },
  PERCENTAGE:         { icon: '🔥', badgeClasses: 'bg-gold/10 text-gold',             cardBorderClasses: 'border-gold/40' },
  FIXED_AMOUNT:       { icon: '🔥', badgeClasses: 'bg-gold/10 text-gold',             cardBorderClasses: 'border-gold/40' },
};

const DEFAULT_STYLE: OfferTypeStyle = {
  icon: '✨',
  badgeClasses: 'bg-gold/10 text-gold',
  cardBorderClasses: 'border-gold/40'
};

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [RouterLink, SlicePipe],
  templateUrl: './offers.component.html'
})
export class OffersComponent implements OnDestroy {

  // Horloge interne pour le compte à rebours (mise à jour chaque seconde)
  private now = signal(new Date());
  private intervalId: ReturnType<typeof setInterval>;

  // Les ventes flash en cours sont remontées en premier
  offers = computed(() => {
    const list = [...this.offerService.activeOffers()];
    return list.sort((a, b) => {
      const aFlash = a.type === 'FLASH_SALE' ? 0 : 1;
      const bFlash = b.type === 'FLASH_SALE' ? 0 : 1;
      return aFlash - bFlash;
    });
  });

  constructor(private offerService: OfferService) {
    this.intervalId = setInterval(() => this.now.set(new Date()), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  formatPrice(millimes?: number): string {
    if (millimes == null) return '';
    return (millimes / 1000).toFixed(3) + ' ت.د';
  }

  typeBadgeLabel(type: string): string {
    const labels: Record<string, string> = {
      PERCENTAGE: 'Remise',
      FIXED_AMOUNT: 'Remise',
      FREE_SHIPPING: 'Livraison',
      BOGO: '1 acheté = 1 offert',
      BUNDLE: 'Lot',
      FLASH_SALE: 'Vente flash',
      PROGRESSIVE_STOCK: 'Stock limité',
      TIERED_QUANTITY: 'Par quantité',
      GIFT: 'Cadeau'
    };
    return labels[type] || type;
  }

  typeIcon(type: string): string {
    return (TYPE_STYLES[type] ?? DEFAULT_STYLE).icon;
  }

  badgeClasses(type: string): string {
    return (TYPE_STYLES[type] ?? DEFAULT_STYLE).badgeClasses;
  }

  cardBorderClasses(type: string): string {
    return (TYPE_STYLES[type] ?? DEFAULT_STYLE).cardBorderClasses;
  }

  // Ligne de valeur adaptée au type — plus de "value% de remise" générique pour tous les types
  valueLine(offer: PublicOffer): string | null {
    if (offer.value == null) return null;
    switch (offer.type) {
      case 'PERCENTAGE':
      case 'FLASH_SALE':
      case 'PROGRESSIVE_STOCK':
        return `${offer.value}% de remise`;
      case 'FIXED_AMOUNT':
        return `${this.formatPrice(offer.value)} de remise`;
      case 'BUNDLE':
        return `${this.formatPrice(offer.value)} le lot`;
      default:
        return null;
    }
  }

  // Compte à rebours pour les ventes flash avec une date de fin
  countdown(offer: PublicOffer): string | null {
    if (offer.type !== 'FLASH_SALE' || !offer.endDate) return null;

    const end = new Date(offer.endDate).getTime();
    const nowMs = this.now().getTime();
    const diff = end - nowMs;

    if (diff <= 0) return null;

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (days > 0) return `${days}j ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  }
}