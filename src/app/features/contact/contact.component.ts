import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface ContactForm {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface TouchedState {
  name: boolean;
  email: boolean;
  phone: boolean;
  message: boolean;
}

@Component({
    selector: 'app-contact',
    imports: [RouterLink, FormsModule],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent {

  form = signal<ContactForm>({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  // Suivi des champs "touchés" (blur) pour n'afficher les erreurs
  // qu'après une interaction réelle de l'utilisateur, pas au chargement.
  touched = signal<TouchedState>({
    name: false,
    email: false,
    phone: false,
    message: false
  });

  submitted = signal(false);
  loading = signal(false);
  error = signal(false);
  submitAttempted = signal(false);

  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Numéro tunisien local : exactement 8 chiffres, ex: 12345678
  private readonly phoneRegex = /^\d{8}$/;

  // Erreurs calculées par champ
  errors = computed(() => {
    const f = this.form();
    const phoneValue = f.phone.trim();
    return {
      name: !f.name.trim(),
      email: !f.email.trim() || !this.emailRegex.test(f.email.trim()),
      // Téléphone optionnel : erreur seulement s'il est rempli et mal formaté
      phone: phoneValue !== '' && !this.phoneRegex.test(phoneValue),
      message: !f.message.trim()
    };
  });

  isFormValid = computed(() => {
    const e = this.errors();
    return !e.name && !e.email && !e.phone && !e.message;
  });

  // Un champ affiche son erreur seulement s'il a été touché
  // OU si l'utilisateur a déjà tenté de soumettre le formulaire.
  shouldShowError(field: keyof TouchedState): boolean {
    return (this.touched()[field] || this.submitAttempted()) && this.errors()[field];
  }

  updateField(field: keyof ContactForm, value: string) {
    // Filtre de sécurité (couvre aussi le copier-coller) : le téléphone
    // n'accepte que des chiffres, limité à 8 caractères
    if (field === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 8);
    }
    this.form.update(f => ({ ...f, [field]: value }));
  }

  // Empêche la frappe de tout caractère non numérique dans le champ téléphone
  // (les lettres/symboles ne s'affichent jamais, pas de flicker)
  onPhoneKeydown(event: KeyboardEvent) {
    const allowedControlKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'
    ];

    // Autorise les raccourcis (Ctrl/Cmd + A/C/V/X)
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    if (allowedControlKeys.includes(event.key)) {
      return;
    }

    // Bloque tout ce qui n'est pas un chiffre 0-9
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  markTouched(field: keyof TouchedState) {
    this.touched.update(t => ({ ...t, [field]: true }));
  }

  onSubmit() {
    this.submitAttempted.set(true);

    if (!this.isFormValid()) {
      this.touched.set({ name: true, email: true, phone: true, message: true });
      this.error.set(true);
      setTimeout(() => this.error.set(false), 3000);
      return;
    }

    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.submitted.set(true);
      this.form.set({ name: '', phone: '', email: '', message: '' });
      this.touched.set({ name: false, email: false, phone: false, message: false });
      this.submitAttempted.set(false);
    }, 1500);
  }

  resetForm() {
    this.submitted.set(false);
  }
}