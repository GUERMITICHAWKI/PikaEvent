import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OfferService } from '../../core/services/offer.service';
import { Offer, OFFER_TYPE_LABELS } from '../../core/models/offer.model';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-offer-list',
  standalone: true,
  imports: [RouterLink, SlicePipe],
  templateUrl: './offer-list.html'
})
export class OfferListComponent {

  offers = computed(() => this.offerService.offers());
  settings = computed(() => this.offerService.settings());
  typeLabels = OFFER_TYPE_LABELS;

  constructor(private offerService: OfferService) {}

  toggleActive(offer: Offer) {
    this.offerService.toggleActive(offer).subscribe({
      error: (err) => alert('Erreur : ' + err.message)
    });
  }

  toggleNavbar() {
    const current = this.settings()?.offersPageVisible ?? false;
    this.offerService.updateSettings(!current).subscribe({
      error: (err) => alert('Erreur : ' + err.message)
    });
  }

  deleteOffer(offer: Offer) {
    if (!confirm(`Supprimer l'offre "${offer.title}" ?`)) return;
    this.offerService.delete(offer.id).subscribe({
      error: (err) => alert('Erreur lors de la suppression : ' + err.message)
    });
  }
}