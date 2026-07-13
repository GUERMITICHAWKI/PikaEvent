import { Component, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OfferService } from '../../core/services/offer.service';
import { ProductService } from '../../core/services/product';
import { OfferType, OFFER_TYPE_LABELS, OfferRequest, OfferTier } from '../../core/models/offer.model';
import { Product } from '../../core/models/product.model';

interface OfferFormState {
  title: string;
  description: string;
  type: OfferType;
  value: string;
  minCartAmount: string;
  stockThreshold: string;
  startDate: string;
  endDate: string;
  active: boolean;
  promoCode: string;
  sameProductOnly: boolean;
  targetProductIds: number[];
  giftProductId: number | null;
}

@Component({
  selector: 'app-offer-form',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './offer-form.html'
})
export class OfferFormComponent implements OnInit {

  offerId = signal<number | null>(null);
  isEditMode = computed(() => this.offerId() !== null);

  // PROGRESSIVE_STOCK et BOGO retirés du choix : plus proposés à la création,
  // mais la logique reste en place au cas où d'anciennes offres de ces types existeraient déjà.
  offerTypes = Object.values(OfferType).filter(
    t => t !== OfferType.PROGRESSIVE_STOCK && t !== OfferType.BOGO
  );
  typeLabels = OFFER_TYPE_LABELS;

  allProducts = computed(() => this.productService.products());

  form = signal<OfferFormState>({
    title: '',
    description: '',
    type: OfferType.PERCENTAGE,
    value: '',
    minCartAmount: '',
    stockThreshold: '',
    startDate: '',
    endDate: '',
    active: true,
    promoCode: '',
    sameProductOnly: false,
    targetProductIds: [],
    giftProductId: null
  });

  tiers = signal<OfferTier[]>([]);

  loading = signal(false);
  error = signal('');
  submitAttempted = signal(false);

  // Quels champs afficher selon le type sélectionné
  showValue = computed(() =>
    [OfferType.PERCENTAGE, OfferType.FIXED_AMOUNT, OfferType.FLASH_SALE, OfferType.BOGO,
     OfferType.BUNDLE, OfferType.PROGRESSIVE_STOCK].includes(this.form().type)
  );
  valueLabel = computed(() => {
    switch (this.form().type) {
      case OfferType.FIXED_AMOUNT: return 'Montant de la remise (millimes)';
      case OfferType.BUNDLE: return 'Prix fixe du lot (millimes)';
      case OfferType.BOGO: return 'Remise sur le 2e article (%)';
      default: return 'Valeur de la remise (%)';
    }
  });
  showMinCartAmount = computed(() => [OfferType.FREE_SHIPPING, OfferType.GIFT].includes(this.form().type));
  showStockThreshold = computed(() => this.form().type === OfferType.PROGRESSIVE_STOCK);
  showDates = computed(() => [OfferType.FLASH_SALE, OfferType.PERCENTAGE, OfferType.FIXED_AMOUNT].includes(this.form().type));
  showTargetProducts = computed(() =>
    [OfferType.PERCENTAGE, OfferType.FIXED_AMOUNT, OfferType.BOGO, OfferType.BUNDLE,
     OfferType.PROGRESSIVE_STOCK, OfferType.TIERED_QUANTITY].includes(this.form().type)
  );
  showSameProductOnly = computed(() => this.form().type === OfferType.TIERED_QUANTITY);
  showTiers = computed(() => this.form().type === OfferType.TIERED_QUANTITY);
  showGiftProduct = computed(() => this.form().type === OfferType.GIFT);

  errors = computed(() => {
    const f = this.form();
    return {
      title: !f.title.trim(),
      value: this.showValue() && (!f.value || Number(f.value) <= 0)
    };
  });

  isFormValid = computed(() => {
    const e = this.errors();
    return !e.title && !e.value;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offerService: OfferService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.offerId.set(id);
      this.loading.set(true);
      this.offerService.getById(id).subscribe({
        next: (offer) => {
          this.form.set({
            title: offer.title,
            description: offer.description || '',
            type: offer.type,
            value: offer.value != null ? String(offer.value) : '',
            minCartAmount: offer.minCartAmount != null ? String(offer.minCartAmount) : '',
            stockThreshold: offer.stockThreshold != null ? String(offer.stockThreshold) : '',
            startDate: offer.startDate ? offer.startDate.slice(0, 16) : '',
            endDate: offer.endDate ? offer.endDate.slice(0, 16) : '',
            active: offer.active,
            promoCode: offer.promoCode || '',
            sameProductOnly: offer.sameProductOnly,
            targetProductIds: offer.targetProducts.map(p => p.id),
            giftProductId: offer.giftProduct?.id ?? null
          });
          this.tiers.set(offer.tiers || []);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Offre introuvable.');
          this.loading.set(false);
        }
      });
    }
  }

  updateField<K extends keyof OfferFormState>(field: K, value: OfferFormState[K]) {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  toggleTargetProduct(productId: number) {
    this.form.update(f => {
      const exists = f.targetProductIds.includes(productId);
      return {
        ...f,
        targetProductIds: exists
          ? f.targetProductIds.filter(id => id !== productId)
          : [...f.targetProductIds, productId]
      };
    });
  }

  isProductTargeted(productId: number): boolean {
    return this.form().targetProductIds.includes(productId);
  }

  addTier() {
    this.tiers.update(t => [...t, { minQuantity: 2, discountPercentage: 10 }]);
  }

  removeTier(index: number) {
    this.tiers.update(t => t.filter((_, i) => i !== index));
  }

  updateTier(index: number, field: keyof OfferTier, value: number) {
    this.tiers.update(t => t.map((tier, i) => i === index ? { ...tier, [field]: value } : tier));
  }

  onSubmit() {
    this.submitAttempted.set(true);

    if (!this.isFormValid()) {
      this.error.set('Veuillez remplir les champs obligatoires (titre, valeur).');
      return;
    }

    this.error.set('');
    this.loading.set(true);

    const f = this.form();
    const payload: OfferRequest = {
      title: f.title.trim(),
      description: f.description.trim() || undefined,
      type: f.type,
      value: f.value ? Number(f.value) : undefined,
      minCartAmount: f.minCartAmount ? Number(f.minCartAmount) : undefined,
      stockThreshold: f.stockThreshold ? Number(f.stockThreshold) : undefined,
      startDate: f.startDate || undefined,
      endDate: f.endDate || undefined,
      active: f.active,
      promoCode: f.promoCode.trim() || undefined,
      sameProductOnly: f.sameProductOnly,
      targetProductIds: f.targetProductIds,
      giftProductId: f.giftProductId ?? undefined,
      tiers: this.tiers()
    };

    const request = this.isEditMode()
      ? this.offerService.update(this.offerId()!, payload)
      : this.offerService.create(payload);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/offres']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Erreur lors de l\'enregistrement : ' + err.message);
      }
    });
  }
}