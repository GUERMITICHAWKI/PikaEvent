import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { OrderRequest } from '../../core/models/order.model';

interface CheckoutForm {
  name: string;
  phone: string;
  address: string;
  email: string;
}

interface TouchedState {
  name: boolean;
  phone: boolean;
  address: boolean;
  email: boolean;
}

@Component({
    selector: 'app-checkout',
    imports: [RouterLink],
    templateUrl: './checkout.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

  cartItems  = computed(() => this.cartService.cartItems());
  cartTotal  = computed(() => this.cartService.cartTotal());
  isEmpty    = computed(() => this.cartService.cartCount() === 0);

  form = signal<CheckoutForm>({
    name: '',
    phone: '',
    address: '',
    email: ''
  });

  touched = signal<TouchedState>({
    name: false,
    phone: false,
    address: false,
    email: false
  });

  submitted = signal(false);
  loading = signal(false);
  error = signal(false);
  errorMessage = signal('');
  submitAttempted = signal(false);

  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly phoneRegex = /^\d{8}$/;

  errors = computed(() => {
    const f = this.form();
    const emailValue = f.email.trim();
    return {
      name: !f.name.trim(),
      phone: !this.phoneRegex.test(f.phone.trim()),
      address: !f.address.trim(),
      // Email optionnel : erreur seulement si rempli et mal formaté
      email: emailValue !== '' && !this.emailRegex.test(emailValue)
    };
  });

  isFormValid = computed(() => {
    const e = this.errors();
    return !e.name && !e.phone && !e.address && !e.email;
  });

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  shouldShowError(field: keyof TouchedState): boolean {
    return (this.touched()[field] || this.submitAttempted()) && this.errors()[field];
  }

  updateField(field: keyof CheckoutForm, value: string) {
    if (field === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 8);
    }
    this.form.update(f => ({ ...f, [field]: value }));
  }

  onPhoneKeydown(event: KeyboardEvent) {
    const allowedControlKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'
    ];
    if (event.ctrlKey || event.metaKey) return;
    if (allowedControlKeys.includes(event.key)) return;
    if (!/^\d$/.test(event.key)) event.preventDefault();
  }

  markTouched(field: keyof TouchedState) {
    this.touched.update(t => ({ ...t, [field]: true }));
  }

  increase(productId: number, currentQty: number) {
    this.cartService.updateQty(productId, currentQty + 1);
  }

  decrease(productId: number, currentQty: number) {
    this.cartService.updateQty(productId, currentQty - 1);
  }

  remove(productId: number) {
    this.cartService.remove(productId);
  }

  formatPrice(price: number): string {
    return this.cartService.formatPrice(price);
  }

  onSubmit() {
    this.submitAttempted.set(true);

    if (this.isEmpty()) {
      this.errorMessage.set('Votre panier est vide.');
      this.error.set(true);
      setTimeout(() => this.error.set(false), 3000);
      return;
    }

    if (!this.isFormValid()) {
      this.touched.set({ name: true, phone: true, address: true, email: true });
      this.errorMessage.set('Veuillez remplir les champs obligatoires.');
      this.error.set(true);
      setTimeout(() => this.error.set(false), 3000);
      return;
    }

    const f = this.form();
    const payload: OrderRequest = {
      customerName: f.name.trim(),
      phone: f.phone.trim(),
      address: f.address.trim(),
      email: f.email.trim() || undefined,
      items: this.cartItems().map(i => ({
        productId: i.product.id,
        quantity: i.quantity
      }))
    };

    this.loading.set(true);

    this.orderService.create(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.submitted.set(true);
        this.cartService.clear();
      },
      error: (err) => {
        console.error('Erreur création commande', err);
        this.loading.set(false);
        this.errorMessage.set("Une erreur est survenue, veuillez réessayer.");
        this.error.set(true);
        setTimeout(() => this.error.set(false), 3000);
      }
    });
  }
}