import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component')
        .then(m => m.HomeComponent)
  },
  {
    path: 'boutique',
    loadComponent: () =>
      import('./features/shop/shop.component')
        .then(m => m.ShopComponent)
  },
  {
    path: 'produit/:slug',
    loadComponent: () =>
      import('./features/product-detail/product-detail.component')
        .then(m => m.ProductDetailComponent)
  },
  {
    path: 'panier',
    loadComponent: () =>
      import('./features/cart/cart.component')
        .then(m => m.CartComponent)
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/contact.component')
        .then(m => m.ContactComponent)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component')
        .then(m => m.NotFoundComponent)
  }
];