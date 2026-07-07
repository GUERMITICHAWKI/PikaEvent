# Pika Event 🌸

Site e-commerce de décoration handmade pour événements (mariages, anniversaires, baby shower, fiançailles) sur le marché tunisien.

## 📋 Description

Pika Event est une application web développée avec Angular permettant de présenter et vendre des packs de décoration faits main. Le site met en avant des créations artisanales uniques avec une expérience utilisateur soignée, un design premium, et une navigation fluide sur mobile comme sur desktop.

## 🛠️ Stack technique

- **Framework** : Angular 22 (standalone components, signals)
- **Styles** : Tailwind CSS
- **Langage** : TypeScript
- **Gestion d'état** : Angular Signals (products, panier, favoris)
- **Routing** : Angular Router avec lazy loading par route

## ✨ Fonctionnalités

- Page d'accueil avec hero animé, produits populaires, argumentaire de confiance
- Boutique avec filtres par catégorie
- Fiche produit détaillée avec galerie d'images, produits similaires, données structurées SEO (JSON-LD)
- Panier responsive avec gestion des quantités
- Liste de favoris (wishlist) avec bouton cœur sur chaque carte produit
- Mode sombre / mode clair
- Formulaire de contact
- SEO dynamique par page (title, meta description, Open Graph, JSON-LD Schema.org Product)
- Design responsive mobile-first
- Animations au scroll (Intersection Observer)
- Site optimisé performance (Lighthouse : 94 Performance / 90 Accessibilité / 100 Bonnes pratiques / 91 SEO en build de production)

## 🚀 Installation et lancement

### Prérequis

- Node.js v22.22.0 ou supérieur
- npm

### Étapes

```bash
# Cloner le repo
git clone <url-du-repo>
cd pika-event

# Installer les dépendances
npm install

# Lancer le serveur de développement
ng serve
```

Le site est accessible sur `http://localhost:4200`.

### Build de production

```bash
ng build
```

Les fichiers optimisés sont générés dans `dist/pika-event/browser`. Pour les tester localement :

```bash
npx http-server dist/pika-event/browser -p 8080
```

## 📁 Structure du projet

```
src/app/
├── core/
│   ├── models/          # Interfaces (Product, etc.)
│   └── services/        # Services (Cart, Wishlist, Product, Seo, Theme)
├── features/
│   ├── home/
│   ├── shop/
│   ├── product-detail/
│   ├── cart/
│   ├── contact/
│   ├── wishlist/
│   └── not-found/
└── shared/
    └── components/      # Navbar, Footer, ProductCard, Toast
```

## 📱 Responsive

Le site est conçu mobile-first et testé sur différentes tailles d'écran (mobile, tablette, desktop) avec des ajustements spécifiques (grilles adaptatives, tailles de police, espacements).

## 🔍 SEO

Chaque route définit ses propres `title`/`description` (voir `app.routes.ts`), appliqués dynamiquement via `SeoService`. Les fiches produits génèrent également des données structurées JSON-LD (Schema.org `Product`) pour améliorer l'affichage dans les résultats de recherche.

## 👤 Auteur

Projet développé par Chawki — Pika Event, décoration handmade en Tunisie.