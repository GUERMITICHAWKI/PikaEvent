import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'produits', pathMatch: 'full' },
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
  }
];