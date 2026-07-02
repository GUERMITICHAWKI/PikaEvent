import { Component, computed, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { ThemeService } from '../../../core/services/theme.service';


@Component({
    selector: 'app-navbar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  menuOpen = signal(false);
  scrolled = signal(false);
  scrollProgress = signal(0);

  cartCount = computed(() => this.cartService.cartCount());

  constructor(
    private cartService: CartService,
    public themeService: ThemeService
  ) {}

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