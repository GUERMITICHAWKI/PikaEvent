import { Component, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { OfferService } from '../../core/services/offer.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Product } from '../../core/models/product.model';

@Component({
    selector: 'app-product-detail',
    imports: [RouterLink, ProductCardComponent],
    templateUrl: './product-detail.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {

  private currentSlug = signal<string | null>(null);

  product = signal<Product | null>(null);
  similarProducts = signal<Product[]>([]);
  quantity = signal<number>(1);
  selectedImage = signal<number>(0);
  addedToCart = signal<boolean>(false);

  // --- Toutes les offres actives pour ce produit ---
  productOffers = computed(() => {
    const p = this.product();
    const offers = p ? this.offerService.getOffersForProduct(p.id) : [];
    return offers;
  });

  // --- Priorité 1 : offre par palier de quantité (nécessite un choix utilisateur) ---
  selectedTierIndex = signal<number>(0);

  tieredOffer = computed(() => {
    const offer = this.productOffers().find(o => o.type === 'TIERED_QUANTITY' && o.tiers.length > 0);
    return offer ?? null;
  });

  // Paliers affichés : uniquement ceux saisis en admin, triés par quantité croissante.
  // Aucun palier "1 article / 0%" n'est ajouté automatiquement.
  displayTiers = computed(() => {
    const offer = this.tieredOffer();
    if (!offer) return [];
    return [...offer.tiers].sort((a, b) => a.minQuantity - b.minQuantity);
  });

  selectedTier = computed(() => {
    const tiers = this.displayTiers();
    return tiers.length > 0 ? tiers[this.selectedTierIndex()] : null;
  });

  tierUnitPrice = computed(() => {
    const p = this.product();
    const tier = this.selectedTier();
    if (!p || !tier) return 0;
    return Math.round(p.price * (1 - tier.discountPercentage / 100));
  });

  tierTotalPrice = computed(() => {
    const tier = this.selectedTier();
    return tier ? this.tierUnitPrice() * tier.minQuantity : 0;
  });

  // --- Priorité 2 : BOGO (1 acheté = 1 offert), pas de choix, quantité par pas de 2 ---
  bogoOffer = computed(() => {
    if (this.tieredOffer()) return null;
    return this.productOffers().find(o => o.type === 'BOGO') ?? null;
  });

  // --- Priorité 3 : remise automatique simple (PERCENTAGE, FIXED_AMOUNT, PROGRESSIVE_STOCK) ---
  autoDiscountOffer = computed(() => {
    if (this.tieredOffer() || this.bogoOffer()) return null;
    const offer = this.productOffers().find(o =>
      (o.type === 'PERCENTAGE' || o.type === 'FIXED_AMOUNT' || o.type === 'PROGRESSIVE_STOCK') && o.value != null
    );
    return offer ?? null;
  });

  // Prix unitaire effectif compte tenu d'une éventuelle offre automatique (BOGO ou remise simple)
  effectiveUnitPrice = computed(() => {
    const p = this.product();
    if (!p) return 0;

    if (this.bogoOffer()) {
      // 2 articles pour le prix d'1 → prix unitaire moyen = prix / 2
      return Math.round(p.price / 2);
    }

    const offer = this.autoDiscountOffer();
    if (offer && offer.value != null) {
      if (offer.type === 'FIXED_AMOUNT') {
        return Math.max(0, p.price - offer.value);
      }
      // PERCENTAGE et PROGRESSIVE_STOCK sont tous deux des remises en pourcentage
      return Math.round(p.price * (1 - offer.value / 100));
    }

    return p.price;
  });

  // --- BUNDLE : lot à prix fixe regroupant plusieurs produits ---
  bundleOffer = computed(() => {
    return this.productOffers().find(o => o.type === 'BUNDLE' && o.value != null) ?? null;
  });

  bundleProducts = computed(() => {
    const offer = this.bundleOffer();
    if (!offer) return [];
    const allProducts = this.productService.products();
    return offer.targetProducts
      .map(ref => allProducts.find(p => p.id === ref.id))
      .filter((p): p is Product => !!p);
  });

  bundleOriginalTotal = computed(() =>
    this.bundleProducts().reduce((s, p) => s + p.price, 0)
  );

  // --- Info livraison (cohérente avec l'offre FREE_SHIPPING active, sinon frais standard) ---
  freeShippingOffer = computed(() =>
    this.offerService.activeOffers().find(o => o.type === 'FREE_SHIPPING' && o.minCartAmount != null) ?? null
  );

  shippingFeeAmount = this.cartService.STANDARD_SHIPPING_FEE;

  stars = computed(() => {
    const rating = this.product()?.rating || 0;
    return [1, 2, 3, 4, 5].map(s => ({
      full:  s <= Math.floor(rating),
      half:  s === Math.ceil(rating) && rating % 1 !== 0,
      empty: s > Math.ceil(rating)
    }));
  });

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private offerService: OfferService,
    private seoService: SeoService
  ) {
    this.route.params.subscribe(params => {
      this.currentSlug.set(params['slug'] ?? null);
    });

    effect(() => {
      const slugValue = this.currentSlug();
      const products = this.productService.products();

      if (!slugValue || products.length === 0) return;

      const product = this.productService.getBySlug(slugValue);

      if (product) {
        this.product.set(product);
        this.seoService.update({
          title: product.name,
          description: product.description?.slice(0, 155) || `Découvrez ${product.name}, une création handmade Pika Event.`
        });
        this.seoService.setProductJsonLd({
          name: product.name,
          description: product.description || `${product.name}, création handmade Pika Event.`,
          image: product.images?.[0],
          price: product.price,
          currency: 'TND'
        });
        this.similarProducts.set(
          this.productService.getSimilar(product, 3)
        );
        this.selectedImage.set(0);
        this.selectedTierIndex.set(0);

        // Quantité initiale : 2 si une offre BOGO s'applique (sans palier concurrent), sinon 1
        const offers = this.offerService.getOffersForProduct(product.id);
        const hasTiered = offers.some(o => o.type === 'TIERED_QUANTITY' && o.tiers.length > 0);
        const hasBogo = !hasTiered && offers.some(o => o.type === 'BOGO');
        this.quantity.set(hasBogo ? 2 : 1);
      }
    });
  }

  selectTier(index: number) {
    this.selectedTierIndex.set(index);
  }

  increaseQty() {
    const step = this.bogoOffer() ? 2 : 1;
    this.quantity.update(q => q + step);
  }

  decreaseQty() {
    const step = this.bogoOffer() ? 2 : 1;
    const min = this.bogoOffer() ? 2 : 1;
    if (this.quantity() > min) {
      this.quantity.update(q => q - step);
    }
  }

  addToCart() {
    const product = this.product();
    if (!product) return;

    const tiered = this.tieredOffer();
    const bogo = this.bogoOffer();
    const autoDiscount = this.autoDiscountOffer();

    if (tiered) {
      const tier = this.selectedTier()!;
      this.cartService.add(product, tier.minQuantity, {
        offerId: tiered.id,
        title: tiered.title,
        type: tiered.type,
        unitPrice: this.tierUnitPrice()
      });
    } else if (bogo) {
      this.cartService.add(product, this.quantity(), {
        offerId: bogo.id,
        title: bogo.title,
        type: bogo.type,
        unitPrice: this.effectiveUnitPrice()
      });
    } else if (autoDiscount) {
      this.cartService.add(product, this.quantity(), {
        offerId: autoDiscount.id,
        title: autoDiscount.title,
        type: autoDiscount.type,
        unitPrice: this.effectiveUnitPrice()
      });
    } else {
      this.cartService.add(product, this.quantity());
    }

    this.addedToCart.set(true);
    setTimeout(() => this.addedToCart.set(false), 2500);
  }

  addSimilarToCart(product: Product) {
    this.cartService.add(product);
  }

  addBundleToCart() {
    const offer = this.bundleOffer();
    const products = this.bundleProducts();
    const originalTotal = this.bundleOriginalTotal();
    if (!offer || products.length === 0 || originalTotal === 0 || offer.value == null) return;

    products.forEach(p => {
      const unitPrice = Math.round((p.price * offer.value!) / originalTotal);
      this.cartService.add(p, 1, {
        offerId: offer.id,
        title: offer.title,
        type: offer.type,
        unitPrice
      });
    });

    this.addedToCart.set(true);
    setTimeout(() => this.addedToCart.set(false), 2500);
  }

  selectImage(index: number) {
    this.selectedImage.set(index);
  }

  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
  }
}