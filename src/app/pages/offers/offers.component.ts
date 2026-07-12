import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OfferService } from '../../core/services/offer.service';
import { SlicePipe } from '@angular/common';


@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [RouterLink,SlicePipe],
  templateUrl: './offers.component.html'
})
export class OffersComponent {

  offers = computed(() => this.offerService.activeOffers());

  constructor(private offerService: OfferService) {}

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
      FLASH_SALE: 'Vente flash ⚡',
      PROGRESSIVE_STOCK: 'Stock limité',
      TIERED_QUANTITY: 'Par quantité',
      GIFT: 'Cadeau 🎁'
    };
    return labels[type] || type;
  }
}