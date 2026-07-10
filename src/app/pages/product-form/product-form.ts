import { Component, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product';
import { UploadService } from '../../core/services/upload';
import { CategoryEnum, CATEGORY_LABELS } from '../../core/models/category.enum';
import { ProductPayload } from '../../core/models/product.model';
import { ToastService } from '../../core/services/toast';


interface ProductFormState {
  name: string;
  slug: string;
  category: CategoryEnum;
  price: string;
  originalPrice: string;
  discount: string;
  description: string;
  details: string;
  rating: string;
  reviewCount: string;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-form.html'
})
export class ProductFormComponent implements OnInit {

  productId = signal<number | null>(null);
  isEditMode = computed(() => this.productId() !== null);

  categories = Object.values(CategoryEnum);
  categoryLabels = CATEGORY_LABELS;

  form = signal<ProductFormState>({
    name: '',
    slug: '',
    category: CategoryEnum.AUTRE,
    price: '',
    originalPrice: '',
    discount: '',
    description: '',
    details: '',
    rating: '',
    reviewCount: ''
  });

  // Image
  currentImageUrl = signal<string | null>(null);   // image déjà en base (mode édition)
  selectedFile = signal<File | null>(null);          // nouveau fichier choisi
  previewUrl = signal<string | null>(null);           // aperçu local du nouveau fichier

  loading = signal(false);
  uploading = signal(false);
  error = signal('');
  submitAttempted = signal(false);

  errors = computed(() => {
    const f = this.form();
    return {
      name: !f.name.trim(),
      slug: !f.slug.trim(),
      price: !f.price || Number(f.price) <= 0,
      description: !f.description.trim()
    };
  });

  isFormValid = computed(() => {
    const e = this.errors();
    return !e.name && !e.slug && !e.price && !e.description;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private uploadService: UploadService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.productId.set(id);
      this.loading.set(true);
      this.productService.getById(id).subscribe({
        next: (product) => {
          this.form.set({
            name: product.name,
            slug: product.slug,
            category: product.category,
            price: String(product.price),
            originalPrice: product.originalPrice ? String(product.originalPrice) : '',
            discount: product.discount ? String(product.discount) : '',
            description: product.description,
            details: product.details,
            rating: product.rating ? String(product.rating) : '',
            reviewCount: product.reviewCount ? String(product.reviewCount) : ''
          });
          this.currentImageUrl.set(product.imageUrl || null);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Produit introuvable.');
          this.loading.set(false);
        }
      });
    }
  }

  updateField(field: keyof ProductFormState, value: string) {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  // Génère un slug automatiquement à partir du nom (seulement en mode création)
  onNameChange(value: string) {
    this.updateField('name', value);
    if (!this.isEditMode()) {
      const slug = value
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // enlève les accents
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      this.updateField('slug', slug);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedFile.set(file);
    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  removeSelectedImage() {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
  }

  onSubmit() {
    this.submitAttempted.set(true);

    if (!this.isFormValid()) {
      this.error.set('Veuillez remplir les champs obligatoires (nom, slug, prix, description).');
      return;
    }

    this.error.set('');
    this.loading.set(true);

    // Si un nouveau fichier a été choisi, on l'upload d'abord
    if (this.selectedFile()) {
      this.uploading.set(true);
      this.uploadService.upload(this.selectedFile()!).subscribe({
        next: (res) => {
          this.uploading.set(false);
          this.saveProduct(res.url);
        },
        error: (err) => {
          this.uploading.set(false);
          this.loading.set(false);
          this.error.set("Erreur lors de l'upload de l'image : " + err.message);
        }
      });
    } else {
      // Pas de nouveau fichier : on garde l'image existante (ou null)
      this.saveProduct(this.currentImageUrl() ?? undefined);
    }
  }

  private saveProduct(imageUrl?: string) {
    const f = this.form();
    const payload: ProductPayload = {
      name: f.name.trim(),
      slug: f.slug.trim(),
      category: f.category,
      price: Number(f.price),
      originalPrice: f.originalPrice ? Number(f.originalPrice) : undefined,
      discount: f.discount ? Number(f.discount) : undefined,
      imageUrl,
      description: f.description.trim(),
      details: f.details.trim(),
      rating: f.rating ? Number(f.rating) : undefined,
      reviewCount: f.reviewCount ? Number(f.reviewCount) : undefined
    };

    const request = this.isEditMode()
      ? this.productService.update(this.productId()!, payload)
      : this.productService.create(payload);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.toastService.show(
          this.isEditMode() ? 'Produit modifié avec succès' : 'Produit ajouté avec succès'
        );
        this.router.navigate(['/produits']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Erreur lors de l\'enregistrement : ' + err.message);
      }
    });
  }
}