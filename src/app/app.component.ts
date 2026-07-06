import { Component, HostListener, OnInit, signal, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { SeoService } from './core/services/seo.service';
import { ToastComponent } from './shared/components/toast/toast.component';
import{ProductService}from'./core/services/product.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule, ToastComponent, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  showBackToTop = signal(false);

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private seoService = inject(SeoService);

  @HostListener('window:scroll')
  onScroll() {
    this.showBackToTop.set(window.scrollY > 300);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit(): void {
    // À chaque navigation, on lit route.data.title/description
    // de la route active (y compris les enfants) et on met à jour
    // le <title> + les balises meta.
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute.firstChild;
          while (route?.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap(route => route?.data ?? [])
      )
      .subscribe(data => {
        if (data['title'] && data['description']) {
          this.seoService.update({
            title: data['title'],
            description: data['description']
          });
        }
      });
  }
}