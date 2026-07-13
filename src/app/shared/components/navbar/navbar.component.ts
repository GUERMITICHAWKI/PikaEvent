import { Component, computed, HostListener, signal, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { ThemeService } from '../../../core/services/theme.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { OfferService } from '../../../core/services/offer.service';

@Component({
    selector: 'app-navbar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './navbar.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  menuOpen = signal(false);
  scrolled = signal(false);
  scrollProgress = signal(0);

  cartCount = computed(() => this.cartService.cartCount());
  wishlistCount = computed(() => this.wishlistService.wishlistCount());
  offersVisible = computed(() => this.offerService.settings()?.offersPageVisible ?? false);
  flashSale = computed(() => this.offerService.activeFlashSale());

  countdown = signal<string>('');
  private timerId: any;

  constructor(
    private cartService: CartService,
    public wishlistService: WishlistService,
    public themeService: ThemeService,
    private offerService: OfferService
  ) {}

  ngOnInit() {
    this.timerId = setInterval(() => this.updateCountdown(), 1000);
    this.updateCountdown();
  }

  ngOnDestroy() {
    if (this.timerId) clearInterval(this.timerId);
  }

  private updateCountdown() {
    const flash = this.flashSale();
    if (!flash || !flash.endDate) {
      this.countdown.set('');
      return;
    }
    const diff = new Date(flash.endDate).getTime() - Date.now();
    if (diff <= 0) {
      this.countdown.set('');
      return;
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    this.countdown.set(`${h}h ${m}m ${s}s`);
  }

  @HostListener('window:scroll')
  onScroll() {
    const scrollY = window.scrollY;
    this.scrolled.set(scrollY > 50);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress.set(docHeight > 0 ? (scrollY / docHeight) * 100 : 0);
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}