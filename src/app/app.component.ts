import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastComponent],
  template: `
    <app-navbar />
    <main class="min-h-screen">
      <router-outlet />
    </main>
    <app-footer />
    <app-toast />
  `
})
export class AppComponent {
  constructor(private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }
}