import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'produits',
        loadComponent: () => import('./pages/product-list/product-list').then(m => m.ProductListComponent)
      },
      {
        path: 'produits/nouveau',
        loadComponent: () => import('./pages/product-form/product-form').then(m => m.ProductFormComponent)
      },
      {
        path: 'produits/:id/modifier',
        loadComponent: () => import('./pages/product-form/product-form').then(m => m.ProductFormComponent)
      },
      {
        path: 'commandes',
        loadComponent: () => import('./pages/order-list/order-list').then(m => m.OrderListComponent)
      },
      {
        path: 'offres',
        loadComponent: () => import('./pages/offer-list/offer-list').then(m => m.OfferListComponent)
      },
      {
        path: 'offres/nouvelle',
        loadComponent: () => import('./pages/offer-form/offer-form').then(m => m.OfferFormComponent)
      },
      {
        path: 'offres/:id/modifier',
        loadComponent: () => import('./pages/offer-form/offer-form').then(m => m.OfferFormComponent)
      }
    ]
  }
];