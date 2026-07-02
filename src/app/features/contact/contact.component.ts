import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface ContactForm {
  name: string;
  phone: string;
  email: string;
  message: string;
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

  submitted = signal(false);
  loading = signal(false);
  error = signal(false);

  updateField(field: keyof ContactForm, value: string) {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  isFormValid(): boolean {
    const f = this.form();
    return !!(f.name.trim() && f.email.trim() && f.message.trim());
  }

  onSubmit() {
    if (!this.isFormValid()) {
      this.error.set(true);
      setTimeout(() => this.error.set(false), 3000);
      return;
    }
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.submitted.set(true);
      this.form.set({ name: '', phone: '', email: '', message: '' });
    }, 1500);
  }

  resetForm() {
    this.submitted.set(false);
  }
}