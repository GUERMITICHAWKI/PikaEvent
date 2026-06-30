import { Component, computed, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { ThemeService } from '../../../core/services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  menuOpen = signal(false);
  scrolled = signal(false);

  cartCount = computed(() => this.cartService.cartCount());

  constructor(
    private cartService: CartService,
    public themeService: ThemeService
  ) {}

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 80);
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}