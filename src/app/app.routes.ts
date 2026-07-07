import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component')
        .then(m => m.HomeComponent),
    data: {
      title: 'Décoration Handmade Tunisie | Pika Event',
      description: 'Pika Event : décoration handmade sur-mesure en Tunisie. Packs pour mariages, anniversaires, baby shower et fiançailles. Livraison gratuite en Tunisie.'
    }
  },
  {
    path: 'boutique',
    loadComponent: () =>
      import('./features/shop/shop.component')
        .then(m => m.ShopComponent),
    data: {
      title: 'Packs Décoration Mariage & Anniversaire',
      description: 'Tous nos packs de décoration handmade : mariage, anniversaire, baby shower, fiançailles. Créations uniques faites main, livraison gratuite en Tunisie.'
    }
  },
  {
    path: 'produit/:slug',
    loadComponent: () =>
      import('./features/product-detail/product-detail.component')
        .then(m => m.ProductDetailComponent)
    // Le title/description est défini dynamiquement dans le composant
    // (nom + description réelle du produit), pas ici.
  },
  {
    path: 'panier',
    loadComponent: () =>
      import('./features/cart/cart.component')
        .then(m => m.CartComponent),
    data: {
      title: 'Votre Panier',
      description: 'Consultez et gérez les articles de votre panier Pika Event avant de valider votre commande.'
    }
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/contact.component')
        .then(m => m.ContactComponent),
    data: {
      title: 'Contact',
      description: 'Contactez Pika Event pour commander vos packs de décoration handmade partout en Tunisie. Réponse rapide, livraison gratuite.'
    }
  },
  {
    path: 'favoris',
    loadComponent: () =>
      import('./features/wishlist/wishlist.component')
        .then(m => m.WishlistComponent),
    data: {
      title: 'Mes Favoris',
      description: 'Retrouvez tous vos produits favoris sélectionnés chez Pika Event.'
    }
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component')
        .then(m => m.NotFoundComponent),
    data: {
      title: 'Page introuvable',
      description: 'La page que vous recherchez n\'existe pas ou plus.'
    }
  }
];